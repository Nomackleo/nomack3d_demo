import {
  ChangeDetectionStrategy,
  Component,
  effect,
  signal,
} from '@angular/core';
import { scenes, slide } from '../state';

@Component({
  selector: 'app-overlay',
  standalone: true,
  imports: [],
  templateUrl: './overlay.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverlayComponent {
  scenes = scenes;
  displaySlide = signal(slide());
  visible = signal(false);

  constructor() {
    effect(() => {
      setTimeout(() => {
        this.visible.set(true);
      }, 1000);
    });

    effect(
      () => {
        const currentSlide = slide();
        this.visible.set(false);
        setTimeout(() => {
          this.displaySlide.set(currentSlide);
          this.visible.set(true);
        }, 2600);
      },
      { allowSignalWrites: true }
    );
  }

  onNextClick() {
    slide.update((prev) => (prev < scenes.length - 1 ? prev + 1 : 0));
  }

  onPrevClick() {
    slide.update((prev) => (prev > 0 ? prev - 1 : scenes.length - 1));
  }
}
