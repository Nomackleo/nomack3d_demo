import { scenes } from './utils/state';
import { Mesh } from 'three';
import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import { extend, injectStore, NgtArgs } from 'angular-three';
import * as THREE from 'three';
import { NgtsOrbitControls } from 'angular-three-soba/controls';
import {
  NgtsEnvironment,
  NgtsRenderTexture,
  NgtsRenderTextureContent,
} from 'angular-three-soba/staging';
import { NgtsGrid } from 'angular-three-soba/abstractions';
import { RenderTextureSceneComponent } from './render-texture-scene/render-texture-scene.component';
import { CameraHandlerComponent } from './camera-handler/camera-handler.component';

extend(THREE);

@Component({
  selector: 'app-slideshow',
  standalone: true,
  imports: [
    NgtArgs,
    NgtsOrbitControls,
    NgtsEnvironment,
    CameraHandlerComponent,
    NgtsGrid,
    NgtsRenderTexture,
    NgtsRenderTextureContent,
    RenderTextureSceneComponent,
  ],
  template: `
    <ngt-color *args="['#efefef']" attach="background" />
    <ngt-ambient-light [intensity]="0.2 * Math.PI" />
    <ngts-environment [options]="{ preset: 'city' }" />
    <app-camera-handler [slideDistance]="slideDistance" />

    <ngt-group> </ngt-group>

    @for (scene of scenes; track scene.name) {
    <ngt-mesh [position]="[$index * (viewport().width + slideDistance), 0, 0]">
      <ngt-plane-geometry *args="[viewport().width, viewport().height]" />
      <ngt-mesh-basic-material [toneMapped]="false">
        <ngts-render-texture>
          <app-render-texture-scene *renderTextureContent [scene]="scene" />
        </ngts-render-texture>
      </ngt-mesh-basic-material>
    </ngt-mesh>
    }

    <ngts-grid
      [options]="{
				position: [0, -viewport().height / 2, 0],
				sectionSize: 1,
				sectionColor: 'purple',
				sectionThickness: 1,
				cellSize: 0.5,
				cellColor: '#6f6f6f',
				cellThickness: 0.6,
				infiniteGrid: true,
				fadeDistance: 50,
				fadeStrength: 5,
			}"
    />
    <ngts-orbit-controls />
  `,
  styles: ``,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SlideshowComponent {
  Math: Math = Math;
  scenes = scenes;

  slideDistance = 1;

  private store = injectStore();
  viewport = this.store.select('viewport');
}
