import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'scene',
    loadComponent: () => import('./scene/scene.component'),
    children: [],
  },
  {
    path: 'second-scene',
    loadComponent: () => import('./scene/second-scene.component')
  },
  {
    path: 'third-scene',
    loadComponent: () => import('./scene/third-scene.component')
  },
  {
    path: '**',
    redirectTo: '/second-scene',
    pathMatch: 'full',
  },
];
