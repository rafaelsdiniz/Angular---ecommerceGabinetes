import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"

@Component({
  selector: "app-contact",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./contact.component.html",
  styleUrl: "./contact.component.css",
})
export class ContactComponent {
  formData = {
    nome: "",
    email: "",
    telefone: "",
    assunto: "",
    mensagem: "",
  }

  enviado = false
  erro = false

  enviarFormulario(): void {
    if (this.validarFormulario()) {
      console.log("Formulário enviado:", this.formData)
      this.enviado = true
      this.erro = false

      setTimeout(() => {
        this.resetarFormulario()
      }, 3000)
    } else {
      this.erro = true
    }
  }

  validarFormulario(): boolean {
    return this.formData.nome.trim() !== "" && this.formData.email.trim() !== "" && this.formData.mensagem.trim() !== ""
  }

  resetarFormulario(): void {
    this.formData = {
      nome: "",
      email: "",
      telefone: "",
      assunto: "",
      mensagem: "",
    }
    this.enviado = false
  }
}
