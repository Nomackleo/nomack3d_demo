import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'scene',
    loadComponent: () => import('./scene/scene.component'),
    children: [],
  },
  {
    path: '**',
    redirectTo: '/scene',
    pathMatch: 'full',
  },
];
