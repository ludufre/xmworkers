import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ComponentsModule } from 'src/app/components/components.module';
import { DashboardPage } from './dashboard.page';
import { BrowserModule } from '@angular/platform-browser';

const routes: Routes = [
  {
    path: '',
    component: DashboardPage
  }
];

@NgModule({
  declarations: [
    DashboardPage
  ],
  imports: [
    CommonModule,
    RouterModule,
    ComponentsModule,
    RouterModule.forChild(routes)
  ]
})
export class DashboardPageModule { }
