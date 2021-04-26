import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardPageModule) },
  { path: 'settings', loadChildren: () => import('./pages/settings/settings.module').then(m => m.SettingsPageModule) },
  { path: 'import/:data', loadChildren: () => import('./pages/import/import.module').then(m => m.ImportPageModule) },
  { path: 'worker/:url', loadChildren: () => import('./pages/worker/worker.module').then(m => m.WorkerPageModule) },
  { path: '**', redirectTo: '/dashboard' },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, relativeLinkResolution: 'legacy' })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
