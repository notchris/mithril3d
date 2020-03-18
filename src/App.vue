<template>
  <div id="app">
    <Menu @createObject="createObject($event)"/>
    <hsc-window-style-white class="windows">
      <Tools/>
    </hsc-window-style-white>
    <div class="container">
      <split-pane @resize="resize" :min-percent='20' :default-percent='80' split="vertical">
          <!-- Start: Renderers -->
          <template slot="paneL">

            <split-pane @resize="resize" :min-percent='20' :default-percent='50' split="vertical">
                <template slot="paneL">
                  <split-pane ref="panesLeft" @resize="resizeLeft($event)" :min-percent='20' :default-percent='50' split="horizontal">
                      <template slot="paneL">
                        <div class="render" id="renderA"></div>
                      </template>
                      <template slot="paneR">
                        <div class="render" id="renderC"></div>
                      </template>
                  </split-pane>
                </template>
                <template slot="paneR">
                  <split-pane ref="panesRight" @resize="resizeRight($event)" :min-percent='20' :default-percent='50' split="horizontal">
                      <template slot="paneL">
                        <div class="render" id="renderB"></div>
                      </template>
                      <template slot="paneR">
                        <div class="render" id="renderD"></div>
                      </template>
                  </split-pane>
                </template>
              </split-pane>

          </template>
          <!-- End: Renderers -->
          <!-- Start: Sidebar -->
          <template slot="paneR">
            <Sidebar/>
          </template>
          <!-- End: Sidebar -->
        </split-pane>
    </div>
    <Footer/>
  </div>
</template>

<script>
import Menu from './components/Menu.vue';
import Footer from './components/Footer.vue';
import Sidebar from './components/Sidebar.vue';
import Tools from './components/Tools.vue';

import * as THREE from 'three';
import OrbitControls from 'orbit-controls-es6';
import { TransformControls } from './assets/js/TransformControls';

let resize;
let tcontrols;
let transformMode = 'translate';
let createObject;

export default {
  name: 'App',
  components: {
    Menu,
    Footer,
    Sidebar,
    Tools
  },
  watch: {
    tool (v) {
      if (v === 'translate' || v === 'scale' || v === 'rotate') {
        if (tcontrols) {
          tcontrols.setMode(v);
        }
        transformMode = v;
      }
    }
  },
  mounted () {
    const raycasterA = new THREE.Raycaster();
    raycasterA.layers.set(1);
    const raycasterB = new THREE.Raycaster();
    raycasterB.layers.set(9);
    const raycasterC = new THREE.Raycaster();
    raycasterC.layers.set(9);
    const raycasterD = new THREE.Raycaster();
    raycasterD.layers.set(9);

    const mouseA = new THREE.Vector2(-10000, -10000);
    const mouseB = new THREE.Vector2(-10000, -10000);
    const mouseC = new THREE.Vector2(-10000, -10000);
    const mouseD = new THREE.Vector2(-10000, -10000);

    let onTransformer = false;

    let meshActive = null;
    let meshSelected = null;
    let activeRenderer = null;

    const renderers = [];
    let rA = document.querySelector('#renderA').getBoundingClientRect();
    let rB = document.querySelector('#renderB').getBoundingClientRect();
    let rC = document.querySelector('#renderC').getBoundingClientRect();
    let rD = document.querySelector('#renderD').getBoundingClientRect();

    // A
    const rendererA = new THREE.WebGLRenderer({ antialias: true });
    rendererA.setPixelRatio(window.devicePixelRatio);
    rendererA.setSize(rA.width, rA.height);
    document.querySelector('#renderA').appendChild(rendererA.domElement);
    renderers.push(rendererA);

    // B
    const rendererB = new THREE.WebGLRenderer({ antialias: true });
    rendererB.setPixelRatio(window.devicePixelRatio);
    rendererB.setSize(rB.width, rB.height);
    document.querySelector('#renderB').appendChild(rendererB.domElement);
    renderers.push(rendererB);

    // C
    const rendererC = new THREE.WebGLRenderer({ antialias: true });
    rendererC.setPixelRatio(window.devicePixelRatio);
    rendererC.setSize(rC.width, rC.height);
    document.querySelector('#renderC').appendChild(rendererC.domElement);
    renderers.push(rendererC);

    // D
    const rendererD = new THREE.WebGLRenderer({ antialias: true });
    rendererD.setPixelRatio(window.devicePixelRatio);
    rendererD.setSize(rD.width, rD.height);
    document.querySelector('#renderD').appendChild(rendererD.domElement);
    renderers.push(rendererD);

    // Scene
    //const scene = new THREE.Scene();

    const ambientLight = new THREE.AmbientLight(0x404040);
    this.scene.add(ambientLight);
    ambientLight.layers.set(1);

    const directionalLight = new THREE.DirectionalLight(0xEEEEEE, 0.8);
    directionalLight.position.y = 1000;
    this.scene.add(directionalLight);
    directionalLight.layers.set(1);

    const cameras = [];

    // Cameras
    const fov = 180 * (2 * Math.atan(rA.height / 2 / rA.width)) / Math.PI;
    const cameraA = new THREE.PerspectiveCamera(fov, rA.width / rA.height, 1, 10000);
    const cameraB = new THREE.OrthographicCamera(
      rB.width / -2,
      rB.width / 2,
      rB.height / 2,
      rB.height / -2,
      -1000,
      10000,
    );
    const cameraC = new THREE.OrthographicCamera(
      rC.width / -2,
      rC.width / 2,
      rC.height / 2,
      rC.height / -2,
      -1000,
      10000,
    );
    const cameraD = new THREE.OrthographicCamera(
      rD.width / -2,
      rD.width / 2,
      rD.height / 2,
      rD.height / -2,
      -1000,
      10000,
    );

    cameraA.layers.enable(1);
    cameraB.layers.enable(2);
    cameraC.layers.enable(3);
    cameraD.layers.enable(4);

    cameraA.layers.enable(5);
    cameraB.layers.enable(6);
    cameraC.layers.enable(7);
    cameraD.layers.enable(8);

    cameraB.layers.enable(9);
    cameraC.layers.enable(9);
    cameraD.layers.enable(9);

    cameraA.enabledRay = 5;
    cameraB.enabledRay = 6;
    cameraC.enabledRay = 7;
    cameraD.enabledRay = 8;

    cameraA.name = 'a';
    cameraB.name = 'b';
    cameraC.name = 'c';
    cameraD.name = 'd';


    // Camera A Orbit Controls

    cameraA.position.set(0, 0, rA.width);
    const controls = new OrbitControls(cameraA, rendererA.domElement);

    // Camera B - D Orientation
    cameraB.position.y = -100;
    cameraB.up = new THREE.Vector3(0, 0, 1);
    cameraB.lookAt(new THREE.Vector3(0, -1, 0));

    cameraC.position.x = -100;
    cameraC.lookAt(new THREE.Vector3(1, 0, 0));

    cameraD.position.z = 100;
    cameraD.lookAt(new THREE.Vector3(0, 0, -1));

    cameras.push(cameraA, cameraB, cameraC, cameraD);

    const gridA = new THREE.GridHelper(1000, 100);
    gridA.layers.set(1);
    this.scene.add(gridA);

    const gridB = new THREE.GridHelper(1000, 100);
    gridB.layers.set(2);
    this.scene.add(gridB);
    gridB.position.y = 1000;

    const gridC = new THREE.GridHelper(1000, 100);
    gridC.layers.set(3);
    this.scene.add(gridC);
    gridC.rotation.set(Math.PI, Math.PI, Math.PI / 2);
    gridC.position.x = 1000;

    const gridD = new THREE.GridHelper(1000, 100);
    gridD.layers.set(4);
    this.scene.add(gridD);
    gridD.rotation.set(Math.PI, Math.PI / 2, Math.PI / 2);
    gridD.position.z = -1000;

    const axes = new THREE.AxesHelper(1000);
    this.scene.add(axes);

    const meshlist = [];
    const boxlist = [];
    const wireframelist = [];

    /** Objects */

    createObject = (id, type, pos) => {
      if (!type) return;
      let mesh;
      const p = pos || [0, 0, 0];
      switch (type) {
        case 'box':
          mesh = new THREE.Mesh(new THREE.BoxGeometry(100, 100, 100), new THREE.MeshLambertMaterial());
          mesh.position.set(p[0], p[1], p[2]);
          break;
        case 'circle': 
          mesh = new THREE.Mesh(new THREE.CircleGeometry(50, 32), new THREE.MeshLambertMaterial({
            side: THREE.DoubleSide
          }));
          mesh.position.set(p[0], p[1], p[2]);
          break;
        case 'cone':
          mesh = new THREE.Mesh(new THREE.ConeGeometry(50, 200, 32), new THREE.MeshLambertMaterial());
          mesh.position.set(p[0], p[1], p[2]);
          break;
        case 'cylinder':
          mesh = new THREE.Mesh(new THREE.CylinderGeometry(50, 50, 100, 32), new THREE.MeshLambertMaterial());
          mesh.position.set(p[0], p[1], p[2]);
          break;
        case 'dodecahedron':
          mesh = new THREE.Mesh(new THREE.DodecahedronGeometry(50, 0), new THREE.MeshLambertMaterial());
          mesh.position.set(p[0], p[1], p[2]);
          break;
        case 'icosahedron':
          mesh = new THREE.Mesh(new THREE.IcosahedronGeometry(50, 0), new THREE.MeshLambertMaterial());
          mesh.position.set(p[0], p[1], p[2]);
          break;
        case 'octahedron':
          mesh = new THREE.Mesh(new THREE.OctahedronGeometry(50, 0), new THREE.MeshLambertMaterial());
          mesh.position.set(p[0], p[1], p[2]);
          break;
        case 'plane':
          mesh = new THREE.Mesh(new THREE.PlaneGeometry(100, 100, 20, 32), new THREE.MeshLambertMaterial({
            side: THREE.DoubleSide
          }));
          mesh.position.set(p[0], p[1], p[2]);
          break;
        case 'sphere':
          mesh = new THREE.Mesh(new THREE.SphereGeometry(50, 32, 32), new THREE.MeshLambertMaterial());
          mesh.position.set(p[0], p[1], p[2]);
          break;
        default:
          break;
      }
      mesh.name = id;


      const helper = new THREE.BoxHelper(mesh);
      helper.name = `helper_${id}`;

      const wireframe = new THREE.Mesh(
        mesh.geometry.clone(),
        new THREE.MeshBasicMaterial({ wireframe: true, color: 0xffffff }),
      );
      wireframe.position.copy(mesh.position);
      wireframe.scale.copy(mesh.scale);
      wireframe.rotation.copy(mesh.rotation);
      this.scene.add(helper);
      this.scene.add(mesh);
      this.scene.add(wireframe);
      meshlist.push(mesh);
      boxlist.push(helper);
      wireframelist.push(wireframe);

      mesh.layers.set(1);
      wireframe.layers.set(9);
    };

    const setTransform = (r, camera) => {
      if (!meshSelected) return;
      if (
        tcontrols
          && tcontrols.domElement === r.domElement
          && tcontrols.camera === camera
          && tcontrols.object === meshSelected
      ) {
        return;
      }
      if (tcontrols) {
        tcontrols.detach();
        this.scene.remove(tcontrols);
        tcontrols.dispose();
        tcontrols = undefined;
      }
      if (camera === cameraA) {
        tcontrols = new TransformControls(camera, r.domElement, camera.enabledRay);
        tcontrols.addEventListener('mouseDown', () => {
          controls.enabled = false;
        });
        tcontrols.addEventListener('mouseUp', () => {
          controls.enabled = true;
        });
        tcontrols.traverse((o) => {
          o.layers.set(5);
        });
      } else if (camera === cameraB) {
        tcontrols = new TransformControls(camera, r.domElement, camera.enabledRay);
        tcontrols.setSize(2);
        tcontrols.traverse((o) => {
          o.layers.set(6);
        });
      } else if (camera === cameraC) {
        tcontrols = new TransformControls(camera, r.domElement, camera.enabledRay);
        tcontrols.setSize(2);
        tcontrols.traverse((o) => {
          o.layers.set(7);
        });
      } else if (camera === cameraD) {
        tcontrols = new TransformControls(camera, r.domElement, camera.enabledRay, true);
        tcontrols.setSize(2);
        tcontrols.traverse((o) => {
          o.layers.set(8);
        });
      }
      tcontrols.domElement = r.domElement;
      tcontrols.attach(meshSelected);
      tcontrols.setMode(transformMode);
      tcontrols.addEventListener('change', () => {
        meshlist.forEach((m, i) => {
          boxlist[i].setFromObject(m);
          wireframelist[i].position.copy(m.position);
          wireframelist[i].scale.copy(m.scale);
          wireframelist[i].rotation.copy(m.rotation);
        });
      });
      this.scene.add(tcontrols);
    };

    const setSelected = (mesh, renderer, camera) => {
      meshSelected = mesh;
      setTransform(renderer, camera);
    };

    renderers.forEach((r, i) => {
      const ren = r;
      r.domElement.addEventListener('mousedown', () => {
        if (onTransformer) return;
        if (meshActive) {
          setSelected(meshActive, r, cameras[i]);
        } else {
          ren.dragging = true;
        }
      });
      r.domElement.addEventListener('mousemove', (e) => {
        if (onTransformer) return;
        if (r === rendererA) {
          activeRenderer = rendererA;
          const b = r.domElement.getBoundingClientRect();
          mouseA.x = ((e.clientX - b.left) / b.width) * 2 - 1;
          mouseA.y = -((e.clientY - b.top) / b.height) * 2 + 1;
          setTransform(r, cameraA);
        } else if (r === rendererB) {
          activeRenderer = rendererB;
          const b = r.domElement.getBoundingClientRect();
          mouseB.x = ((e.clientX - b.left) / b.width) * 2 - 1;
          mouseB.y = -((e.clientY - b.top) / b.height) * 2 + 1;
          setTransform(r, cameraB);

          if (r.dragging) {
            cameraB.position.x -= e.movementX;
            cameraB.position.z += e.movementY;
          }
        } else if (r === rendererC) {
          activeRenderer = rendererC;
          const b = r.domElement.getBoundingClientRect();
          mouseC.x = ((e.clientX - b.left) / b.width) * 2 - 1;
          mouseC.y = -((e.clientY - b.top) / b.height) * 2 + 1;
          setTransform(r, cameraC);

          if (r.dragging) {
            cameraC.position.z -= e.movementX;
            cameraC.position.y += e.movementY;
          }
        } else if (r === rendererD) {
          activeRenderer = rendererD;
          const b = r.domElement.getBoundingClientRect();
          mouseD.x = ((e.clientX - b.left) / b.width) * 2 - 1;
          mouseD.y = -((e.clientY - b.top) / b.height) * 2 + 1;
          setTransform(r, cameraD);

          if (r.dragging) {
            cameraD.position.x -= e.movementX;
            cameraD.position.y += e.movementY;
          }
        }
      });
      r.domElement.addEventListener('mouseleave', () => {
        meshActive = null;
        activeRenderer = null;
        ren.dragging = false;
      });
      r.domElement.addEventListener('mouseup', () => {
        ren.dragging = false;
      });
    });

    // Tools
    /*document.querySelectorAll('.tool').forEach((el) => {
      el.addEventListener('click', () => {
        const t = el.dataset.tool;
        document.querySelectorAll('.tool').forEach((elem) => {
          elem.classList.remove('active');
        });
        el.classList.add('active');
        activeTool = t;
        if (t === 'translate' || t === 'scale' || t === 'rotate') {
          if (tcontrols) {
            tcontrols.setMode(t);
          }
          transformMode = t;
        }
      });
    });*/

    resize = () => {
      rA = document.querySelector('#renderA').getBoundingClientRect();
      rB = document.querySelector('#renderB').getBoundingClientRect();
      rC = document.querySelector('#renderC').getBoundingClientRect();
      rD = document.querySelector('#renderD').getBoundingClientRect();

      cameraA.aspect = rA.width / rA.height;
      cameraA.updateProjectionMatrix();
      rendererA.setSize(rA.width, rA.height);

      cameraB.left = (rB.width / -2);
      cameraB.right = (rB.width / 2);
      cameraB.top = (rB.height / 2);
      cameraB.bottom = (rB.height / -2);
      cameraB.updateProjectionMatrix();
      rendererB.setSize(rB.width, rB.height);

      cameraC.left = (rC.width / -2);
      cameraC.right = (rC.width / 2);
      cameraC.top = (rC.height / 2);
      cameraC.bottom = (rC.height / -2);
      cameraC.updateProjectionMatrix();
      rendererC.setSize(rC.width, rC.height);

      cameraD.left = (rD.width / -2);
      cameraD.right = (rD.width / 2);
      cameraD.top = (rD.height / 2);
      cameraD.bottom = (rD.height / -2);
      cameraD.updateProjectionMatrix();
      rendererD.setSize(rD.width, rD.height);
    };

    window.addEventListener('resize', () => {
      resize();
    });
    resize();

    const animate = () => {
      requestAnimationFrame(animate);
      
      if (activeRenderer && this.tool === 'select') {
        if (activeRenderer === rendererA) {
          raycasterA.setFromCamera(mouseA, cameraA);
          const intersects = raycasterA.intersectObjects(meshlist);
          if (intersects.length) {
            meshActive = intersects[0].object;
          } else {
            meshActive = null;
          }
        } else if (activeRenderer === rendererB) {
          raycasterB.setFromCamera(mouseB, cameraB);
          const intersectsB = raycasterB.intersectObjects(wireframelist);
          if (intersectsB.length) {
            meshActive = meshlist[wireframelist.indexOf(intersectsB[0].object)];
          } else {
            meshActive = null;
          }
        } else if (activeRenderer === rendererC) {
          raycasterC.setFromCamera(mouseC, cameraC);
          const intersectsC = raycasterC.intersectObjects(wireframelist);
          if (intersectsC.length) {
            meshActive = meshlist[wireframelist.indexOf(intersectsC[0].object)];
          } else {
            meshActive = null;
          }
        } else if (activeRenderer === rendererD) {
          raycasterD.ray.origin.set(0, 0, 0);
          cameraD.localToWorld(raycasterD.ray.origin);
          raycasterD.setFromCamera(mouseD, cameraD);
          raycasterD.ray.origin.z = cameraD.far;
          const intersectsD = raycasterD.intersectObjects(wireframelist);
          if (intersectsD.length) {
            meshActive = meshlist[wireframelist.indexOf(intersectsD[0].object)];
          } else {
            meshActive = null;
          }
        }
      }

      meshlist.forEach((object, i) => {
        if (object === meshSelected) {
          boxlist[i].visible = true;
          boxlist[i].material.color.set(0xffff00);
        } else if (object === meshActive) {
          boxlist[i].visible = true;
          boxlist[i].material.color.set(0x00ff00);
        } else {
          boxlist[i].visible = false;
        }
      });

      if (tcontrols && tcontrols.axis) {
        onTransformer = true;
      } else {
        onTransformer = false;
      }

      if (tcontrols) {
        if (this.tool === 'translate' || this.tool === 'scale' || this.tool === 'rotate') {
          tcontrols.enabled = true;
          tcontrols.visible = true;
        } else {
          tcontrols.enabled = false;
          tcontrols.visible = false;
        }
      }

      rendererA.render(this.scene, cameraA);
      rendererB.render(this.scene, cameraB);
      rendererC.render(this.scene, cameraC);
      rendererD.render(this.scene, cameraD);
    };

    animate();
  },
  methods: {
    resize () {
      if (resize) {
        resize();
      }
    },
    resizeLeft (p) {
      this.$refs.panesRight.percent = p;
      this.resize();
    },
    resizeRight (p) {
      this.$refs.panesLeft.percent = p;
      this.resize();
    },
    createObject (type) {
      createObject('test1', type);
    }
  },
  computed: {
    tool () {
      return this.$store.state.tool;
    },
    scene () {
      return this.$store.state.scene
    }
  }
}
</script>