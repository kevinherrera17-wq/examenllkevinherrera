import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { AuthGuard } from './auth-guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./auth/ui/pages/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'folder/:id',
    loadComponent: () =>
      import('./folder/folder.page').then((m) => m.FolderPage),
    canActivate: [() => inject(AuthGuard).canActivate()],
  },
  {
    path: '',
    redirectTo: 'folder/cards',
    pathMatch: 'full',
  },
];
