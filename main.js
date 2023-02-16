import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GUI } from 'dat.gui'
import gsap from 'gsap'

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(window.devicePixelRatio)
document.body.appendChild(renderer.domElement)

const gui = new GUI()
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
new OrbitControls(camera, renderer.domElement)
camera.position.z = 5

const light = new THREE.DirectionalLight(0xffffff, 1)
light.position.set(0, 0, 1)
scene.add(light)
const backLight = new THREE.DirectionalLight(0xffffff, 1)
backLight.position.set(0, 0, -1)
scene.add(backLight)
const raycaster = new THREE.Raycaster()

const planeGeometry = new THREE.PlaneGeometry(world.plane.width, world.plane.height, world.plane.widthSegments, world.plane.heightSegments)
const planeMaterial = new THREE.MeshPhongMaterial({ side: THREE.DoubleSide, flatShading: true, vertexColors: true })
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial)

function colorizePlane() {
  const colors = []
  for (let i = 1; i < planeMesh.geometry.attributes.position.count; i++) {
    colors.push(0, 0.19, 0.4)
  }
  planeMesh.geometry.setAttribute(
    'color',
    new THREE.BufferAttribute(new Float32Array(colors), 3)
  )
}
colorizePlane()

function distortPlane() {
  const { array } = planeMesh.geometry.attributes.position
  for (let i = 0; i < array.length; i += 3) {
    array[i + 2] += Math.random()
  }
}
distortPlane()
scene.add(planeMesh)

const mouse = {
  x: undefined,
  y: undefined,
}
function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
  raycaster.setFromCamera(mouse, camera)
  const intersects = raycaster.intersectObject(planeMesh)
  if (intersects.length > 0) {
    const { color } = intersects[0].object.geometry.attributes
    const { a, b, c } = intersects[0].face
    color
      .setX(a, .1)
      .setY(a, .5)
      .setZ(a, 1)
    color
      .setX(b, .1)
      .setY(b, .5)
      .setZ(b, 1)
    color
      .setX(c, .1)
      .setY(c, .5)
      .setZ(c, 1)
    color.needsUpdate = true

    const initialColor = {
      r: 0,
      g: .19,
      b: .4,
    }
    const hoverColor = {
      r: 0.1,
      g: .5,
      b: 1,
    }
    gsap.to(hoverColor, {
      r: initialColor.r,
      g: initialColor.g,
      b: initialColor.b,
      onUpdate: () => {
        color
          .setX(a, hoverColor.r)
          .setY(a, hoverColor.g)
          .setZ(a, hoverColor.b)
        color
          .setX(b, hoverColor.r)
          .setY(b, hoverColor.g)
          .setZ(b, hoverColor.b)
        color
          .setX(c, hoverColor.r)
          .setY(c, hoverColor.g)
          .setZ(c, hoverColor.b)
        color.needsUpdate = true

      }
    })
  }
}

animate()


function renderPlane() {
  planeMesh.geometry.dispose()
  planeMesh.geometry = new THREE.PlaneGeometry(world.plane.width, world.plane.height, world.plane.widthSegments, world.plane.heightSegments)
  colorizePlane()
  distortPlane()
}
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

addEventListener('mousemove', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
})