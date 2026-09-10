import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

const clamp = (x: number) => Math.max(0, Math.min(1, x));
const smooth = (a: number, b: number, x: number) => { const t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t); };
const pulse = (a: number, b: number, x: number) => Math.sin(Math.PI * smooth(a, b, x));

// A continuous folded surface shared by the solid hemispheres and their filaments.
function surface(side: number, theta: number, phi: number) {
  const nx = Math.sin(theta) * Math.cos(phi), ny = Math.cos(theta), nz = Math.sin(theta) * Math.sin(phi);
  const foldA = Math.sin(ny * 18 + Math.sin(nz * 7) * 2.4 + Math.sin(nx * 9));
  const foldB = Math.sin(nz * 18 - Math.sin(ny * 8) * 2.1 + nx * 5);
  const fold = Math.pow(Math.abs(foldA * 0.7 + foldB * 0.3), 0.55);
  const outer = smooth(-0.95, -0.4, nx);
  const relief = (0.035 + fold * 0.10) * outer;
  return new THREE.Vector3(side * (0.49 + nx * (0.45 + relief)), ny * (0.90 + relief), nz * (0.78 + relief));
}

export function createBrainScene(canvas: HTMLCanvasElement) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: false, antialias: true, powerPreference: "low-power" });
  renderer.setClearColor(0x030506);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-3, 3, 2.1, -2.1, 0.1, 40);
  camera.position.set(0, 0, 7);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const environment = pmrem.fromScene(room, 0.06);
  scene.environment = environment.texture;
  room.dispose(); pmrem.dispose();
  scene.add(new THREE.HemisphereLight(0xffebce, 0x171009, 1.8));
  const key = new THREE.DirectionalLight(0xffe5af, 4.5); key.position.set(-3, 4, 5); scene.add(key);
  const rim = new THREE.DirectionalLight(0xffa73c, 3); rim.position.set(3, 1, -3); scene.add(rim);
  const fill = new THREE.DirectionalLight(0xffefce, 1.4); fill.position.set(1, -2, 4); scene.add(fill);
  const assembly = new THREE.Group(); scene.add(assembly);
  const brain = new THREE.Group(); assembly.add(brain);
  const gold = new THREE.MeshStandardMaterial({ color: 0xc38b3c, metalness: 0.72, roughness: 0.34, transparent: true });
  const geometries: THREE.BufferGeometry[] = [];

  for (const side of [-1, 1]) {
    const geometry = new THREE.SphereGeometry(1, 128, 96);
    const position = geometry.attributes.position;
    for (let i = 0; i < position.count; i++) {
      const x = position.getX(i), y = position.getY(i), z = position.getZ(i);
      const v = surface(side, Math.acos(Math.max(-1, Math.min(1, y))), Math.atan2(z, x));
      position.setXYZ(i, v.x, v.y, v.z);
    }
    if (side < 0 && geometry.index) {
      for (let i = 0; i < geometry.index.count; i += 3) {
        const a = geometry.index.getX(i);
        geometry.index.setX(i, geometry.index.getX(i + 2)); geometry.index.setX(i + 2, a);
      }
    }
    geometry.computeVertexNormals(); geometries.push(geometry);
    const mesh = new THREE.Mesh(geometry, gold); brain.add(mesh);
  }
  // Smaller striated lobes and a tapering stem complete the silhouette.
  for (const side of [-1, 1]) {
    const geometry = new THREE.SphereGeometry(1, 64, 40);
    const pos = geometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
      const rib = 1 + 0.035 * Math.sin(y * 55 + x * 5);
      pos.setXYZ(i, side * 0.27 + x * 0.30 * rib, -0.80 + y * 0.27, -0.12 + z * 0.47 * rib);
    }
    geometry.computeVertexNormals(); geometries.push(geometry); brain.add(new THREE.Mesh(geometry, gold));
  }
  const stemGeometry = new THREE.CylinderGeometry(0.11, 0.045, 0.46, 24);
  const stem = new THREE.Mesh(stemGeometry, gold); stem.position.set(0, -1.03, -0.18); stem.rotation.x = -0.13;
  brain.add(stem); geometries.push(stemGeometry);

  const strands = 160, steps = 26;
  const bases: THREE.Vector3[][] = [];
  for (let s = 0; s < strands; s++) {
    const side = s % 2 ? 1 : -1;
    const band = Math.floor(s / 2) / (strands / 2);
    const path: THREE.Vector3[] = [];
    for (let j = 0; j <= steps; j++) {
      const t = j / steps;
      const theta = 0.12 + band * (Math.PI - 0.24) + Math.sin(t * 9 + band * 19) * 0.045;
      const phi = t * Math.PI * 2 + Math.sin(band * 22) * 0.3;
      path.push(surface(side, theta, phi).multiplyScalar(1.007));
    }
    bases.push(path);
  }
  const positions = new Float32Array(strands * steps * 6);
  const colors = new Float32Array(positions.length);
  for (let i = 0; i < colors.length; i += 3) { colors[i] = 1; colors[i + 1] = 0.66 + 0.24 * Math.sin(i * 0.013) ** 2; colors[i + 2] = 0.29; }
  const filamentsGeometry = new THREE.BufferGeometry();
  filamentsGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3).setUsage(THREE.DynamicDrawUsage));
  filamentsGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geometries.push(filamentsGeometry);
  const filamentMaterial = new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending, depthWrite: false });
  const filaments = new THREE.LineSegments(filamentsGeometry, filamentMaterial);
  filaments.frustumCulled = false; assembly.add(filaments);
  const sparksGeometry = new THREE.BufferGeometry();
  const sparksArray = new Float32Array(strands * 3);
  sparksGeometry.setAttribute("position", new THREE.BufferAttribute(sparksArray, 3)); geometries.push(sparksGeometry);
  const sparkMaterial = new THREE.PointsMaterial({ color: 0xffdf9c, size: 0.023, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false });
  const sparks = new THREE.Points(sparksGeometry, sparkMaterial); sparks.frustumCulled = false; assembly.add(sparks);
  let w = 0, h = 0;
  const temporary = new THREE.Vector3();

  const render = (progress: number, width: number, height: number, pointerX: number, pointerY: number, reduced: boolean) => {
    if (width !== w || height !== h) {
      w = width; h = height; renderer.setSize(w, h, false);
      camera.left = -2.1 * w / h; camera.right = 2.1 * w / h; camera.updateProjectionMatrix();
    }
    const p = reduced ? 0 : progress;
    const gate = smooth(0.77, 0.90, p);
    const release = Math.max(pulse(0.065, 0.35, p), pulse(0.39, 0.69, p) * 0.9);
    const mobile = width < 760, aspect = w / h;
    const scale = mobile ? Math.min(0.78, aspect * 1.12) : Math.min(1.15, aspect * 0.58);
    assembly.position.set((mobile ? 0 : aspect * 2.1 * 0.36) * (1 - gate), (mobile ? 0.77 : 0.04) * (1 - gate), 0);
    assembly.scale.setScalar(scale * (1 + smooth(0.90, 1, p) * 4));
    assembly.rotation.set((Math.sin(p * 9) * 0.16 + pointerY * 0.10) * (1 - gate), (p * Math.PI * 2 + pointerX * 0.14) * (1 - gate), Math.sin(p * 8) * 0.08 * (1 - gate));
    gold.opacity = (1 - smooth(0.20, 0.90, release) * 0.96) * (1 - gate);
    gold.depthWrite = gold.opacity > 0.5;
    brain.visible = gold.opacity > 0.01;
    filamentMaterial.opacity = 0.17 + release * 0.65 + gate * 0.55;
    sparkMaterial.opacity = 0.4 + release * 0.5;
    let cursor = 0;
    for (let s = 0; s < strands; s++) {
      const seed = s / strands;
      const evaluate = (j: number) => {
        const t = j / steps, base = bases[s][j];
        const wave = Math.sin(t * Math.PI); // Both ends remain attached to their original folds.
        const angle = t * 6.283 + seed * 12.56 + p * 6;
        temporary.set(
          base.x + Math.cos(angle) * release * wave * (1.2 + seed * 0.6),
          base.y + Math.sin(angle * 0.85 + seed * 7) * release * wave * 0.95,
          base.z + Math.sin(angle) * release * wave * 1.15,
        );
        const ringAngle = t * 6.283 + seed * 0.6;
        const radius = 0.93 + seed * 0.24;
        temporary.x += (Math.cos(ringAngle) * radius - temporary.x) * gate;
        temporary.y += (Math.sin(ringAngle) * radius * 1.2 - temporary.y) * gate;
        temporary.z += ((seed - 0.5) * 0.45 - temporary.z) * gate;
        return temporary;
      };
      for (let j = 0; j < steps; j++) {
        for (const k of [j, j + 1]) {
          const v = evaluate(k); positions[cursor++] = v.x; positions[cursor++] = v.y; positions[cursor++] = v.z;
        }
      }
      const spark = evaluate(Math.round(((seed + p * 1.8) % 1) * steps));
      sparksArray[s * 3] = spark.x; sparksArray[s * 3 + 1] = spark.y; sparksArray[s * 3 + 2] = spark.z;
    }
    filamentsGeometry.attributes.position.needsUpdate = true;
    sparksGeometry.attributes.position.needsUpdate = true;
    renderer.render(scene, camera);
  };
  return { render, dispose() { geometries.forEach(g => g.dispose()); gold.dispose(); filamentMaterial.dispose(); sparkMaterial.dispose(); environment.dispose(); renderer.dispose(); } };
}
