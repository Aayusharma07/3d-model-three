import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { createBox } from './box';

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xeeeeee);
    document.getElementById("3dmodel").appendChild(renderer.domElement);

    // Create a red box
    const redBoxGeometry = new THREE.BoxGeometry(2, 1, 1);
    const redBoxMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, opacity: 0.3, transparent: true   }); // Red color
    const redBox = new THREE.Mesh(redBoxGeometry, redBoxMaterial);
    scene.add(redBox);

    // Create a green box next to the red box
    const greenBoxGeometry = new THREE.BoxGeometry();
    const greenBoxMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 }); // Green color
    const greenBox = new THREE.Mesh(greenBoxGeometry, greenBoxMaterial);
    greenBox.position.x = 1.5; // Adjust the position to be next to the red box
    scene.add(greenBox);

     // Create a green box next to the red box
     const blueBoxGeometry = new THREE.BoxGeometry();
     const blueBoxMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff }); // Blue color
     const blueBox = new THREE.Mesh(blueBoxGeometry, blueBoxMaterial);
     blueBox.position.x = -1.5; // Adjust the position to be next to the red box
     scene.add(blueBox);

     const edgesGeometry = new THREE.EdgesGeometry(blueBoxGeometry);
     const edgesMaterial = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 3 });
     const edges = new THREE.LineSegments(edgesGeometry, edgesMaterial);
     edges.position.copy(blueBox.position);
     scene.add(edges);

     const redEdgesGeometry = new THREE.EdgesGeometry(redBoxGeometry);
     const redEdgesMaterial = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 3});
     const redEdges = new THREE.LineSegments(redEdgesGeometry, redEdgesMaterial);
     redEdges.position.copy(redBox.position);
     scene.add(redEdges);

     const greenEdgesGeometry = new THREE.EdgesGeometry(greenBoxGeometry);
     const greenEdgesMaterial = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 3 });
     const greenEdges = new THREE.LineSegments(greenEdgesGeometry, greenEdgesMaterial);
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

    document.querySelector('#vehicle1')
        .addEventListener('change', function()
    {
      redBox.material.wireframe = !redBox.material.wireframe;
      blueBox.material.wireframe = !blueBox.material.wireframe;
      greenBox.material.wireframe = !greenBox.material.wireframe;
    }, false);

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

  document.addEventListener('click', onClick, false);