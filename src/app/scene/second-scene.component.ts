import { Component, HostListener } from '@angular/core';
import { NgtCanvas } from 'angular-three';
import { BasicAnimationComponent } from './scene/basic-animation/basic-animation.component';

@Component({
  selector: 'app-second-scene',
  standalone: true,
  imports: [NgtCanvas],
  template: `<ngt-canvas [sceneGraph]="scene" />`,
  host: {
    class: 'block h-screen w-screen flex justify-center items-center bg-black',
  },
})
export default class SecondSceneComponent {
  public scene = BasicAnimationComponent;


}
