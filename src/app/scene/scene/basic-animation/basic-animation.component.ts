import { NgtsOrbitControls } from 'angular-three-soba/controls';
import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  HostListener,
  viewChild,
} from '@angular/core';
import {
  extend,
  injectStore,
  NgtArgs,
  NgtBeforeRenderEvent,
} from 'angular-three';
import { NgtsPerspectiveCamera } from 'angular-three-soba/cameras';
import * as THREE from 'three';
import gsap from 'gsap';
import * as dat from 'dat.gui';
import init from 'three-dat.gui';

init(dat);

extend(THREE);

@Component({
  selector: 'app-basic-animation',
  standalone: true,
  imports: [NgtsPerspectiveCamera, NgtArgs, NgtsOrbitControls],
  template: `
    <ngts-perspective-camera
      [options]="{
        makeDefault: true,
        fov: 70,
        aspect: viewport().width / viewport().height,
        near: 0.5,
        position: [0, 0, 8]
      }"
      #camera
    />
    <ngt-mesh
      (pointerover)="hovered = true"
      (pointerout)="hovered = false"
      (beforeRender)="onBeforeRender($event)"
    >
      <ngt-box-geometry *args="[1, 1, 1, 2, 2, 2]" />
      <ngt-mesh-basic-material
        [color]="hovered! ? 'red' : 'blue'"
        [wireframe]="false"
      />
    </ngt-mesh>
    <ngt-mesh customGeometry>
      <ngt-buffer-geometry />
      <ngt-mesh-basic-material [color]="'red'" [wireframe]="true" />
    </ngt-mesh>
    <ngts-orbit-controls />
  `,
  styles: ``,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasicAnimationComponent {
  hovered: boolean = false;

  // sizes = {
  //   width: window.innerWidth,
  //   height: window.innerHeight,
  // };

  private cameraPerspectiveRef =
    viewChild.required<NgtsPerspectiveCamera>('camera');

  /**
   * * Get  the current viewport and WebGL.
   */
  private store = injectStore();
  viewport = this.store.select('viewport');
  private gl = this.store.select('gl');

  /**
   * * Debug
   */
  gui = new dat.GUI();

  // triangleRef = viewChild.required<NgtBufferGeometry>('triangle');
  // positionArray: Float32Array = new Float32Array([0, 0, 0, 0, 1, 0, 1, 0, 0]);
  // positionAttribute = new THREE.BufferAttribute(this.positionArray, 3);

  // private face = NgtFace3

  ngOnInit(): void {
    // this.triangleRef().setAttribute!('position', this.positionAttribute);
    this.customGeometry();
  }
  /**
   * resizeScreen responsive canvas
   * @param event resize
   */
  @HostListener('window:resize', ['$event'])
  resizeScreen(event: UIEvent) {
    // this.sizes.width = window.innerWidth;
    // this.sizes.height = window.innerHeight;
    this.gl().setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // gl().setSize(this.viewport().width, this.viewport().height);

    // this.cameraPerspectiveRef().cameraRef().nativeElement.aspect = this.sizes.width / this.sizes.height;
  }
  /**
   * Full screen event
   * @param event double click
   */
  @HostListener('window:dblclick', ['$event'])
  fullScreen(event: MouseEvent) {
    const fullScreenElement = document.fullscreenElement;

    !fullScreenElement
      ? document.documentElement.requestFullscreen()
      : document.exitFullscreen();
  }

  clock = new THREE.Clock();

  /**
   * Method customGeometry for create a sevral triangles with BufferGeometry from TheeJs.
   */
  customGeometry() {
    const customGeometry = new THREE.BufferGeometry();
    const count = 50;
    const positionsArray = new Float32Array(count * 3 * 3);
    for (let i = 0; i < count * 3 * 3; i++) {
      positionsArray[i] = (Math.random() - 0.5) * 6;
    }
    const positionAttribute = new THREE.BufferAttribute(positionsArray, 3);
    customGeometry.setAttribute('position', positionAttribute);
    const material = new THREE.MeshBasicMaterial({
      color: 'red',
      wireframe: true,
    });
    const mesh = new THREE.Mesh(customGeometry, material);

    //* Get the scene
    const scene = this.store.select('scene');
    scene().add(mesh);
    this.initMesh(mesh, material);
    this.initGui();
    this.spinAnimate(mesh);
  }

  /**
   * Method On onBeforeRender(), we type event with NgtBeforeRenderEvent<THREE.Mesh>
   * event.state is the state of our Scene graph; mouse position, clock, delta, scene, camera, the GL renderer etc...
   * event.object is the instance of the object we're attaching (beforeRender) on. In this case, it is a THREE.Mesh
   * @param event NgtBebforeRenderEvent Event binding.
   */
  onBeforeRender(event: NgtBeforeRenderEvent<THREE.Mesh>) {
    const cube = event.object;
    const time = this.clock.getElapsedTime();

    cube.rotation.x += 0.01;
    cube.rotation.y = time;
    cube.scale.x = Math.sin(time * 2) + 2;
    cube.scale.y = Math.sin(time * 2) + 2;
    cube.scale.z = Math.sin(time * 2) + 2;
  }

  // * Debug

  initGui() {
    const camera: THREE.Camera =
      this.cameraPerspectiveRef().cameraRef().nativeElement;
    this.gui.addCamera('Perspective Camera', camera);
  }

  initMesh(mesh: THREE.Mesh, material: THREE.Material) {
    // this.gui
    //   .add(mesh.position, 'x')
    //   .min(-3)
    //   .max(3)
    //   .step(0.01)
    //   .name('horizontal');
    // this.gui
    //   .add(mesh.position, 'y')
    //   .min(-3)
    //   .max(3)
    //   .step(0.01)
    //   .name('vertical');
    // this.gui
    //   .add(mesh.position, 'z')
    //   .min(-3)
    //   .max(3)
    //   .step(0.01)
    //   .name('depth');
    this.gui.addMesh('customGeometry', mesh);
    this.gui.addMaterial('basic_material', material);
  }

  spinAnimate(mesh: THREE.Mesh) {
    /**
     * Parameters for base animation of the custom geometry.
     *
     */
    const params = {
      color: 0xff0000,
      spin: () => {
        gsap.to(mesh.rotation, 6, { y: mesh.rotation.y + Math.PI * 2, ease: 'elastic' });
      },
    };

    this.gui.add(params, 'spin');
  }
}

