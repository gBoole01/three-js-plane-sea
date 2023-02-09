import './style.css'
import * as THREE from 'three';

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
const renderer = new THREE.WebGLRenderer()
const boxGeometry = new THREE.BoxGeometry(1, 1, 1)
const mesh = new THREE.Mesh(boxGeometry, new THREE.MeshBasicMaterial({ color: 0xffffff }))
const planeGeometry = new THREE.PlaneGeometry(5, 5, 10, 10)
const planeMesh = new THREE.Mesh(planeGeometry, new THREE.MeshBasicMaterial({ color: 0xff0000 }))

function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
  mesh.rotation.x += .01
  mesh.rotation.y -= .005
}

renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(window.devicePixelRatio)
document.body.appendChild(renderer.domElement)
scene.add(mesh)
scene.add(planeMesh)
camera.position.z = 5

animate()