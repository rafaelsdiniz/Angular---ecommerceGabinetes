import { Routes } from '@angular/router';
import { CategoriaListComponent } from './components/categoria/categoria-list/categoria-list';
import { CategoriaFormComponent } from './components/categoria/categoria-form/categoria-form';

export const routes: Routes = [
  { path: '', redirectTo: '/categorias', pathMatch: 'full' }, // redireciona para lista
  { path: 'categorias', component: CategoriaListComponent }, 
  { path: 'categorias/form', component: CategoriaFormComponent },      // novo
  { path: 'categorias/form/:id', component: CategoriaFormComponent },  // editar
  // você pode adicionar outras entidades aqui, tipo Gabinete, Cliente, Pedido...
];
