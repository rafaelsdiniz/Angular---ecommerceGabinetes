import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { Router, RouterModule } from "@angular/router"
import { AuthService } from "../../../services/auth.service"

@Component({
  selector: "app-login",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent {
  email = ""
  senha = ""
  erro = ""
  carregando = false
  mostrarSenha = false

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  onSubmit(): void {
    if (!this.email || !this.senha) {
      this.erro = "Por favor, preencha todos os campos"
      return
    }

    this.carregando = true
    this.erro = ""

    this.authService.login(this.email, this.senha).subscribe({
      next: () => {
        setTimeout(() => {
          this.router.navigate(["/"])
        }, 100)
      },
      error: (err) => {
        console.error("[v0] Login error:", err)
        this.erro = err.error?.message || "Erro ao fazer login. Verifique suas credenciais."
        this.carregando = false
      },
      complete: () => {
        this.carregando = false
      },
    })
  }

  toggleMostrarSenha(): void {
    this.mostrarSenha = !this.mostrarSenha
  }
}
