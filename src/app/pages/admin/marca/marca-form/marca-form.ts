import { Component, type OnInit } from "@angular/core"
import { FormsModule } from "@angular/forms"
import { CommonModule } from "@angular/common"
import { MatCardModule } from "@angular/material/card"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"
import type { Marca } from "../../../../models/marca.model"
import { finalize } from "rxjs/operators"
import { MarcaService } from "../../../../services/marca.service"
import { ActivatedRoute, Router, RouterModule } from "@angular/router"

@Component({
  selector: "app-marca-form",
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
  templateUrl: "./marca-form.html",
  styleUrls: ["./marca-form.css"],
})
export class MarcaFormComponent implements OnInit {
  marca: Marca = { id: 0, nome: "", descricao: "" }
  carregando = false
  salvando = false
  erro?: string
  isEdicao = false

  constructor(
    private marcaService: MarcaService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get("id")
    const id = idParam ? Number(idParam) : 0

    if (id && id > 0) {
      this.isEdicao = true
      this.carregando = true
      this.marcaService
        .buscarPorId(id)
        .pipe(finalize(() => (this.carregando = false)))
        .subscribe({
          next: (dto) => (this.marca = dto),
          error: () => (this.erro = "Não foi possível carregar a marca."),
        })
    }
  }

  salvar(): void {
    this.erro = undefined
    this.salvando = true

    const req$ =
      this.marca.id && this.marca.id > 0
        ? this.marcaService.atualizar(this.marca.id, this.marca)
        : this.marcaService.salvar(this.marca)

    req$.pipe(finalize(() => (this.salvando = false))).subscribe({
      next: () => this.router.navigate(["/marcas"]),
      error: () => (this.erro = "Não foi possível salvar a marca."),
    })
  }

  cancelar(): void {
    this.router.navigate(["/marcas"])
  }
}
