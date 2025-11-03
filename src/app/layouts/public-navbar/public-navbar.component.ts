import { Component, OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule, Router } from "@angular/router"
import { AuthService } from "../../services/auth.service"

@Component({
  selector: "app-public-navbar",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./public-navbar.component.html",
  styleUrls: ["./public-navbar.component.css"],
})
export class PublicNavbarComponent implements OnInit {
  menuAberto = false
  isLogado = false
  clienteNome = ""
  isAdmin = false

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.authService.isLogado().subscribe((logado) => {
      this.isLogado = logado
    })

    this.authService.getCliente().subscribe((cliente) => {
      if (cliente) {
        this.clienteNome = cliente.nome || cliente.email
        this.isAdmin = cliente.perfil === "ADMIN"
      }
    })
  }

  abrirFecharMenu(): void {
    this.menuAberto = !this.menuAberto
  }

  fecharMenu(): void {
    this.menuAberto = false
  }

  logout(): void {
    this.authService.logout()
    this.fecharMenu()
    this.router.navigate(["/"])
  }

  irParaAdmin(): void {
    this.router.navigate(["/admin/categorias"])
    this.fecharMenu()
  }
}
