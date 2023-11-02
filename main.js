import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';




// Create rendered
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(800, 512);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0xeeeeee);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.getElementById("viewer").appendChild(renderer.domElement);

// Create camera
const camera = new THREE.PerspectiveCamera(45, 800 / 512, 1, 1000);
camera.updateProjectionMatrix();
camera.position.set(4, 5, 8);

// Create OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.minPolarAngle = 0.5;
controls.maxPolarAngle = 2;
controls.autoRotate = false;

// Create Scenes
const scene = new THREE.Scene();

const compartments=[
  {
    color:"red",//red
    size:4,
    position:-2
  },
  {
    color:"green",//green
    size:3,
    position:1.5
  }
];
for (const obj of compartments) {
    const boxGeometry = new THREE.BoxGeometry(obj.size, 2.2, 1.5);
    const boxMaterial = new THREE.MeshStandardMaterial({
      color: obj.color,
      opacity: 1,
      transparent: true,
    });
    const box = new THREE.Mesh(boxGeometry, boxMaterial);
    box.position.x = obj.position;
    scene.add(box);
    obj.box = box;
    // const edgesGeometry = new THREE.EdgesGeometry(box);
    // const edgesMaterial = new THREE.LineBasicMaterial({
    //   color: "black",
    //   linewidth: 2,
    // });
    // const edges = new THREE.LineSegments(edgesGeometry, edgesMaterial);
    // edges.position.copy(box.position);
    // scene.add(edges);
    const ambientLight = new THREE.AmbientLight(0x404040);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1).normalize();
    scene.add(ambientLight, directionalLight);
}

// Create circle comparment box
const circleGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.2, 32);
const circleMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
const circle = new THREE.Mesh(circleGeometry, circleMaterial);
circle.position.set(2, 0, 0);
compartments[0].box.add(circle);

// Create icecreame comparment box
const icecreamTexture = new THREE.TextureLoader().load('icecream.png');
const icecreameMaterial = new THREE.SpriteMaterial({ map: icecreamTexture });
const icecreameIcon = new THREE.Sprite(icecreameMaterial);
icecreameIcon.scale.set(0.5, 0.5, 0.5);
icecreameIcon.position.set(compartments[0].position, 0, 1);
icecreameIcon.position.set(0, 0, 0);
compartments[0].box.add(icecreameIcon);
scene.add(icecreameIcon);

// Create alert over comparment box
const alertTexture = new THREE.TextureLoader().load('alert.png');
const alertMaterial = new THREE.SpriteMaterial({ map: alertTexture });
const alertIcon = new THREE.Sprite(alertMaterial);
alertIcon.scale.set(0.5, 0.5, 0.5);
alertIcon.position.set(compartments[0].position, 0, 1);
scene.add(alertIcon);

// Create Spot Lights
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

// Load original view
const loader = new GLTFLoader().setPath('http://localhost:5173/container/');
loader.load('scene.gltf', (gltf) => {
  const mesh = gltf.scene;
  mesh.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
  mesh.position.set(0, -1.72, -4);
  scene.add(mesh); 
});

// Set up animation
const animate = () => {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
};
animate();

$(document).ready(function () {
  $("#wireframe-view-btn").click(function () {
    compartments.forEach(obj => {
      obj.box.material.wireframe = true;
    });
  });

  $("#transparent-view-btn").click(function () {
    compartments.forEach(obj => {
      obj.box.material.wireframe = false;
      obj.box.material.opacity = 0.4;
    });
  });

  $("#uv-view-btn").click(function () {
    compartments.forEach(obj => {
      obj.box.material.wireframe = false;
      obj.box.material.opacity = 1;
    });
  });

  $(".viewer-btn").click(function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  var jsonData = [
    { "Name": "John", "Age": 30, "City": "New York" }
  ];

  function jsonToTable(jsonData) {
      var table = '<table class="min-w-full bg-white border border-gray-300 shadow-md"><tbody>';
      $.each(jsonData, function (index, row) {  
          $.each(row, function (key, value) {
            table += '<tr>';
            table += '<td class="py-2 px-4 border-b font-bold">' + key + '</td>';
              table += '<td class="py-2 px-4 border-b">' + value + '</td>';
              table += '</tr>';
          });
          
      });
      table += '</tbody></table>';
      return table;
  }

  // Display the table
  $('#info-popup').html(jsonToTable(jsonData));

});
