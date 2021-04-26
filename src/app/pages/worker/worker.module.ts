import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ComponentsModule } from 'src/app/components/components.module';
import { WorkerPage } from './worker.page';
import { FormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: '',
    component: WorkerPage,
    children: [
      { path: '', redirectTo: 'summary', pathMatch: 'full' },
      { path: 'summary', loadChildren: () => import('./summary/summary.module').then(m => m.WorkerSummaryPageModule) },
      { path: 'edit', loadChildren: () => import('./edit/edit.module').then(m => m.WorkerEditPageModule) },
      { path: 'backends', loadChildren: () => import('./backends/backends.module').then(m => m.WorkerBackendsPageModule) },
      { path: 'config', loadChildren: () => import('./config/config.module').then(m => m.WorkerConfigPageModule) },
    ]
  }
];

@NgModule({
  declarations: [
    WorkerPage
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    FormsModule,
    RouterModule.forChild(routes)
  ]
})
export class WorkerPageModule { }
