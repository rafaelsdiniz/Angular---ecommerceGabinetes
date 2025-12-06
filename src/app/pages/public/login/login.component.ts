import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from "@angular/forms"
import { RouterModule } from "@angular/router"
import { AuthService } from "../../../services/auth.service"

@Component({
  selector: "app-login",
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent {
  loginForm: FormGroup
  erro = ""
  carregando = false
  mostrarSenha = false

  constructor(
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]]
    })
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched()
      this.erro = "Por favor, preencha todos os campos corretamente"
      return
    }

    this.carregando = true
    this.erro = ""

    const { email, senha } = this.loginForm.value

    this.authService.login(email, senha).subscribe({
      next: () => {

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

  get emailControl() {
    return this.loginForm.get('email')
  }

  get senhaControl() {
    return this.loginForm.get('senha')
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName)
    return !!(field && field.invalid && (field.dirty || field.touched))
  }

  getFieldError(fieldName: string): string {
    const field = this.loginForm.get(fieldName)
    if (!field || !field.errors) return ''

    if (field.errors['required']) return 'Este campo é obrigatório'
    if (field.errors['email']) return 'Email inválido'
    if (field.errors['minlength']) return `Mínimo ${field.errors['minlength'].requiredLength} caracteres`
    
    return ''
  }
}
