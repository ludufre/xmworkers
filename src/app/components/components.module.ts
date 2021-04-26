import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ClipboardModule } from 'ngx-clipboard';
import { MomentModule } from 'ngx-moment';
import { OrderModule } from 'ngx-order-pipe';
import { AddModalComponent } from './add/add.component';
import { ExportModalComponent } from './export/export.component';
import { HashrateComponent } from './hashrate/hashrate.component';
import { NavbarComponent } from './navbar/navbar.component';

@NgModule({
  declarations: [
    NavbarComponent,
    AddModalComponent,
    ExportModalComponent,
    HashrateComponent
  ],
  imports: [
    CommonModule,
    MomentModule,
    FontAwesomeModule,
    RouterModule,
    OrderModule,
    ReactiveFormsModule,
    ClipboardModule
  ],
  exports: [
    MomentModule,
    FontAwesomeModule,
    NavbarComponent,
    OrderModule,
    AddModalComponent,
    ExportModalComponent,
    HashrateComponent
  ]
})

export class ComponentsModule { }
