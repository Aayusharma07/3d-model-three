import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, 800 / 512, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(800, 512);
renderer.setPixelRatio(1000 / 512);
renderer.setClearColor(0xeeeeee);
camera.updateProjectionMatrix();
document.getElementById("viewer").appendChild(renderer.domElement);

// Create a red box
const redBoxGeometry = new THREE.BoxGeometry(2, 1, 1);
const redBoxMaterial = new THREE.MeshBasicMaterial({
  color: 0xff0000,
  opacity: 1,
  transparent: true,
}); // Red color
const redBox = new THREE.Mesh(redBoxGeometry, redBoxMaterial);
scene.add(redBox);

// Create a green box next to the red box
const greenBoxGeometry = new THREE.BoxGeometry();
const greenBoxMaterial = new THREE.MeshBasicMaterial({
  color: 0x00ff00,
  opacity: 1,
  transparent: true,
}); // Green color
const greenBox = new THREE.Mesh(greenBoxGeometry, greenBoxMaterial);
greenBox.position.x = 1.5; // Adjust the position to be next to the red box
scene.add(greenBox);

// Create a green box next to the red box
const blueBoxGeometry = new THREE.BoxGeometry();
const blueBoxMaterial = new THREE.MeshBasicMaterial({
  color: 0x0000ff,
  opacity: 1,
  transparent: true,
}); // Blue color
const blueBox = new THREE.Mesh(blueBoxGeometry, blueBoxMaterial);
blueBox.position.x = -1.5; // Adjust the position to be next to the red box
scene.add(blueBox);

const edgesGeometry = new THREE.EdgesGeometry(blueBoxGeometry);
const edgesMaterial = new THREE.LineBasicMaterial({
  color: 0x000000,
  linewidth: 2,
});
const edges = new THREE.LineSegments(edgesGeometry, edgesMaterial);
edges.position.copy(blueBox.position);
scene.add(edges);

const redEdgesGeometry = new THREE.EdgesGeometry(redBoxGeometry);
const redEdgesMaterial = new THREE.LineBasicMaterial({
  color: 0x000000,
  linewidth: 2,
});
const redEdges = new THREE.LineSegments(redEdgesGeometry, redEdgesMaterial);
redEdges.position.copy(redBox.position);
scene.add(redEdges);

const greenEdgesGeometry = new THREE.EdgesGeometry(greenBoxGeometry);
const greenEdgesMaterial = new THREE.LineBasicMaterial({
  color: 0x000000,
  linewidth: 2,
});
const greenEdges = new THREE.LineSegments(
  greenEdgesGeometry,
  greenEdgesMaterial
);
greenEdges.position.copy(greenBox.position);
scene.add(greenEdges);

const circleGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.2, 32);
const circleMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });

// Combine geometry and material into a mesh
const circle = new THREE.Mesh(circleGeometry, circleMaterial);

// Position the circle inside the box
circle.position.set(0, 0, 0);

// Add the circle to the box (not the scene)
redBox.add(circle);

const alertTexture = new THREE.TextureLoader().load('alert.png');
const alertMaterial = new THREE.SpriteMaterial({ map: alertTexture });
const alertIcon = new THREE.Sprite(alertMaterial);
alertIcon.scale.set(0.4, 0.4, 0.4); // Adjust the scale as needed
alertIcon.position.set(-1.5, 0, .6); // Position the icon relative to the box
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

var mouse, raycaster;

raycaster = new THREE.Raycaster();
mouse = new THREE.Vector2();
function onClick(event) {
  // Calculate mouse position in normalized device coordinates (-1 to +1) for the raycaster
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Set the raycaster to use the mouse coordinates
  raycaster.setFromCamera(mouse, camera);

  // Check for intersections
  var intersects = raycaster.intersectObjects([redBox]);

  if (intersects.length > 0) {
    // If the ray intersects with the box or sprite, apply a hover effect
    redBox.material.color.set(0x00ff00); // Reset box color
    var content = document.getElementById("infoTable");
    content.classList.toggle("hidden");
  } else {
    // If no intersection, reset the hover effect

    redBox.material.color.set(0xff0000); // Change box color to red for hover effect
  }
}

document.addEventListener("click", onClick, false);

$(document).ready(function () {
  // Attach a click event handler to an element with the id "myButton"
  $("#wireframe-view-btn").click(function () {
    // Code to be executed when the element is clicked
    redBox.material.wireframe = true;
    blueBox.material.wireframe = true;
    greenBox.material.wireframe = true;
  });

  $("#transparent-view-btn").click(function () {
    // Code to be executed when the element is clicked
    redBox.material.wireframe = false;
    blueBox.material.wireframe = false;
    greenBox.material.wireframe = false;

    redBox.material.opacity = 0.4;
    blueBox.material.opacity = 0.4;
    greenBox.material.opacity = 0.4;
  });

  $("#uv-view-btn").click(function () {
    // Code to be executed when the element is clicked
    redBox.material.wireframe = false;
    blueBox.material.wireframe = false;
    greenBox.material.wireframe = false;

    redBox.material.opacity = 1;
    blueBox.material.opacity = 1;
    greenBox.material.opacity = 1;
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
