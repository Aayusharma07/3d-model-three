import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

let container3DModelMesh, compartments, carrierIcon, truDetails, sprite, carrierIcon2;

function getTemperatureColor(temperature) {
  // Normalize temperature to a value between 0 and 1
  const normalizedTemperature = (temperature - -20) / (40 - -20);

  // Interpolate between blue (cold) and red (hot)
  const r = Math.floor(255 * normalizedTemperature);
  const b = Math.floor(255 * (1 - normalizedTemperature));
  const g = 0;
  return `rgb(${r}, ${g}, ${b})`;
}

function createBox(obj, scene, color){
  const boxGeometry = new THREE.BoxGeometry(obj.width?obj.width:1.5, obj.height?obj.height:2.6, obj.size);
  const boxMaterial = new THREE.MeshStandardMaterial({
    color: color ? color:getTemperatureColor(obj.SetTemprature),
    opacity: 1,
    transparent: true,
  });
  const box = new THREE.Mesh(boxGeometry, boxMaterial);
  box.position.set(obj.position.x, obj.position.y, obj.position.z);
  box.visible = false;
  box.name = obj.Name;
  scene.add(box);
  obj.box = box;
  const ambientLight = new THREE.AmbientLight(0x404040);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(1, 1, 1).normalize();
  scene.add(ambientLight, directionalLight);
}

function addImage(compartment, scene){
  const logisticDetails = compartment.Logistic.HealthDetails.find(health => health.State === compartment.Alert.AlertDescription);
  const texture = new THREE.TextureLoader().load(logisticDetails.Image);
  const material = new THREE.SpriteMaterial({ map: texture });
  const mesh = new THREE.Sprite(material);
  mesh.scale.set(0.5, 0.5, 0.5);
  mesh.name = compartment.Logistic.LogisticType;
  
  const boxCenter = new THREE.Vector3();
  compartment.box.geometry.computeBoundingBox();
  compartment.box.geometry.boundingBox.getCenter(boxCenter);
  compartment.box.localToWorld(boxCenter);
  mesh.position.copy(boxCenter);

  compartment.box.add(mesh);
  scene.add(mesh);
}

function addAlert(compartment, scene){
  const alertTexture = new THREE.TextureLoader().load(compartment.Alert.Image);
  const alertMaterial = new THREE.SpriteMaterial({ map: alertTexture });
  const alertIcon = new THREE.Sprite(alertMaterial);
  alertIcon.scale.set(0.5, 0.5, 0.5);
  alertIcon.name="Alert"
  
  const boxCenter = new THREE.Vector3();
  compartment.box.geometry.computeBoundingBox();
  compartment.box.geometry.boundingBox.getCenter(boxCenter);
  compartment.box.localToWorld(boxCenter);
  alertIcon.position.copy(boxCenter);
  alertIcon.position.y += 1.6;

  scene.add(alertIcon);
  sprite = alertIcon;
}

function addSpotLights(scene){
    const spotLight1 = new THREE.SpotLight(0xeeeeee, 5, 100, 0.5, 0);
    const spotLight2 = new THREE.SpotLight(0xeeeeee, 5, 100, 0.5, 0);
    const spotLight3 = new THREE.SpotLight(0xeeeeee, 50, 100, 1, 1);
  
    spotLight1.position.set(25, 10, 15);
    spotLight2.position.set(-25, 5, 15);
    spotLight3.position.set(0, 20, -15);
  
    spotLight1.castShadow = false;
    spotLight1.shadow.bias = -0.0001;
    spotLight2.castShadow = false;
    spotLight2.shadow.bias = -0.0001;
    spotLight3.castShadow = true;
    spotLight3.shadow.bias = -0.0001;
  
    spotLight1.name = "spotLight1"
    spotLight2.name = "spotLight2"
    spotLight3.name = "spotLight3"
  
    scene.add(spotLight1);
    scene.add(spotLight2);
    scene.add(spotLight3);
}

function load3DModel(ThreeDModel, scene){
    const loader = new GLTFLoader().setPath(ThreeDModel);
    loader.load("scene.gltf", (gltf) => {
      container3DModelMesh = gltf.scene;
      container3DModelMesh.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      container3DModelMesh.position.set(1, -0.5, -4);
      container3DModelMesh.name="3dModel";
      scene.add(container3DModelMesh);
    });
}

function addCarrierLogo(scene){
    const logoTexture = new THREE.TextureLoader().load('/img/logo.png');
    const logoMaterial = new THREE.MeshBasicMaterial({ map: logoTexture });
    const planeGeometry = new THREE.PlaneGeometry(1.1, 0.5);
    carrierIcon = new THREE.Mesh(planeGeometry, logoMaterial);
    carrierIcon.position.set(1, 1.7, -4.4);
    carrierIcon.name = "logo"
    carrierIcon.rotation.y = Math.PI;
    scene.add(carrierIcon);


    const planeGeometry2 = new THREE.PlaneGeometry(2.1, 1);
    carrierIcon2 = new THREE.Mesh(planeGeometry2, logoMaterial);
    carrierIcon2.position.set(3, 1, 1);
    scene.add(carrierIcon2);

}

function show3DModel(asset) {
  compartments = asset.Compartments;
  truDetails = asset.TRUDetails;

  // Create rendered
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(800, 512);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setClearColor(0xeeeeee);
  document.getElementById("viewer").appendChild(renderer.domElement);

  // Create camera
  const camera = new THREE.PerspectiveCamera(55, 800 / 512, 1, 1000);
  camera.updateProjectionMatrix();
  camera.position.set(3, 3, 8);

  // Create OrbitControls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.minPolarAngle = 0.5;
  controls.maxPolarAngle = 2;
  controls.autoRotate = false;

  // Create Scenes
  const scene = new THREE.Scene();

  load3DModel(asset.ThreeDModel, scene);
  addCarrierLogo(scene);
  for (const compartment of compartments) {
    createBox(compartment, scene);
    addImage(compartment, scene);
    if(compartment.Alert.HasAlert){
      addAlert(compartment, scene);
    }
  }
  createBox(truDetails, scene, "black");
  addSpotLights(scene);

  // Set up animation
  const animate = () => {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  };
  animate();

  // ---------------------------------------------------------

  function showPopup(x, y, name) {
    popup.style.display = 'block';
    popup.style.left = x + 'px';
    popup.style.top = y + 'px';
    popup.innerHTML = name + ' Clicked!';
  }

  function hidePopup() {
    popup.style.display = 'none';
  }

  // Handle hover events
  var raycaster = new THREE.Raycaster();
  var mouse = new THREE.Vector2();
  var popup = document.getElementById('popup');

  function onMouseClick(event) {
    mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
    mouse.y = -(event.clientY /renderer.domElement.clientHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    var intersects = raycaster.intersectObjects(scene.children, true);
    if (intersects.length > 0) {
      const clickedObject = intersects.find(intersect => intersect.object.geometry.type != 'BufferGeometry');
      //var clickedObject = intersects[0].object;
      if(clickedObject.object){
        
        if (clickedObject.uv !== undefined) {
          // Log the object's position (x, y)
          console.log('Object Position (x, y):',mouse.x, clickedObject.uv.x, clickedObject.uv.y,  mouse.y);
          showPopup(event.clientX, event.clientY, clickedObject.object.name);
        } else {
          console.log('Object has no position.');
        }
      }
    } else {
      hidePopup();
    }
  }

  window.addEventListener('click', onMouseClick, false);
}

$(document).ready(function () {
  $.getJSON("http://localhost:3000/api/data", function (data) {
    console.log("Data:", data);
    const hashAssetId = window.location.hash.replace("#", "");
    const asset = data.find(asset=>asset.AssetId == hashAssetId)
    show3DModel(asset);
    $("#info-popup").html(jsonToTable(compartments));

    const source = $("#driverDetailsHB").html();
    const template = Handlebars.compile(source);
    const html = template(asset.DriverDetails);
    $("#driverDetails").html(html);
  });

  $("#wireframe-view-btn").click(function () {
    container3DModelMesh.visible = false;
    carrierIcon.visible = false;
    compartments.forEach((obj) => {
      obj.box.visible = true;
      obj.box.material.wireframe = true;
    });
    truDetails.box.visible = true;
    truDetails.box.material.wireframe = true;
  });

  $("#transparent-view-btn").click(function () {
    container3DModelMesh.visible = false;
    carrierIcon.visible = false;
    compartments.forEach((obj) => {
      obj.box.visible = true;
      obj.box.material.wireframe = false;
      obj.box.material.opacity = 0.4;
    });
    truDetails.box.visible = true;
    truDetails.box.material.wireframe = false;    
    truDetails.box.material.opacity = 0.4;
  });

  $("#uv-view-btn").click(function () {
    container3DModelMesh.visible = false;
    carrierIcon.visible = false;
    compartments.forEach((obj) => {
      obj.box.visible = true;
      obj.box.material.wireframe = false;
      obj.box.material.opacity = 1;
    });
    truDetails.box.visible = true;
    truDetails.box.material.wireframe = false;    
    truDetails.box.material.opacity = 1;
  });

  $("#original-view-btn").click(function () {
    container3DModelMesh.visible = true;
    carrierIcon.visible = true;
    compartments.forEach((obj) => {
      obj.box.visible = false;
    });
    truDetails.box.visible = false;
  });

  $(".viewer-btn").click(function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });  

  function jsonToTable(compartments) {
    var table =
      '<table class="min-w-full bg-white border border-gray-300 shadow-md"><thead>';
      table += "<tr>";
        table += '<th class="py-2 px-4 border-b">Name</th>';
        table += '<th class="py-2 px-4 border-b">&deg;C</th>';
        table += '<th class="py-2 px-4 border-b">Cargo</th>';
        table += `<th class="py-2 px-4 border-b font-bold">Current State</th>`;
        table += "</tr></thead><tbody>"; 
    $.each(compartments, function (index, compartment) {
        table += "<tr>";
        table += '<td class="py-2 px-4 border-b">' + compartment.Name + "</td>";
        table += '<td class="py-2 px-4 border-b">' + compartment.SetTemprature + "&deg;C</td>";
        table += '<td class="py-2 px-4 border-b">' + compartment.Logistic.LogisticType + "</td>";
        table += `<td class="py-2 px-4 border-b font-bold ${compartment.Alert.HasAlert ? "bg-red-500" : "bg-green-400"}">${compartment.Alert.AlertDescription}</td>`;
        table += "</tr>";
    });
    table += "</tbody></table>";
    return table;
  }
});
