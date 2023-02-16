import './style.css'
import * as THREE from 'three'
import * as dat from 'dat.gui'

const gui = new dat.GUI()
const world = {
  plane: {
    width: 5,
    height: 5,
    widthSegments: 10,
    heightSegments: 10,
  }
}

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
const light = new THREE.DirectionalLight(0xffffff, 1)
const renderer = new THREE.WebGLRenderer()

const planeGeometry = new THREE.PlaneGeometry(world.plane.width, world.plane.height, world.plane.widthSegments, world.plane.heightSegments)
const planeMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000, side: THREE.DoubleSide, flatShading: true })
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial)
distortPlane()

function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}

renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(window.devicePixelRatio)
document.body.appendChild(renderer.domElement)
camera.position.z = 5
light.position.set(0, 0, 1)

scene.add(light)
scene.add(planeMesh)

animate()

gui
  .add(world.plane, 'width', 1, 20)
  .onChange(renderPlane)
gui
  .add(world.plane, 'height', 1, 20)
  .onChange(renderPlane)
gui
  .add(world.plane, 'widthSegments', 1, 20)
  .onChange(renderPlane)
gui
  .add(world.plane, 'heightSegments', 1, 20)
  .onChange(renderPlane)

function renderPlane() {
  planeMesh.geometry.dispose()
  planeMesh.geometry = new THREE.PlaneGeometry(world.plane.width, world.plane.height, world.plane.widthSegments, world.plane.heightSegments)
  distortPlane()
}

function distortPlane() {
  const { array } = planeMesh.geometry.attributes.position
  for (let i = 0; i < array.length; i += 3) {
    array[i + 2] += Math.random()
  }
}
