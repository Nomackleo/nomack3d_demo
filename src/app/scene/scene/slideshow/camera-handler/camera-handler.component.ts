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

/**
 * Camera Handler Component
 *
 * This component is responsible for handling camera movements and interactions.
 */
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
  /**
   * The distance to slide the camera.
   */
  slideDistance = input(1);

  /**
   * The store instance.
   */
  private store = injectStore();

  /**
   * The viewport observable.
   */
  private viewport = this.store.select('viewport');

  /**
   * The camera controls reference.
   */
  private cameraControlsRef = viewChild.required(NgtsCameraControls);

  /**
   * The last slide position.
   */
  private lastSlide = 0;

  /**
   * The dolly distance.
   */
  private dollyDistance = 4.8;

  /**
   * The position to slide the camera to on the X axis.
   */
  private positionSlideX = this.viewport().width + this.slideDistance();

  /**
   * Constructor.
   */
  constructor() {
    /**
     * Auto effect instance.
     */
    const autoEffect = injectAutoEffect();
    afterNextRender(() => {
      /**
       * Effect to set the camera look at position.
       */
      autoEffect(() => {
        /**
         * Camera controls instance.
         */
        const cameraControls = this.cameraControlsRef().controls();

        /**
         * Timeout ID.
         */
        const id = setTimeout(() => {
          /**
           * Set the camera look at position.
           */
          void cameraControls.setLookAt(
            slide() * this.positionSlideX,
            0,
            5,
            slide() * this.positionSlideX,
            0,
            0
          );
        }, 200);

        /**
         * Clear the timeout on destroy.
         */
        return () => clearTimeout(id);
      });

      /**
       * Effect to move the camera to the current slide.
       */
      autoEffect(() => {
        /**
         * Current slide position.
         */
        const currentSlide = slide();
        if (
          this.lastSlide === currentSlide &&
          this.lastSlide &&
          currentSlide !== 0
        )
          return;
        /**
         * Move the camera to the current slide.
         */
        void this.moveToSlide();
        this.lastSlide === currentSlide;
      });
    });
  }

  /**
   * Initialize the camera position.
   *
   * @returns The initial camera position.
   */
  initPosition() {
    /**
     * Calculate the position based on the last slide.
     */
    const positionX = this.lastSlide * this.positionSlideX;
    if (this.lastSlide !== 0) return positionX;

    /**
     * Return the default position.
     */
    return this.positionSlideX;
  }

  /**
   * Move the camera to the current slide.
   */
  private async moveToSlide() {
    /**
     * Camera controls instance.
     */
    const cameraControls = this.cameraControlsRef().controls();

    /**
     * Move the camera to the initial position.
     */
    await cameraControls.setLookAt(
      this.initPosition(),
      0,
      this.dollyDistance,
      this.initPosition(),
      0,
      0,
      true
    );

    /**
     * Move the camera to the current slide position.
     */
    await cameraControls.setLookAt(
      slide() * this.positionSlideX,
      0,
      this.dollyDistance,
      slide() * this.positionSlideX,
      0,
      0,
      true
    );

    /**
     * Move the camera to the final position.
     */
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
