import { Component } from '@angular/core';
import { NgtCanvas } from 'angular-three';
import { SlideshowComponent } from './scene/slideshow/slideshow.component';
import { OverlayComponent } from './scene/slideshow/utils/overlay/overlay.component';

@Component({
  standalone: true,
  imports: [NgtCanvas, OverlayComponent],
  template: `<ngt-canvas
      [sceneGraph]="scene"
      [shadows]="true"
      [camera]="{ position: [0, 0, 5], fov: 30 }"
    />
    <app-overlay /> `,
  host: {
    class: 'block h-screen w-screen flex justify-center items-center',
  },
})
export default class SceneComponent {
  protected scene = SlideshowComponent;
}
