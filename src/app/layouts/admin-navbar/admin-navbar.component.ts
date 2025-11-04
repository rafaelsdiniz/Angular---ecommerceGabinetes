import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { MatIconModule } from "@angular/material/icon"
import { RouterLink, RouterLinkActive } from "@angular/router"

@Component({
  selector: "app-admin-navbar",
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterLink, RouterLinkActive],
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
    { label: "Dashboard", route: "/admin/dashboard", icon: "dashboard"},
    { label: "Home", route: "/admin/home", icon: "home" },
    { label: "Categorias", route: "/admin/categorias", icon: "category" },
    { label: "Clientes", route: "/admin/clientes", icon: "people" },
    { label: "Estoque", route: "/admin/estoque", icon: "warehouse" },
    { label: "Fornecedores", route: "/admin/fornecedores", icon: "business" },
    { label: "Gabinetes", route: "/admin/gabinetes", icon: "computer" },
    { label: "Marcas", route: "/admin/marcas", icon: "label" },
    { label: "Modelos", route: "/admin/modelos", icon: "widgets" },
    { label: "Pedidos", route: "/admin/pedidos", icon: "shopping_cart" },
    { label: "Pagamentos", route: "/admin/pagamento", icon: "payment" },
  ]
}
