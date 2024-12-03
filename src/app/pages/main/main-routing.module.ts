import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainPage } from './main.page';

const routes: Routes = [
  {
    path: '',
    component: MainPage,
    children: [
      {
        path: 'home',
        loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
      },

      {
        path: 'docentes',
        loadChildren: () => import('./docentes/docentes.module').then(m => m.DocentesPageModule)
      },
      {
        path: 'administrativos',
        loadChildren: () => import('./administrativos/administrativos.module').then(m => m.AdministrativosPageModule)
      },


      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },

    ]
  },







];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainPageRoutingModule { }
