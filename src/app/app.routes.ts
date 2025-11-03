import type { Routes } from "@angular/router"
import { AdminLayoutComponent } from "./layouts/admin-layout/admin-layout.component"
import { PublicLayoutComponent } from "./layouts/public-layout/public-layout.component"
import { HomeComponent } from "./pages/public/home/home.component"
import { ProdutosComponent } from "./pages/public/produtos/produtos.component"
import { GabineteDetailComponent } from "./pages/public/gabinete-detail/gabinete-detail.component"
import { CategoriaListComponent } from "./pages/admin/categoria/categoria-list/categoria-list"
import { CategoriaFormComponent } from "./pages/admin/categoria/categoria-form/categoria-form"
import { ClienteListComponent } from "./pages/admin/cliente/cliente-list.component/cliente-list.component"
import { ClienteFormComponent } from "./pages/admin/cliente/cliente-form.component/cliente-form.component"
import { EstoqueListComponent } from "./pages/admin/estoque/estoque-list/estoque-list"
import { EstoqueFormComponent } from "./pages/admin/estoque/estoque-form/estoque-form"
import { FornecedorListComponent } from "./pages/admin/fornecedor/fornecedor-list.component/fornecedor-list.component"
import { FornecedorFormComponent } from "./pages/admin/fornecedor/fornecedor-form.component/fornecedor-form.component"
import { GabineteListComponent } from "./pages/admin/gabinete/gabinete-list.component/gabinete-list.component"
import { GabineteFormComponent } from "./pages/admin/gabinete/gabinete-form.component/gabinete-form.component"
import { ItemPedidoList } from "./pages/admin/item-pedido/item-pedido-list/item-pedido-list"
import { ItemPedidoForm } from "./pages/admin/item-pedido/item-pedido-form/item-pedido-form"
import { MarcaListComponent } from "./pages/admin/marca/marca-list.component/marca-list.component"
import { ModeloListComponent } from "./pages/admin/modelo/modelo-list.component/modelo-list.component"
import { ModeloFormComponent } from "./pages/admin/modelo/modelo-form.component/modelo-form.component"
import { PagamentoListComponent } from "./pages/admin/pagamento/pagamento-list/pagamento-list.component"
import { PagamentoFormComponent } from "./pages/admin/pagamento/pagamento-form/pagamento-form.component"
import { PedidoListComponent } from "./pages/admin/pedido/pedido-list/pedido-list"
import { PedidoForm } from "./pages/admin/pedido/pedido-form/pedido-form"
import { AboutComponent } from "./pages/public/about/about.component"
import { PaymentComponent } from "./pages/public/payment/payment.component"
import { CartComponent } from "./pages/public/cart/cart.component"
import { ContactComponent } from "./pages/public/contact/contact.component"
import { RegisterComponent } from "./pages/public/register/register.component"
import { LoginComponent } from "./pages/public/login/login.component"
import { NoAuthGuard } from "./guards/no-auth.guard"
import { AuthGuard } from "./guards/auth.guard"
import { MarcaFormComponent } from "./pages/admin/marca/marca-form/marca-form"


export const routes: Routes = [
  {
    path: "",
    component: PublicLayoutComponent,
    children: [
      { path: "", component: HomeComponent },
      { path: "home", component: HomeComponent },
      { path: "produtos", component: ProdutosComponent },
      { path: "gabinete-detail/:id", component: GabineteDetailComponent },
      { path: "sobre", component: AboutComponent },
      { path: "pagamento", component: PaymentComponent, canActivate: [AuthGuard] },
      { path: "carrinho", component: CartComponent, canActivate: [AuthGuard] },
      { path: "contato", component: ContactComponent },
      { path: "registrar", component: RegisterComponent, canActivate: [NoAuthGuard] },
      { path: "login", component: LoginComponent, canActivate: [NoAuthGuard] },
    ],
  },

  {
    path: "admin",
    component: AdminLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: "categorias", component: CategoriaListComponent },
      { path: "categorias/form", component: CategoriaFormComponent },
      { path: "categorias/form/:id", component: CategoriaFormComponent },

      { path: "clientes", component: ClienteListComponent },
      { path: "clientes/form", component: ClienteFormComponent },
      { path: "clientes/form/:id", component: ClienteFormComponent },

      { path: "estoque", component: EstoqueListComponent },
      { path: "estoque/form", component: EstoqueFormComponent },
      { path: "estoque/form/:id", component: EstoqueFormComponent },

      { path: "fornecedores", component: FornecedorListComponent },
      { path: "fornecedores/form", component: FornecedorFormComponent },
      { path: "fornecedores/form/:id", component: FornecedorFormComponent },

      { path: "gabinetes", component: GabineteListComponent },
      { path: "gabinetes/form", component: GabineteFormComponent },
      { path: "gabinetes/form/:id", component: GabineteFormComponent },

      { path: "item-pedido", component: ItemPedidoList },
      { path: "item-pedido/form", component: ItemPedidoForm },
      { path: "item-pedido/form/:id", component: ItemPedidoForm },

      { path: "marcas", component: MarcaListComponent },
      { path: "marcas/form", component: MarcaFormComponent },
      { path: "marcas/form/:id", component: MarcaFormComponent },

      { path: "modelos", component: ModeloListComponent },
      { path: "modelos/form", component: ModeloFormComponent },
      { path: "modelos/form/:id", component: ModeloFormComponent },

      { path: "pagamento", component: PagamentoListComponent },
      { path: "pagamento/form", component: PagamentoFormComponent },
      { path: "pagamento/form/:id", component: PagamentoFormComponent },

      { path: "pedidos", component: PedidoListComponent },
      { path: "pedidos/form", component: PedidoForm },
      { path: "pedidos/form/:id", component: PedidoForm },
    ],
  },

  {
    path: "**",
    redirectTo: "",
  },
]
