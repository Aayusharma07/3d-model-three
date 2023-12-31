import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.outputColorSpace = THREE.SRGBColorSpace;

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xeeeeee);
renderer.setPixelRatio(window.devicePixelRatio);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(4, 5, 11);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.minPolarAngle = 0.5;
controls.maxPolarAngle = 2;
controls.autoRotate = false;

const spotLight1 = new THREE.SpotLight(0xffffff,  5, 100, .5, 0);
const spotLight2 = new THREE.SpotLight(0xffffff,  5, 100, .5, 0);
const spotLight3 = new THREE.SpotLight(0xffffff,  50, 100, 1, 1);

spotLight1.position.set(25, 10, 15);
spotLight2.position.set(-25, 5, 15);
spotLight3.position.set(0, 20, -15);

spotLight1.castShadow = false;
spotLight1.shadow.bias = -0.0001;
spotLight2.castShadow = false;
spotLight2.shadow.bias = -0.0001;
spotLight3.castShadow = true;
spotLight3.shadow.bias = -0.0001;

scene.add(spotLight1);
scene.add(spotLight2);
scene.add(spotLight3);

const loader = new GLTFLoader().setPath('/3dmodel/container/');
loader.load('scene.gltf', (gltf) => {
  const mesh = gltf.scene;

  mesh.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  mesh.position.set(0, 1.05, -4);
  scene.add(mesh); 
});

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

animate();