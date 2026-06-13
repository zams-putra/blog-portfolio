---
title: "Belajar ThreeJS"
date: "2026-05-09"
tags: ["develop"]
excerpt: "Buat boost my frontend, note buatku juga"
---

# Belajar ThreeJS

- buat ini biar ga lupa

## Main Key 
- scene: ini kek containernya, panggung lah, ibarat sesi foto brand dia ini backgroundnya
- camera: ini kameranya buat foto brand, bisa letak dimana aja
- renderer: kalau ini sutradara lah narator, pe render
- mesh: ini modelnya, objeknya, actornya
- light: ini setup pencahayaan di sesi foto nya, mau di taruh mana di set gimana

# 1 - First Step 

- buat aja file html
- nextnya nanti pakai react, awalan html dulu aja
```bash
touch index.html
```
- simple begini aja 

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ThreeJS kali 2 berapa</title>
</head>
<body>
</body>
</html>
```

## with NPM
- bisa lewat npm kalau mau pakai npm
- ini nanti kalau mau pakai react begini aja
```bash
npm i vite
npm i three 
```
- udah kalau gini nanti buildnya tinggal vite build aja
- kalau run nya tinggal run aja
```bash
npx vite
```
- dah buat index.html sendiri ama app.js sendiri

## with CDN
- kalau pakai CDN nanti tinggal copas aja linknya
```html
<script type="importmap">
{
  "imports": {
    "three": "https://cdn.jsdelivr.net/npm/three@<version>/build/three.module.js",
    "three/addons/": "https://cdn.jsdelivr.net/npm/three@<version>/examples/jsm/"
  }
}
</script>
```
- di file index.html nya tinggal tambahin itu aja
- nanti kita pakai ini dulu biar gampang
- versi sesuain btw <version>
- itu btw three/addons adalah addons2 lain
- misal OrbitControls buat biar bisa gerak2 in gitu
- GLTF loader, misal mau load design 3 orang


# 2 - Scene
- buat bikin scene, awal2 misal kita mau bikin bola muter dulu aja
- kita bikin main.js, buat nantinya
```ps1
Mode                 LastWriteTime         Length Name                                                                                                                            
----                 -------------         ------ ----                                                                                                                            
-a----          5/9/2026  12:13 PM            471 index.html                                                                                                                      
-a----          5/9/2026  12:13 PM              0 main.js    
```
- di html tinggal import aja begini 
```html
    <script src="main.js"></script>
```
- by default main.js nya begini 
```js
import * as THREE from 'three'

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
```
### Tips
- nah kalau bingung function2 nya, cari di docs
- https://threejs.org/manual
- kan di kiri atas ada manual ama docs yak
- pilih docs, terus disitu cari aja
- misal nih kita bingung ini apaan
```js
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
```
- di kiri atas, docs, cari aja PerspectiveCamera
- nanti tau tuh args2 nya itu valuenya apaan, buat apaan
- berlaku buat function2 lain btw
- jadi stepnya gini
```go
const gtw = new THREE.[ini_apaanyak] -> ke docs pencarian paste [ini_apaanyak] -> baca baca
```

## Create scene
- kita edit default value script tadi sama html nya 
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ThreeJS kali 2 berapa</title>
</head>
<body>
    <main style="display: flex; align-items: center; justify-content: center; height: 100vh; background-color: black;">
        <div class="bola"></div>
    </main>
    <script type="importmap">
    {
    "imports": {
        "three": "https://cdn.jsdelivr.net/npm/three@0.184.0/build/three.module.js",
        "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.184.0/examples/jsm/"
    }
    }
    </script>
    <script type="module" src="main.js"></script>
</body>
</html>>
```
- di html ku kasih main tag biar jadi container si bola
- dan buat div bola buat 3d nya nanti
```js
import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );

const bola = document.querySelector('.bola')
bola.appendChild( renderer.domElement );
```
- di file js nya ku appendchild nya dari si render ke kelas bola
- jadi engga ke body lagi biar bisa ku atur2 nantinya

### Geometry
- list yang mirip bola dan yang mendekati ini sih 
```bash
- DodecahedronGeometry
- IcosahedronGeometry
- SphereGeometry
- TorusGeometry # ini kek donat tapi gapapa lah xixixi bagus soalnya
- TorusKnotGeometry # mirip cacing jir
```

- and i add it to my js file with
```js 
const geometry = new THREE.SphereGeometry( 15, 32, 16 );
const material = new THREE.MeshStandardMaterial( { color: 0x4e9df2 } );
const bulet = new THREE.Mesh( geometry, material );
scene.add( bulet );

camera.position.z = 40;
```
- so disini aku pakai sphere for geometry
- dan aku pakai MeshStandardMaterial for Mesh
- and camera position nya ku perjauh

## Render the scene
- sebelum render ku tambahin light, dia kalau ga gitu gelap 
```js
const light = new THREE.PointLight(0xffffff, 500);
light.position.set(15, 2, 30);
scene.add(light);

// ini opsional
// const ambient = new THREE.AmbientLight(0xffffff, 0.5);
// ambient.position.set(18, 29, 2)
// scene.add(ambient);
```

- render with this tambahin aja di js
- sama kasih animasi biar muter
```js
function animate( time ) {
  renderer.render( scene, camera );
  bulet.rotation.y += 0.1
  
}
renderer.setAnimationLoop( animate );
```
- dan kalau bulet tuh ga terlalu keliatan buset
- jadi kasih wireframe aja biar ada kayak rangka2 gitu


# 3 - OrbitControls
- biar bisa di gerakin gitu bola nya
- kudu import dulu dari addons
```js
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
```
- lalu tinggal set aja begini animate nya
```js
const controls = new OrbitControls( camera, renderer.domElement );
camera.position.set( 0, 20, 100 );
controls.update();
function animate() {
	controls.update();
    bulet.rotation.y += 0.1
	renderer.render( scene, camera );
}
```

# 4. GLTFLoader
- buat free model 3d nya bisa cari di web ini
```bash
- https://sketchfab.com/features/free-3d-models
```
- kalau udah download aja versi .gltf
- download, ekstrak ke folder models
```ps1
│   index.html
│   main.js
│   
└───models
    │   license.txt
    │   scene.bin
    │   scene.gltf
    │   
    └───textures
            adadeh.jpeg
```
- lalu kudu tambahin ini dulu 
```js
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const loader = new GLTFLoader();
loader.load( 'path/to/model.glb', function ( gltf ) {
  scene.add( gltf.scene );
});
```
- nanti doi gapake shape buatan lagi
- kalau orang2 biasanya ubah jadi gini 
```js

const loader = new GLTFLoader();

let bumi

loader.load( 'models/scene.gltf', function ( gltf ) {
  bumi = gltf.scene  
  bumi.scale.set(80, 80, 80);
  scene.add( gltf.scene );
});
```
- nah ada case error, dia selalu begini 
```txt
error: KHR_materials_pbrSpecularGlossiness
- di console cek aja
```
- solusinya, tinggal buka aja file .gltf nya
- ctrl + f, cari KHR_materials_pbrSpecularGlossiness
- kalau ada gatau kenapa punyaku gabisa
- selain itu bisa sih
- well ini final result nya
- html 
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ThreeJS kali 2 berapa</title>
    <style>

        * {
            padding: 0;
            margin: 0;
            overflow: hidden;
        }
        
    </style>
</head>
<body>
    <main style="display: flex; align-items: center; justify-content: center; height: 100vh; background-color: black;">
        <div class="bola" style="width:700px;height:600px;"></div>
        <h1 style="color: white;">Ini adalah bumi kita</h1>
    </main>
    <script type="importmap">
    {
    "imports": {
        "three": "https://cdn.jsdelivr.net/npm/three@0.184.0/build/three.module.js",
        "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.184.0/examples/jsm/"
    }
    }
    </script>
    <script type="module" src="main.js"></script>
</body>
</html>>
```
- js
```js
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const bola = document.querySelector('.bola')
const sizes = {
  width: bola.clientWidth,
  height: bola.clientHeight
};


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  1000
);


const renderer = new THREE.WebGLRenderer({
  antialias: true
});


renderer.setSize(sizes.width, sizes.height);
bola.appendChild( renderer.domElement );


const loader = new GLTFLoader();

let bumi

loader.load( 'models/scene.gltf', function ( gltf ) {
  bumi = gltf.scene
  
  bumi.scale.set(80, 80, 80);
  scene.add( gltf.scene );
});

camera.position.z = 40;


const light = new THREE.PointLight(0xffffff, 500);
light.position.set(15, 2, 30);

scene.add(light);

const ambient = new THREE.AmbientLight(0xffffff, 0.5);
ambient.position.set(18, 29, 2)
scene.add(ambient);


const controls = new OrbitControls( camera, renderer.domElement );
controls.enableDamping = true;
camera.position.set( 0, 0, 60 );
controls.update();
function animate() {
	controls.update();
   
  if( bumi) {
     bumi.rotation.y += 0.01
  }
  
	renderer.render( scene, camera );
}

renderer.setAnimationLoop( animate );
```

# 5. Texture Loader
- sebenernya sama aja kek biasanya
- cuman kita eksekusinya di bagian setup material di Mesh nya sih
- misal setup biasanya kan gini ya sphere
```js
const geometry = new THREE.SphereGeometry( 15, 32, 16 );
const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
const sphere = new THREE.Mesh( geometry, material );
scene.add( sphere );
```
- nah bedanya kita set materialnya pakai texture loader dulu
```js
const geometry = new THREE.SphereGeometry( 15, 32, 16 );

const loader = new THREE.TextureLoader()
const texture = await loader.loadAsync('img/nasgor.jpeg')
const material = new THREE.MeshStandardMaterial({map: texture})

const sphere = new THREE.Mesh( geometry, material );
scene.add( sphere );
```
- udah sih tinggal kasih light gitu 
```js
const light = new THREE.PointLight(0xffffff, 500);
light.position.set(15, 2, 30);
scene.add(light);

const ambient = new THREE.AmbientLight(0xffffff, 0.5);
ambient.position.set(18, 29, 2)
scene.add(ambient);
```


# Error: too many active webgl contexts
- too many active webgl contexts. oldest context will be lost
- katanya sih karna limit webgl contexts, di laptop jujur aman tapi di mobile error
- errornya tuh langsung blank putih semua webnya
- apalagi di react yang mainin komponen jadi render2 terus
- so my code begini awalnya
```jsx
/* eslint-disable react/prop-types */
import { useEffect, useRef } from 'react';
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { motion } from "motion/react";

export default function GlobeTemplate({classname = "", textureURL = null}){
    const containerdRef = useRef(null);
    useEffect(() => {
        const container = containerdRef.current;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        
        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            powerPreference: "low-power"
        });

        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(renderer.domElement);

        const geometry = new THREE.SphereGeometry(30, 32, 32); 
        const material = new THREE.MeshStandardMaterial({
            roughness: 0.6,
            metalness: 0.0
        });


        let texture = null;
        if (textureURL) {
            new THREE.TextureLoader().load(textureURL, (t) => {
                texture = t
                material.map = t;
                material.needsUpdate = true;
            });
        }

        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);


        const light = new THREE.DirectionalLight(0xffffff, 1.5);
        light.position.set(5, 3, 5);
        scene.add(light);
        scene.add(new THREE.AmbientLight(0xffffff, 0.3));
        scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 0.4));

        camera.position.z = 60;
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.enableZoom = false;
        controls.enablePan = false;

    
        let animationId;
        const animate = () => {
            animationId = requestAnimationFrame(animate)
            controls.update();
            mesh.rotation.y += 0.01; 
            renderer.render(scene, camera);
        };
        animate();

        const observer = new ResizeObserver((entries) => {
            const { contentRect } = entries[0]
            const { width, height } = contentRect
            renderer.setSize(width, height)
            camera.aspect = width / height
            camera.updateProjectionMatrix()   
        })
        observer.observe(container)

    
        return () => {
            // dispose semua lah cape gw webgl error mulu
            texture?.dispose();
            material.dispose();
            geometry.dispose();
            controls.dispose();
            renderer.forceContextLoss();
            renderer.dispose()
            cancelAnimationFrame(animationId) 
            observer.disconnect()           
            if (container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement);
            }
        };
    }, [textureURL]);
    
    return <motion.div 
    initial={{scale: 0}} 
    animate={{scale: 1}} 
    transition={{ duration: 1, delay: 0.7, ease: "easeIn" }} 
    ref={containerdRef} 
    className={`rounded-full z-0 ${classname}`} >

    </motion.div>
}
```
- nah udah implement dispose juga, biar kalau ga kepake dia ilang gitu loh pas unmount
```jsx
        return () => {
            // dispose semua lah cape gw webgl error mulu
            texture?.dispose();
            material.dispose();
            geometry.dispose();
            controls.dispose();
            renderer.forceContextLoss();
            renderer.dispose()
            cancelAnimationFrame(animationId) 
            observer.disconnect()           
            if (container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement);
            }
        };
```
- tapi masih error disini, jadi ya mau ga mau globe 3D nya ku pake 3 doang
## Fix 1: React Three
- nyoba pakai react-three
```bash
npm install @react-three/fiber @react-three/drei
```
- lalu GlobeTemplate.jsx ku jadi gini :
```jsx
export default function GlobeTemplate({ classname = "", textureURL = null }) {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 1, delay: 0.7, ease: "easeIn" }}
      className={`rounded-full z-0 ${classname}`}
    >
      <Canvas
        camera={{ position: [0, 0, 60], fov: 75 }}
        gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
        dpr={Math.min(window.devicePixelRatio, 1.5)}
      >
        <directionalLight intensity={1.5} position={[5, 3, 5]} />
        <ambientLight intensity={0.3} />
        <hemisphereLight args={[0xffffff, 0x444444, 0.4]} />
        <Suspense fallback={null}>
          <GlobeMesh textureURL={textureURL} />
        </Suspense>
        <OrbitControls enableZoom={false} enablePan={false} enableDamping />
      </Canvas>
    </motion.div>
  );
}

function GlobeMesh({ textureURL }) {
  return textureURL
    ? <GlobeMeshWithTexture textureURL={textureURL} />
    : <GlobeMeshPlain />;
}
```
- dia ada import dari GlobeHelper.jsx ku juga disini 
```jsx
export function GlobeMeshPlain() {
  const meshRef = useRef();
    const { scale } = useSpring({
      from: { scale: 0 },
      to: { scale: 1 },
      delay: 700,
      config: { duration: 1000 }
    });

  useFrame(() => {
    if (meshRef.current) meshRef.current.rotation.y += 0.01;
  });
  return (
    <animated.mesh scale={scale} ref={meshRef}>
       <mesh ref={meshRef}>
        <sphereGeometry args={[30, 32, 32]} />
        <meshStandardMaterial roughness={0.6} metalness={0.0} />
      </mesh>
    </animated.mesh>
  );
}

export function GlobeMeshWithTexture({ textureURL }) {
  const meshRef = useRef();
  const texture = useLoader(TextureLoader, textureURL);
    const { scale } = useSpring({
      from: { scale: 0 },
      to: { scale: 1 },
      delay: 700,
      config: { duration: 1000 }
    });
  useFrame(() => {
    if (meshRef.current) meshRef.current.rotation.y += 0.01;
  });

  return (
    <animated.mesh ref={meshRef} scale={scale}>
       <mesh ref={meshRef}>
        <sphereGeometry args={[30, 32, 32]} />
        <meshStandardMaterial map={texture} roughness={0.6} metalness={0.0} />
      </mesh>
    </animated.mesh>
  );
}
```
- implement lazy mount juga disini 
```jsx
export function UseLazyMount(threshold = 0.1) {
  const ref = useRef(null);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldRender(true);
          observer.disconnect(); 
        }
      },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, shouldRender];
}
```
- tinggal dipake aja di page masing masing, misal di about page nih
```jsx

import planetGambar from '/img/me.jpg'
const GlobeTemplate = lazy(() => import('../components/design/GlobeTemplate')) // lazy, Suspense import dari react btw

export default function AboutMe() {
const [ref, shouldRender] = UseLazyMount();

// return nya 
{shouldRender && (
    <Suspense fallback={<div className="w-32 h-32 rounded-full bg-slate-800 animate-pulse"/>}>
    <GlobeTemplate textureURL={planetGambar} classname="w-32 h-32 md:w-[420px] md:h-[420px]"/>
    </Suspense>
)}
}
```
- buat munculin designnya nanti kudu di scroll beberapa gitu



# Result 1 - Bola Muter
- html
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ThreeJS kali 2 berapa</title>
    <style>

        * {
            padding: 0;
            margin: 0;
            overflow: hidden;
        }
        
    </style>
</head>
<body>
    <main style="display: flex; align-items: center; justify-content: center; height: 100vh; background-color: black;">
        <div class="bola" style="width:700px;height:600px;"></div>
        <h1 style="color: white;">Ini adalah bumi kita</h1>
    </main>
    <script type="importmap">
    {
    "imports": {
        "three": "https://cdn.jsdelivr.net/npm/three@0.184.0/build/three.module.js",
        "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.184.0/examples/jsm/"
    }
    }
    </script>
    <script type="module" src="main.js"></script>
</body>
</html>>
```
- main.js
```js 
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const bola = document.querySelector('.bola')


const sizes = {
  width: bola.clientWidth,
  height: bola.clientHeight
};


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  1000
);


const renderer = new THREE.WebGLRenderer({
  antialias: true
});


renderer.setSize(sizes.width, sizes.height);


bola.appendChild( renderer.domElement );


const geometry = new THREE.SphereGeometry( 25, 64, 64 );
const material = new THREE.MeshStandardMaterial( { color: 0x4e9df2 ,   wireframe: true} );
const bulet = new THREE.Mesh( geometry, material );
scene.add( bulet );

camera.position.z = 40;


const light = new THREE.PointLight(0xffffff, 500);
light.position.set(15, 2, 30);

scene.add(light);

const ambient = new THREE.AmbientLight(0xffffff, 0.5);
ambient.position.set(18, 29, 2)
scene.add(ambient);


const controls = new OrbitControls( camera, renderer.domElement );
controls.enableDamping = true;
camera.position.set( 0, 0, 60 );
controls.update();
function animate() {
	controls.update();
    bulet.rotation.y += 0.1
	renderer.render( scene, camera );
}

renderer.setAnimationLoop( animate );
```


# Result 2 - Lampu Lampuan
- html
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Star Lamp</title>
    <style>
        body {
            margin: 0;
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: rgb(26, 26, 26);
        }
        .container {
            width: 25rem;
            height: 25rem;
        }
    </style>
</head>
<body>
    <div class="container"></div>
    <script type="module" src="app.js"></script>
</body>
</html>
```
- js
```js
import * as THREE from 'three'

const container = document.querySelector('.container')
const rect = container.getBoundingClientRect()

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, rect.width / rect.height, 0.1, 1000)
const renderer  = new THREE.WebGLRenderer()

renderer.setSize(container.clientWidth, container.clientHeight)
container.appendChild(renderer.domElement)


// design geo 1
const geometry = new THREE.TorusKnotGeometry(10, 3, 100, 16)
const material = new THREE.MeshStandardMaterial({
    color: 0xf0fc65,
    emissive: 0xf0fc65, 
    emissiveIntensity: 0.1,
    wireframe: true
})
const torusKnotGeometry = new THREE.Mesh(geometry, material)
scene.add(torusKnotGeometry)


// design geo 2
const geometry2 = new THREE.SphereGeometry(8, 10, 10)
const material2 = new THREE.MeshStandardMaterial({
    color: 0xfffc65,
    emissive: 0xfffc65,
    emissiveIntensity: 0.1,
    wireframe: true
})
const bola = new THREE.Mesh(geometry2, material2)
scene.add(bola)


// jarak horizon kiri kanan
torusKnotGeometry.position.set(-10, 0, -20)
bola.position.x = 10 


// light 1
const light = new THREE.PointLight(0xf0fc65, 50)
light.position.copy(torusKnotGeometry.position)
scene.add(light)

// light 2
const light2 = new THREE.PointLight(0xfffc65, 50)
light2.position.copy(bola.position)
scene.add(light2)


// object keliatan pas lampu mati 
scene.add(new THREE.AmbientLight(0xffffff, 0.2))


// kondisi -> key nya mesh masing2, value nya ya object
const lampMap = new Map([
    [
        torusKnotGeometry, 
    {
        light: light,
        isOn: false,
    }],
    [
        bola, 
    {
        light: light,
        isOn: false,
    }],
])

// raycaster
const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()

container.addEventListener('click', (e) => {
    const rect = container.getBoundingClientRect()

    // itung2 an mouse gini gapaham gw, masih pakai AI kalau ginian
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1

    raycaster.setFromCamera(mouse, camera)
    const intersects = raycaster.intersectObjects([torusKnotGeometry, bola])
    if(intersects.length > 0) {
        const clickedMesh = intersects[0].object
        const lamp = lampMap.get(clickedMesh)
        lamp.isOn = !lamp.isOn
        if(lamp.isOn) {
            lamp.light.intensity = 100
            clickedMesh.material.emissiveIntensity = 1
        } else {
            lamp.light.intensity = 0
            clickedMesh.material.emissiveIntensity = 0.1
        }
    }    
})

camera.position.set(0, 0, 30)
function animate(){
    torusKnotGeometry.rotation.x += 0.01
    torusKnotGeometry.rotation.y += 0.01
    bola.rotation.x += 0.01
    bola.rotation.y += 0.01
    renderer.render(scene, camera)
}
renderer.setAnimationLoop(animate)
```