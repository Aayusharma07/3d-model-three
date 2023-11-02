import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

$(document).ready(function () {

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(40, 800 / 512, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(800, 512);
renderer.setPixelRatio(1000 / 512);
renderer.setClearColor(0xeeeeee);
camera.updateProjectionMatrix();
document.getElementById("viewer").appendChild(renderer.domElement);

var compartments=[
  {
    color:"red",//red
    size:2,
    position:-.5
  },
  {
    color:"green",//green
    size:1,
    position:1
  }
];
for (const obj of compartments) {
    const boxGeometry = new THREE.BoxGeometry(obj.size, 1, 1);
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

const circleGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.2, 32);
const circleMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });

// Combine geometry and material into a mesh
const circle = new THREE.Mesh(circleGeometry, circleMaterial);

// Position the circle inside the box
circle.position.set(0, 0, 0);

// Add the circle to the box (not the scene)
compartments[0].box.add(circle);

const alertTexture = new THREE.TextureLoader().load('alert.png');
const alertMaterial = new THREE.SpriteMaterial({ map: alertTexture });
const alertIcon = new THREE.Sprite(alertMaterial);
alertIcon.scale.set(0.4, 0.4, 0.4); // Adjust the scale as needed
alertIcon.position.set(compartments[0].position, 0, .6); // Position the icon relative to the box
scene.add(alertIcon);

// Set up camera position
camera.position.z = 5;

// Create OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
controls.dampingFactor = 0.25;
controls.screenSpacePanning = false;
controls.maxPolarAngle = Math.PI / 2;

// Set up animation
const animate = () => {
  requestAnimationFrame(animate);

  // Add your animations or updates here

  controls.update(); // Update controls

  renderer.render(scene, camera);
};

animate();


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

  // Function to convert JSON to HTML table
  function jsonToTable(jsonData) {
      var table = '<table class="min-w-full bg-white border border-gray-300 shadow-md"><tbody>';
      // Create table rows
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
