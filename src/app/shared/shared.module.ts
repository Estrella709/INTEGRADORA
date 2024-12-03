import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogoComponent } from './components/logo/logo.component';
import { HeaderComponent } from './components/header/header.component';
import { CustomInputComponent } from './components/custom-input/custom-input.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddUpdateAsistentComponent } from './components/add-update-asistent/add-update-asistent.component';
import { ViewGroupAsistentComponent } from './components/view-group-asistent/view-group-asistent.component';
import { AddUpdateDocentesComponent } from './components/add-update-docentes/add-update-docentes.component';
import { AddUpdateAdministrativoComponent } from './components/add-update-administrativo/add-update-administrativo.component';

@NgModule({
  declarations: [
    LogoComponent,
    HeaderComponent,
    CustomInputComponent,
    AddUpdateAsistentComponent,
    AddUpdateDocentesComponent,
    AddUpdateAdministrativoComponent,
    ViewGroupAsistentComponent],

  exports: [
    LogoComponent,
    HeaderComponent,
    ReactiveFormsModule,
    AddUpdateAdministrativoComponent,

    CustomInputComponent,
    AddUpdateDocentesComponent,
    AddUpdateAsistentComponent,
    ViewGroupAsistentComponent],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class SharedModule { }
