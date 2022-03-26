import './style.css';

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
const scene = new THREE.Scene();

//this type of camera is designed to mimic what a human ey ball views

const fieldView = 75; // the extend of the scene that is displayed on the screen for any given moment (the value is in degrees)

const aspectRatio = innerWidth / innerHeight; // best to use innerWidth /  height to avoid having a squished image

const near = 0.1; // elements closer than this value will not be rendered

const far = 1000; // elements far away from the camera than this value will not be rendered

const camera = new THREE.PerspectiveCamera(fieldView, aspectRatio, near, far);

// in addition to WebGLRenderer, three.js comes with a few others (often used as fallbacks for users with old browser, or browsers that don't support WebGL)
// render is like saying draw
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(devicePixelRatio); // setting pixel ratio to the device pixel ratio
renderer.setSize(innerWidth, innerHeight); // make it full screen by setting the render size equal to the window size

camera.position.setZ(30);

renderer.render(scene, camera);

//since now we only have a blank canvas waiting for use to give it stuff. let's create stuff to give it
const radius = 10;
const tube = 3;
const radialSegments = 16;
const tubularSegments = 100;
const arc = 30;
const donut = new THREE.TorusGeometry(
  radius,
  tube,
  radialSegments,
  tubularSegments
);

//think of material as rapping paper for geometry (how do we want it to look from the outside?)
//There are many other materials build into three.js, for different use cases. but imma use Mesh for this example
// You can write your own custom shaders with WebGL to use as materials
const wireFrame = true; // so we can get a better look to its geometry
const materialCube = new THREE.MeshBasicMaterial({
  color: 'blue',
  wireframe: wireFrame,
}); //mesh does not require any light source

//now combine the geomatry and material with mesh
const torus = new THREE.Mesh(donut, materialCube);
torus.rotateX(45);
scene.add(torus);

// we make the scene more interactive by adding OrbitControls (Which allow us to move arround the scene using our mouse)
const controls = new OrbitControls(camera, renderer.domElement); //this will listen to dom events on the mouse, and update camera accordingly

//to actually see it (normally we'd recall a render method, but we will have to call over and over again we change the code, so the function below is better)
function animate() {
  requestAnimationFrame(animate);
  //torus.rotation.x += 0.1;
  torus.rotation.y += 0.005;
  controls.update();
  renderer.render(scene, camera);
}

animate();

const cone = new THREE.ConeGeometry(5, 20, 32);
const materialCone = new THREE.MeshStandardMaterial({
  color: 'black',
});
const coneMesh = new THREE.Mesh(cone, materialCone);

//Without lighting this won't work;
// there many lightings in three js, but the one i am using points light in all different directions, as if you added a light bulb to the scene

//making it with the color of white, 0x is a hexidecimal literal which tells javascript you are working with a hexidecimal value, instead of any other number type

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(15, 15, 15);

//but to light up everything, we will need an ambient light
const ambientLight = new THREE.AmbientLight(0xffffff);
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(coneMesh, ambientLight, gridHelper);

/**
 * Now let's randomly add stars to our UI
 *
 */
function addStart() {
  const sphere = new THREE.SphereGeometry(0.25, 24, 24);
  const sphereMaterial = new THREE.MeshStandardMaterial({ color: 'yellow' });
  const star = new THREE.Mesh(sphere, sphereMaterial);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(100));
  star.position.set(x, y, z);
  scene.add(star);
}

Array(200).fill().forEach(addStart);

const spaceTexture = new THREE.TextureLoader().load('assets/images/space.jpg');
scene.background = spaceTexture;

//Texture mapping = taking 2 dimensional pixels and mapping them to 3 dimensional geometry;
const earthTexture = new THREE.TextureLoader().load('assets/images/eath.jpg');
const earthMesh = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshBasicMaterial({ map: earthTexture })
);
earthMesh.position.set(-10, 10, 10);
scene.add(earthMesh);

//moving camera every time a user scrolls
function moveCamera() {
  // calculate where the user is currently scrolled to
  const positionFromTop = document.body.getBoundingClientRect().top; // top property shows how far we are from the top page
  earthMesh.rotation.x += 0.05;
  earthMesh.rotation.y += 0.075;
  earthMesh.rotation.z += 0.05;

  camera.position.z = positionFromTop * -0.01;
  camera.position.x = positionFromTop * -0.0002;
  camera.position.y = positionFromTop * -0.0002;
}

document.body.onscroll = moveCamera;
