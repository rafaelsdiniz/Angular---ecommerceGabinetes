import { Component, type OnInit } from "@angular/core"
import { FormsModule } from "@angular/forms"
import { CommonModule } from "@angular/common"
import { MatCardModule } from "@angular/material/card"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"
import { Fornecedor } from "../../../../models/fornecedor.model"
import { finalize } from "rxjs/operators"
import { FornecedorService } from "../../../../services/fornecedor.service"
import { ActivatedRoute, Router, RouterModule } from "@angular/router"

@Component({
  selector: "app-fornecedor-form",
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
  ],
  templateUrl: "./fornecedor-form.component.html",
  styleUrls: ["./fornecedor-form.component.css"],
})
export class FornecedorFormComponent implements OnInit {
  fornecedor: Fornecedor = { id: 0, nome: "", email: "", telefone: "", cnpj: "" }
  carregando = false
  salvando = false
  erro?: string
  isEdicao = false

  constructor(
    private fornecedorService: FornecedorService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get("id")
    const id = idParam ? Number(idParam) : 0

    if (id && id > 0) {
      this.isEdicao = true
      this.carregando = true
      this.fornecedorService
        .buscarPorId(id)
        .pipe(finalize(() => (this.carregando = false)))
        .subscribe({
          next: (dto) => (this.fornecedor = dto),
          error: () => (this.erro = "Não foi possível carregar o fornecedor."),
        })
    }
  }

  salvar(): void {
    this.erro = undefined
    this.salvando = true

    const req$ =
      this.fornecedor.id && this.fornecedor.id > 0
        ? this.fornecedorService.atualizar(this.fornecedor.id, this.fornecedor)
        : this.fornecedorService.criar(this.fornecedor)

    req$.pipe(finalize(() => (this.salvando = false))).subscribe({
      next: () => this.router.navigate(["admin/fornecedores"]),
      error: () => (this.erro = "Não foi possível salvar o fornecedor."),
    })
  }

  cancelar(): void {
    this.router.navigate(["admin/fornecedores"])
  }
}
