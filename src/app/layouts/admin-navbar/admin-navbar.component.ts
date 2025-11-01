import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterLink, RouterLinkActive } from "@angular/router"

@Component({
  selector: "app-admin-navbar",
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: "./admin-navbar.component.html",
  styleUrl: "./admin-navbar.component.css",
})
export class AdminNavbarComponent {
  isMenuOpen = false

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen
  }

  closeMenu() {
    this.isMenuOpen = false
  }

  menuItems = [
    { label: "Home", route: "/home" },
    { label: "Categorias", route: "/admin/categorias" },
    { label: "Clientes", route: "/admin/clientes" },
    { label: "Estoque", route: "/admin/estoque" },
    { label: "Fornecedores", route: "/admin/fornecedores" },
    { label: "Gabinetes", route: "/admin/gabinetes" },
    { label: "Marcas", route: "/admin/marcas" },
    { label: "Modelos", route: "/admin/modelos" },
    { label: "Pedidos", route: "/admin/pedidos" },
    { label: "Pagamentos", route: "/admin/pagamento" },
  ]
}
