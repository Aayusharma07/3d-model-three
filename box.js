import * as THREE from 'three';

export function createBox(scene){
    // Create boxes
    const boxData = [
        { color: 0x00ff00, position: { x: -2.5, y: 0, z: 0 } },
        { color: 0xff0000, position: { x: 0, y: 0, z: 0 } },
        { color: 0x0000ff, position: { x: 2.5, y: 0, z: 0 } }
    ];

    for (const i = 0; i < boxData.length; i++) {
        const data = boxData[i];

        // Create a box geometry
        const geometry = new THREE.BoxGeometry(2, 1, 1);

        // Create a basic material for the box
        const material = new THREE.MeshBasicMaterial({ color: data.color });

        // Combine geometry and material into a mesh
        const box = new THREE.Mesh(geometry, material);

        // Position the box
        box.position.set(data.position.x, data.position.y, data.position.z);

        // Add the box to the scene
        scene.add(box);
        boxes.push(box);

        // Create a border box
        const borderGeometry = new THREE.BoxGeometry(2.05, 1.05, 1.05); // Slightly larger dimensions
        const borderMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true });
        const borderBox = new THREE.Mesh(borderGeometry, borderMaterial);

        // Position the border box the same as the corresponding box
        borderBox.position.set(data.position.x, data.position.y, data.position.z);

        // Add the border box to the scene
        scene.add(borderBox);
    }
};