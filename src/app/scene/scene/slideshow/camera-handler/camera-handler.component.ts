import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  input,
  viewChild,
} from '@angular/core';
import { injectStore } from 'angular-three';
import { NgtsCameraControls } from 'angular-three-soba/controls';
import { injectAutoEffect } from 'ngxtension/auto-effect';
import { slide } from '../utils/state';

@Component({
  selector: 'app-camera-handler',
  standalone: true,
  imports: [NgtsCameraControls],
  template: ` <ngts-camera-controls
    [options]="{
      touches: { one: 0, two: 0, three: 0 },
      mouseButtons: $any({ left: 0, middle: 0, right: 0 })
    }"
  />`,
  styles: ``,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CameraHandlerComponent {
  slideDistance = input(1);

  private store = injectStore();
  private viewport = this.store.select('viewport');

  private cameraControlsRef = viewChild.required(NgtsCameraControls);

  private lastSlide = 0;
  private dollyDistance = 4.8;
  private positionSlideX = this.viewport().width + this.slideDistance();

  constructor() {
    const autoEffect = injectAutoEffect();
    afterNextRender(() => {
      autoEffect(() => {
        const cameraControls = this.cameraControlsRef().controls();

        const id = setTimeout(() => {
          void cameraControls.setLookAt(
            slide() * this.positionSlideX,
            0,
            5,
            slide() * this.positionSlideX,
            0,
            0
          );
        }, 200);

        return () => clearTimeout(id);
      });

      autoEffect(() => {
        const currentSlide = slide();
        if (
          this.lastSlide === currentSlide &&
          this.lastSlide &&
          currentSlide !== 0
        )
          return;
        void this.moveToSlide();
        this.lastSlide === currentSlide;
      });
    });
  }

  initPosition() {
    const positionX = this.lastSlide * this.positionSlideX;
    if (this.lastSlide !== 0) return positionX;

    return this.positionSlideX;
  }

  private async moveToSlide() {
    const cameraControls = this.cameraControlsRef().controls();

    await cameraControls.setLookAt(
      this.initPosition(),
      0,
      this.dollyDistance,
      this.initPosition(),
      0,
      0,
      true
    );

    await cameraControls.setLookAt(
      slide() * this.positionSlideX,
      0,
      this.dollyDistance,
      slide() * this.positionSlideX,
      0,
      0,
      true
    );

    await cameraControls.setLookAt(
      slide() * this.positionSlideX,
      0,
      5,
      slide() * this.positionSlideX,
      0,
      0,
      true
    );
    console.log(slide());
  }
}
