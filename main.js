import * as THREE from 'three';
import './style.css';
import { xor } from 'three/webgpu';

const canvas = document.getElementById('canvas');
// 创建场景
const scene = new THREE.Scene();

// 创建相机
const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 0, 6); // 设置相机位置
scene.add(camera); // 将相机添加到场景中

// 创建渲染器
const renderder = new THREE.WebGLRenderer({
  canvas
});
renderder.setClearAlpha(0); // 设置透明背景
renderder.setSize(window.innerWidth, window.innerHeight); // 设置渲染器的大小


// 增加灯光
const light = new THREE.DirectionalLight(0xffffff, 5); // 添加平行光
light.position.set(3, 3, 0);
scene.add(light);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // 添加环境光
scene.add(ambientLight);


const distance = 4;

const addStar = (texture, index) => {
  const textLoader = new THREE.TextureLoader();
  const star = new THREE.Mesh(
    new THREE.SphereGeometry(1.2),
    new THREE.MeshStandardMaterial({
      map: textLoader.load(texture)
    })
  );
  star.position.set(index % 2 ? -1.5 : 1.5, - distance * index, 0);
  scene.add(star);

  return star
}

// 太阳
const starImg = [
  'img/sun_bg.jpg', // 太阳
  'img/earth_bg.jpg', // 地球
  'img/moon_bg.jpg', // 月球
  'img/mars_bg.jpg', // 火星
  'img/mercury_bg.jpg', // 水星
  'img/venus_bg.jpg', // 金星
  'img/jupiter_bg.jpg', // 木星
  'img/saturn_bg.jpg', // 土星
  'img/uranus_bg.jpg', // 天王星
  'img/neptune_bg.jpg', // 海王星
  'img/pluto_bg.jpg', // 冥王星
]
const stars = []
for (let i = 0; i < starImg.length; i++) {
  stars.push(addStar(starImg[i], i));
}

// const sun = new THREE.Mesh(
//   new THREE.SphereGeometry(1.2),
//   new THREE.MeshStandardMaterial({
//     map: textLoader.load('img/sun_bg.jpg')
//   }));
// sun.position.set(1.5, distance * 0, 0); // 设置立方体位置
// scene.add(sun);

// 地球
// const earth = new THREE.Mesh(
//   new THREE.SphereGeometry(1.2),
//   new THREE.MeshStandardMaterial({
//     map: textLoader.load('img/earth_bg.jpg')
//   })
// );
// earth.position.set(-1.5, -distance * 1, 0); // 设置立方体位置
// scene.add(earth);

// 月球
// const moon = new THREE.Mesh(
//   new THREE.SphereGeometry(1.2),
//   new THREE.MeshStandardMaterial({
//     map: textLoader.load('img/moon_bg.jpg')
//   })
// );
// moon.position.set(1.5, -distance * 2, 0); // 设置立方体位置
// scene.add(moon);

let scrollY = 0;
window.addEventListener('scroll', () => {
  scrollY = window.scrollY;
  console.log(scrollY)
})

let mouse = {
  x: 0
}
window.addEventListener('mousemove', (event) => {
  mouse = {
    x: event.clientX,
  }
})

// 创建粒子
const particlesCount = 5000;
const posArray = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount; i++) {
  posArray[i * 3] = (Math.random() - 0.5) * 5;
  posArray[i * 3 + 1] = distance * 0.5 - Math.random() * distance * stars.length
  posArray[i * 3 + 2] = (Math.random() - 0.5) * 5;
}


const particlesGeometry = new THREE.BufferGeometry();

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const particlesMaterial = new THREE.PointsMaterial({
  size: 0.005,
  color: 0xffffff,
  setAttenuation: true // 设置衰减
});

const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);


// 渲染
renderder.render(scene, camera);

const clock = new THREE.Clock();
let oldElapsedTime = 0;
const animate = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - oldElapsedTime;
  oldElapsedTime = elapsedTime;
  renderder.render(scene, camera);

  camera.position.y = -scrollY / window.innerHeight * distance;

  const cursorX = mouse.x / window.innerWidth - 0.5

  const parallaxX = cursorX * 0.5;

  camera.position.x += (parallaxX - camera.position.x) * 4 * deltaTime;

  for (let i = 0; i < stars.length; i++) {
    stars[i].rotation.y += 0.01;
  }

  renderder.render(scene, camera);

  requestAnimationFrame(animate);

}
animate()