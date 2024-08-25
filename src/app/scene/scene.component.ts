import { Component } from '@angular/core';
import { NgtCanvas } from 'angular-three';
import { SlideshowComponent } from './scene/slideshow/slideshow.component';

@Component({
  standalone: true,
  imports: [NgtCanvas],
  template: `<ngt-canvas
    [sceneGraph]="scene"
    [shadows]="true"
    [camera]="{ position: [0, 0, 5], fov: 30 }"
  />`,
  host: {
    class: 'block h-screen w-screen flex justify-center items-center',
  },
})
export default class SceneComponent {
  protected scene = SlideshowComponent;
}
