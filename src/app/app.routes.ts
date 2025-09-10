import { Routes } from '@angular/router';
import { CategoriaListComponent } from './components/categoria/categoria-list/categoria-list';
import { CategoriaFormComponent } from './components/categoria/categoria-form/categoria-form';
import { HomeComponent } from './components/home/home.component';
import { ClienteFisicoList } from './components/cliente-fisico/cliente-fisico-list/cliente-fisico-list';
import { ClienteFisicoForm } from './components/cliente-fisico/cliente-fisico-form/cliente-fisico-form';
import { ClienteJuridicoList } from './components/cliente-juridico/cliente-juridico-list/cliente-juridico-list';
import { ClienteJuridicoForm } from './components/cliente-juridico/cliente-juridico-form/cliente-juridico-form';
import { EstoqueList } from './components/estoque/estoque-list/estoque-list';
import { EstoqueForm } from './components/estoque/estoque-form/estoque-form';
import { GabineteList } from './components/gabinete/gabinete-list/gabinete-list';
import { GabineteForm } from './components/gabinete/gabinete-form/gabinete-form';
import { ItemPedidoList } from './components/item-pedido/item-pedido-list/item-pedido-list';
import { ItemPedidoForm } from './components/item-pedido/item-pedido-form/item-pedido-form';
import { MarcaList } from './components/marca/marca-list/marca-list';
import { MarcaForm } from './components/marca/marca-form/marca-form';
import { PagamentoList } from './components/pagamento/pagamento-list/pagamento-list';
import { PagamentoForm } from './components/pagamento/pagamento-form/pagamento-form';
import { PedidoList } from './components/pedido/pedido-list/pedido-list';
import { PedidoForm } from './components/pedido/pedido-form/pedido-form';

export const routes: Routes = [

  { path: '', component: HomeComponent},
  { path: 'home', component: HomeComponent},

  { path: 'categorias', component: CategoriaListComponent }, 
  { path: 'categorias/form', component: CategoriaFormComponent },     
  { path: 'categorias/form/:id', component: CategoriaFormComponent },

  { path: 'cliente-fisico', component: ClienteFisicoList},
  { path: 'cliente-fisico/form', component: ClienteFisicoForm},
  { path: 'cliente-fisico/form/:id', component: ClienteFisicoForm},

  { path: 'cliente-juridico', component: ClienteJuridicoList},
  { path: 'cliente-juridico/form', component: ClienteJuridicoForm},
  { path: 'cliente-juridico/form/:id', component: ClienteJuridicoForm},

  { path: 'estoque', component: EstoqueList},
  { path: 'estoque/form', component: EstoqueForm},
  { path: 'estoque/form/:id', component: EstoqueForm},

  { path: 'gabinete', component: GabineteList},
  { path: 'gabinete/form', component: GabineteForm},
  { path: 'gabinete/form/:id', component: GabineteForm},

  { path: 'item-pedido', component: ItemPedidoList},
  { path: 'item-pedido/form', component: ItemPedidoForm},
  { path: 'item-pedido/form/:id', component: ItemPedidoForm},

  { path: 'marca', component: MarcaList},
  { path: 'marca/form', component: MarcaForm},
  { path: 'marca/form/:id', component: MarcaForm},

  { path: 'pagamento', component: PagamentoList},
  { path: 'pagamento/form', component: PagamentoForm},
  { path: 'pagamento/form/:id', component: PagamentoForm},

  { path: 'pedido', component: PedidoList},
  { path: 'pedido/form', component: PedidoForm},
  { path: 'pedido/form/:id', component: PedidoForm}


];
