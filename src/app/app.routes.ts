import { Routes } from '@angular/router';

export const routes: Routes = [
  // Lazy loading - LoginComponent loads at root path
  { path: '', loadComponent: () => import('./login/login.component').then(m => m.LoginComponent) },
  // Lazy loading - Home component loads only when navigating to /home

  {path: 'profile/:id', loadComponent: () => import('./userregistration/userregistration').then(m => m.UserRegistration) },
  {path: 'voter_search', loadComponent: () => import('./voter-search/votersearch').then(m => m.VoterSearchComponent) },
  {
    path: 'home',
    loadComponent: () => import('./home/home').then(m => m.Home),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./dashboard/dashboard').then(m => m.DashboardComponent) },
      { path: 'voter_verification', loadComponent: () => import('./voter-verification/voter-verification').then(m => m.VoterVerification) },
      {path: 'create_election', loadComponent: () => import('./create-election/create-election').then(m => m.CreateElection) },
      { path: 'election_verification', loadComponent: () => import('./election-verification/election-verification').then(m => m.ElectionVerification) },
      {path: 'candidate_form', loadComponent: () => import('./candidate-form/candidate-form').then(m => m.CandidateForm) },
      { path: 'party', loadComponent: () => import('./party/party').then(m => m.PartyCreation) },
      {path: 'candidate_verification', loadComponent: () => import('./candidate-verification/candidate-verification').then(m => m.CandidateVerification) },
      {path: 'publish_election', loadComponent: () => import('./publish-election/publish-election').then(m => m.PublishElection) },
      {path: 'profile/:id', loadComponent: () => import('./userregistration/userregistration').then(m => m.UserRegistration) }
    ]
  },
  {path: '**', redirectTo: ''}  // Wildcard route to catch undefined paths and redirect to login
];
