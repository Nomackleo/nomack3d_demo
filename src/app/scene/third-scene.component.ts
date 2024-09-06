import { Component } from '@angular/core';
import { TextComponent } from './scene/text/text.component';
import { NgtCanvas } from 'angular-three';

@Component({
  selector: 'app-third-scene',
  standalone: true,
  imports: [NgtCanvas],
  template: `<ngt-canvas [sceneGraph]="scene"></ngt-canvas>`,
  styles: ``,
  host: {
    class: 'block h-screen w-screen flex justify-center items-center bg-black'
  }
})
export default class ThirdSceneComponent {
  protected scene = TextComponent;
}
