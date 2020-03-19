/* eslint-disable */ 
import * as THREE from 'three';

export default class SkewControls {
    constructor (scene, renderer, camera, events) {
        this.scene = scene;
        this.renderer = renderer;
        this.camera = camera;
        this.events = events;
        this.enabled = true;

        this.activeHelper = null;
        this.selectedHelper = null;
        this.ray = new THREE.Raycaster();
        this.box = new THREE.Box3();
        this.helpers = [
            new THREE.Mesh(new THREE.BoxGeometry(10, 10, 10), new THREE.MeshBasicMaterial({color: 0x0000ff})),
            new THREE.Mesh(new THREE.BoxGeometry(10, 10, 10), new THREE.MeshBasicMaterial({color: 0x0000ff})),
            new THREE.Mesh(new THREE.BoxGeometry(10, 10, 10), new THREE.MeshBasicMaterial({color: 0x0000ff})),
            new THREE.Mesh(new THREE.BoxGeometry(10, 10, 10), new THREE.MeshBasicMaterial({color: 0x0000ff}))
        ]

        this.helpers[0].name = 'helperA';
        this.helpers[1].name = 'helperB';
        this.helpers[2].name = 'helperC';
        this.helpers[3].name = 'helperD';

        renderer.domElement.addEventListener( "mousemove", (e) => {
            this.onPointerHover(e)
            if (!this.selectedHelper) return;
            switch (this.selectedHelper) {
                case 'helperA':
                    this.object.geometry.applyMatrix4( new THREE.Matrix4().makeTranslation((this.box.min.x - this.box.max.x) / 2, 0, 0 ) );
                    if (e.movementX < 0) {
                    
                        this.object.scale.x += Math.abs(e.movementX / 100);
                    } else {
                        this.object.scale.x -= Math.abs(e.movementX / 100);
                    }
                    this.object.geometry.applyMatrix4( new THREE.Matrix4().makeTranslation(-(this.box.min.x - this.box.max.x) / 2, 0, 0 ) );
                    //this.object.geometry.computeBoundingBox()
                    this.update()
                    break;
                default:
                    break;
            }

        });
        renderer.domElement.addEventListener( "mousedown", (e) => {
            this.selectedHelper = this.activeHelper;
        });
        renderer.domElement.addEventListener( "mouseup", (e) => {
            this.selectedHelper = null;
        });
        
    }

    attach (object) {
        this.object = object;
        this.scene.add(...this.helpers);
        this.update();
        return this;
    }

	onPointerHover (event) {
		if (!this.enabled) return;
		this.pointerHover(this.getPointer(event));
	}

    getPointer( event ) {
        let pointer = event.changedTouches ? event.changedTouches[ 0 ] : event;
        let rect = this.renderer.domElement.getBoundingClientRect();
        return {
            x: ( pointer.clientX - rect.left ) / rect.width * 2 - 1,
            y: - ( pointer.clientY - rect.top ) / rect.height * 2 + 1,
            button: event.button
        };
    }
    
	pointerHover ( pointer ) {

		if ( this.object === undefined || ( pointer.button !== undefined && pointer.button !== 0 ) ) return;
		this.ray.setFromCamera(pointer, this.camera);
		let intersect = this.ray.intersectObjects(this.helpers)[ 0 ] || false;

		if ( intersect ) {
            this.activeHelper = intersect.object.name;
		} else {
			this.activeHelper = null;
		}

	}

    update () {
        this.box.setFromObject(this.object);
        this.helpers[0].position.set(this.box.min.x, (this.box.min.y + this.box.max.y) / 2, (this.box.min.z + this.box.max.z) / 2);
        this.helpers[1].position.set(this.box.max.x, (this.box.min.y + this.box.max.y) / 2, (this.box.min.z + this.box.max.z) / 2);
        this.helpers[2].position.set((this.box.min.x + this.box.max.x) / 2, (this.box.min.y + this.box.max.y) / 2, this.box.min.z);
        this.helpers[3].position.set((this.box.min.x + this.box.max.x) / 2, (this.box.min.y + this.box.max.y) / 2, this.box.max.z);
        this.events.dispatchEvent({
            type: 'update',
            message: null
        });
    }
}