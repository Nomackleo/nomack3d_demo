import {
  ChangeDetectionStrategy,
  Component,
  computed,
  CUSTOM_ELEMENTS_SCHEMA,
  signal,
  viewChild,
} from '@angular/core';
import { injectStore } from 'angular-three';
import { NgtsText3D } from 'angular-three-soba/abstractions';
import { NgtsPerspectiveCamera } from 'angular-three-soba/cameras';
import { NgtsOrbitControls } from 'angular-three-soba/controls';
import * as THREE from 'three';
import { TextBufferGeometry } from 'three-stdlib';

@Component({
  selector: 'app-text',
  standalone: true,
  imports: [NgtsPerspectiveCamera, NgtsOrbitControls, NgtsText3D],
  template: `
    <ngts-perspective-camera
      [options]="{ makeDefault: true, position: [1, 1, 6], near: 0.5 }"
    />
    <ngts-center>
      <ngts-text-3d
        (pointerover)="hovered.set(true)"
        (pointerout)="hovered.set(false)"
        [text]="text"
        [font]="font"
        [options]="{
          curveSegments: 32,
          bevelEnabled: true,
          bevelSize: 0.04,
          bevelThickness: 0.1,
          height: 0.5,
          lineHeight: 0.5,
          letterSpacing: -0.06,
          size: 1,
        }"
        #text3d
      >
        <ngt-mesh-basic-material [wireframe]="true" [color]="color()" />
      </ngts-text-3d>
    </ngts-center>

    <ngts-orbit-controls />
  `,

  styles: ``,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextComponent {
  private store = injectStore();

  private text3d = viewChild.required<NgtsText3D>('text3d');

  text = 'Nomack3D';
  font = 'fonts/Nunito_Sans_10pt_ExtraBold_Regular.json';
  hovered = signal(false);
  color = computed(() => (this.hovered() ? 'pink' : 'violet'));

  ngAfterViewInit(): void {
    const scene = this.store.select('scene');
    const axesHelper = new THREE.AxesHelper(1);
    scene().add(axesHelper);
    // requestAnimationFrame(() => this.textSetUp())
    // this.textSetUp();
  }

  textSetUp() {
    const textGeometry = this.text3d().meshRef()?.nativeElement as THREE.Mesh;
    if (!textGeometry) {
      console.error('Error: La geometría del texto no está disponible.');
      return;
    }

    const textBufferGeometry = textGeometry.geometry as TextBufferGeometry;

    const materialTextGeometry = textGeometry!
      .material as THREE.MeshBasicMaterial;

    if (!textBufferGeometry || !materialTextGeometry) {
      console.error('Error: La geometría o el material no están disponibles.');
      return;
    }

    materialTextGeometry.wireframe = true;

    textBufferGeometry.computeBoundingBox();
    const boundingBox = textBufferGeometry.boundingBox;
    console.log(textBufferGeometry.boundingBox);

    boundingBox !== null
      ? textBufferGeometry.translate(
          -(boundingBox.max.x + boundingBox.min.x) * 0.5,
          -(boundingBox.max.y + boundingBox.min.y) * 0.5,
          -(boundingBox.max.z + boundingBox.min.z) * 0.5
        )
      : console.error('Error');

    textBufferGeometry.computeBoundingBox();
    console.log(textBufferGeometry.boundingBox);
  }
}
