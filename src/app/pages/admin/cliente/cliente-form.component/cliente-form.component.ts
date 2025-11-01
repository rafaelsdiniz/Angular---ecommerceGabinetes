import { Component, type OnInit } from "@angular/core"
import { FormsModule } from "@angular/forms"
import { CommonModule } from "@angular/common"
import { MatCardModule } from "@angular/material/card"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"
import { MatDividerModule } from "@angular/material/divider"
import { Cliente } from "../../../../models/cliente.model"
import { finalize } from "rxjs/operators"
import { ClienteService } from "../../../../services/cliente.service"
import { ActivatedRoute, Router, RouterModule } from "@angular/router"

@Component({
  selector: "app-cliente-form",
  standalone: true,
  imports: [
    FormsModule,
    RouterModule,
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDividerModule,
  ],
  templateUrl: "./cliente-form.component.html",
  styleUrls: ["./cliente-form.component.css"],
})
export class ClienteFormComponent implements OnInit {
  cliente: Cliente = {
    nome: "",
    email: "",
    telefone: "",
    cpf: "",
    endereco: [],
  }
  carregando = false
  salvando = false
  erro?: string
  isEdicao = false

  constructor(
    private clienteService: ClienteService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get("id")
    const id = idParam ? Number(idParam) : 0

    if (id && id > 0) {
      this.isEdicao = true
      this.carregando = true
      this.clienteService
        .buscarPorId(id)
        .pipe(finalize(() => (this.carregando = false)))
        .subscribe({
          next: (dto) => {
            this.cliente = dto
          },
          error: () => (this.erro = "Não foi possível carregar o cliente."),
        })
    }
  }

  adicionarEndereco(): void {
    if (!this.cliente.endereco) {
      this.cliente.endereco = []
    }
    this.cliente.endereco.push({
      estado: "",
      cidade: "",
      bairro: "",
      cep: "",
      numero: "",
      complemento: "",
    })
  }

  removerEndereco(index: number): void {
    if (this.cliente.endereco) {
      this.cliente.endereco.splice(index, 1)
    }
  }

  salvar(): void {
    if (!this.validarFormulario()) {
      this.erro = "Preenchimento inválido. Verifique os campos."
      return
    }

    this.erro = undefined
    this.salvando = true

    const req$ =
      this.cliente.id && this.cliente.id > 0
        ? this.clienteService.atualizar(this.cliente.id, this.cliente)
        : this.clienteService.criar(this.cliente)

    req$.pipe(finalize(() => (this.salvando = false))).subscribe({
      next: () => this.router.navigate(["/clientes"]),
      error: () => (this.erro = "Não foi possível salvar o cliente."),
    })
  }

  validarFormulario(): boolean {
    return (
      this.cliente.nome.trim() !== "" &&
      this.cliente.email.trim() !== "" &&
      this.cliente.telefone.trim() !== "" &&
      this.cliente.cpf.trim() !== ""
    )
  }

  cancelar(): void {
    this.router.navigate(["/clientes"])
  }
}
