import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

const clamp = (x: number) => Math.max(0, Math.min(1, x));
const smooth = (a: number, b: number, x: number) => { const t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t); };
const pulse = (a: number, b: number, x: number) => Math.sin(Math.PI * smooth(a, b, x));

export type BrainData = { meshes: { positions: number[]; indices: number[]; shade: number[] }[]; paths: number[][] };

export function createBrainScene(canvas: HTMLCanvasElement, model: BrainData) {
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
  const rim = new THREE.DirectionalLight(0xffe8c4, 3); rim.position.set(1, 2, -3); scene.add(rim);
  const fill = new THREE.DirectionalLight(0xffefce, 1.4); fill.position.set(1, -2, 4); scene.add(fill);
  const assembly = new THREE.Group(); scene.add(assembly);
  const brain = new THREE.Group(); assembly.add(brain);
  const gold = new THREE.MeshStandardMaterial({ color: 0xd9a552, metalness: 0.62, roughness: 0.34, transparent: true, vertexColors: true });
  const geometries: THREE.BufferGeometry[] = [];

  for (const part of model.meshes) {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(part.positions, 3));
    geometry.setIndex(part.indices);
    const colors = new Float32Array(part.shade.length * 3);
    part.shade.forEach((shade, i) => {
      colors[i * 3] = shade;
      colors[i * 3 + 1] = shade;
      colors[i * 3 + 2] = shade;
    });
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geometry.computeVertexNormals(); geometries.push(geometry);
    brain.add(new THREE.Mesh(geometry, gold));
  }
  // Filament roots follow the actual cortical mesh instead of an invented sphere.
  const bases = model.paths.map(path => {
    const vertices: THREE.Vector3[] = [];
    for (let i = 0; i < path.length; i += 3) vertices.push(new THREE.Vector3(path[i], path[i + 1], path[i + 2]));
    return vertices;
  });
  const strands = bases.length, steps = bases[0].length - 1;
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
  // Light is rendered directly with shaders, without image textures or bloom buffers.
  const glowVertex = `varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`;
  const portal = new THREE.Group(); assembly.add(portal);
  const ringGeometry = new THREE.TorusGeometry(1.05, 0.021, 12, 160); geometries.push(ringGeometry);
  const ringMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, toneMapped: false });
  const ring = new THREE.Mesh(ringGeometry, ringMaterial); ring.scale.y = 1.2; portal.add(ring);
  const ringGlowMaterial = new THREE.ShaderMaterial({
    uniforms: { strength: { value: 0 } }, vertexShader: glowVertex,
    fragmentShader: `varying vec2 vUv; uniform float strength;
      void main(){vec2 p=(vUv-.5)*3.6;float d=abs(length(p)-1.05);
      float r=length(p);
      float rim=exp(-d*d/0.0025)*.9+exp(-d*d/0.022)*.24;
      float inside=(1.-smoothstep(.70,1.05,r))*.82;
      float spill=exp(-r*r/1.0)*.18;
      gl_FragColor=vec4(vec3(1.)*(rim+inside+spill)*strength,1.);}`,
    transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false,
  });
  const ringGlowGeometry = new THREE.PlaneGeometry(3.6, 4.32); geometries.push(ringGlowGeometry);
  const ringGlow = new THREE.Mesh(ringGlowGeometry, ringGlowMaterial); ringGlow.position.z = 0.1; portal.add(ringGlow);
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
    assembly.rotation.set((Math.sin(p * 9) * 0.16 + pointerY * 0.10) * (1 - gate), (p * Math.PI * 1.65 + pointerX * 0.14) * (1 - gate), Math.sin(p * 8) * 0.08 * (1 - gate));
    filamentMaterial.color.setRGB(1, 1, 1);
    for (let i = 0; i < colors.length; i += 3) {
      colors[i + 1] = (0.66 + 0.24 * Math.sin(i * 0.013) ** 2) * (1 - gate) + gate;
      colors[i + 2] = 0.29 + 0.71 * gate;
    }
    filamentsGeometry.attributes.color.needsUpdate = true;
    sparkMaterial.color.setRGB(1, 0.74 + gate * 0.26, 0.37 + gate * 0.63);
    portal.visible = gate > 0.01;
    ringMaterial.opacity = gate;
    ringGlowMaterial.uniforms.strength.value = gate * 1.25;
    gold.opacity = (1 - smooth(0.20, 0.90, release) * 0.96) * (1 - gate);
    gold.depthWrite = gold.opacity > 0.5;
    brain.visible = gold.opacity > 0.01;
    filamentMaterial.opacity = 0.10 + release * 0.65 + gate * 0.28;
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
  return { render, dispose() { geometries.forEach(g => g.dispose()); gold.dispose(); filamentMaterial.dispose(); sparkMaterial.dispose(); ringMaterial.dispose(); ringGlowMaterial.dispose(); environment.dispose(); renderer.dispose(); } };
}
