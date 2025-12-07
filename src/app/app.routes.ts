import { Routes } from '@angular/router';

export const routes: Routes = [
  // Lazy loading - LoginComponent loads at root path
  { path: '', loadComponent: () => import('./login/login.component').then(m => m.LoginComponent) },
  // Lazy loading - Home component loads only when navigating to /home

{path: 'userregistration', loadComponent: () => import('./userregistration/userregistration').then(m => m.UserRegistration) },  
  { path: 'home', loadComponent: () => import('./home/home').then(m => m.Home) },
  {path: '**', redirectTo: ''}  // Wildcard route to catch undefined paths and redirect to login
];
