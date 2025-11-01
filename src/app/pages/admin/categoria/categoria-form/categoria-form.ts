import { Component, type OnInit } from "@angular/core"
import { FormsModule } from "@angular/forms"
import { CommonModule } from "@angular/common"
import { MatCardModule } from "@angular/material/card"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"
import type { Categoria } from "../../../../models/categoria.model"
import { finalize } from "rxjs/operators"
import { CategoriaService } from "../../../../services/categoria.service"
import { ActivatedRoute, Router, RouterModule } from "@angular/router"

@Component({
  selector: "app-categoria-form",
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
  templateUrl: "./categoria-form.html",
  styleUrls: ["./categoria-form.css"],
})
export class CategoriaFormComponent implements OnInit {
  categoria: Categoria = { id: 0, nome: "", descricao: "" }
  carregando = false
  salvando = false
  erro?: string
  isEdicao = false

  constructor(
    private categoriaService: CategoriaService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get("id")
    const id = idParam ? Number(idParam) : 0

    if (id && id > 0) {
      this.isEdicao = true
      this.carregando = true
      this.categoriaService
        .buscarPorId(id)
        .pipe(finalize(() => (this.carregando = false)))
        .subscribe({
          next: (dto) => (this.categoria = dto),
          error: () => (this.erro = "Não foi possível carregar a categoria."),
        })
    }
  }

  salvar(): void {
    this.erro = undefined
    this.salvando = true

    const req$ =
      this.categoria.id && this.categoria.id > 0
        ? this.categoriaService.atualizar(this.categoria.id, this.categoria)
        : this.categoriaService.salvar(this.categoria)

    req$.pipe(finalize(() => (this.salvando = false))).subscribe({
      next: () => this.router.navigate(["admin/categorias"]),
      error: () => (this.erro = "Não foi possível salvar a categoria."),
    })
  }

  cancelar(): void {
    this.router.navigate(["admin/categorias"])
  }
}
