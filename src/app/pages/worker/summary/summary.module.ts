import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ComponentsModule } from 'src/app/components/components.module';
import { WorkerSummaryPage } from './summary.page';
import { FormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: '',
    component: WorkerSummaryPage
  }
];

@NgModule({
  declarations: [
    WorkerSummaryPage
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    FormsModule,
    RouterModule.forChild(routes)
  ]
})
export class WorkerSummaryPageModule { }
