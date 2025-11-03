import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { AuthService, Cliente } from "../../../services/auth.service";

interface Endereco {
  rua: string;
  numero: string;
  complemento: string;
  cidade: string;
  estado: string;
  cep: string;
}

@Component({
  selector: "app-register",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"],
})
export class RegisterComponent {
  nome = "";
  email = "";
  telefone = "";
  cpf = "";
  senha = "";
  confirmarSenha = "";
  enderecos: Endereco[] = [{ rua: "", numero: "", complemento: "", cidade: "", estado: "", cep: "" }];

  erro = "";
  carregando = false;
  mostrarSenha = false;
  mostrarConfirmarSenha = false;
  aceitouTermos = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.erro = "";

    if (!this.nome || !this.email || !this.telefone || !this.cpf || !this.senha || !this.confirmarSenha) {
      this.erro = "Por favor, preencha todos os campos";
      return;
    }

    if (this.nome.length < 3 || this.nome.length > 200) {
      this.erro = "Nome deve ter entre 3 e 200 caracteres";
      return;
    }

    if (!/^\d{10,11}$/.test(this.telefone.replace(/\D/g, ""))) {
      this.erro = "Telefone deve ter 10 ou 11 dígitos";
      return;
    }

    if (!/^\d{11}$/.test(this.cpf.replace(/\D/g, ""))) {
      this.erro = "CPF deve ter 11 dígitos";
      return;
    }

    if (this.enderecos.length === 0 || !this.enderecos[0].rua) {
      this.erro = "Pelo menos um endereço é obrigatório";
      return;
    }

    if (this.senha !== this.confirmarSenha) {
      this.erro = "As senhas não coincidem";
      return;
    }

    if (this.senha.length < 6) {
      this.erro = "A senha deve ter no mínimo 6 caracteres";
      return;
    }

    if (!this.aceitouTermos) {
      this.erro = "Você deve aceitar os termos de uso";
      return;
    }

    this.carregando = true;

    const novoCliente: Cliente = {
      nome: this.nome,
      email: this.email,
      telefone: this.telefone.replace(/\D/g, ""),
      cpf: this.cpf.replace(/\D/g, ""),
      perfil: "CLIENTE", // Sempre CLIENTE
      enderecos: this.enderecos,
    };

    this.authService.registrar({ ...novoCliente, senha: this.senha } as any).subscribe({
      next: () => {
        this.router.navigate(["/login"], {
          queryParams: { message: "Conta criada com sucesso! Faça login para continuar." },
        });
      },
      error: (err) => {
        console.error("[v0] Register error:", err);
        this.erro = err.error?.message || "Erro ao criar conta. Tente novamente.";
        this.carregando = false;
      },
      complete: () => {
        this.carregando = false;
      },
    });
  }

  adicionarEndereco(): void {
    this.enderecos.push({ rua: "", numero: "", complemento: "", cidade: "", estado: "", cep: "" });
  }

  removerEndereco(index: number): void {
    if (this.enderecos.length > 1) {
      this.enderecos.splice(index, 1);
    }
  }

  toggleMostrarSenha(): void {
    this.mostrarSenha = !this.mostrarSenha;
  }

  toggleMostrarConfirmarSenha(): void {
    this.mostrarConfirmarSenha = !this.mostrarConfirmarSenha;
  }

  getSenhaForca(): string {
    if (!this.senha) return "";
    if (this.senha.length < 6) return "fraca";
    if (this.senha.length < 10) return "media";
    return "forte";
  }
}
