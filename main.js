import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Create a red box
    const redBoxGeometry = new THREE.BoxGeometry();
    const redBoxMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // Red color
    const redBox = new THREE.Mesh(redBoxGeometry, redBoxMaterial);
    scene.add(redBox);

    // Create a green box next to the red box
    const greenBoxGeometry = new THREE.BoxGeometry();
    const greenBoxMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 }); // Green color
    const greenBox = new THREE.Mesh(greenBoxGeometry, greenBoxMaterial);
    greenBox.position.x = 1; // Adjust the position to be next to the red box
    scene.add(greenBox);

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
