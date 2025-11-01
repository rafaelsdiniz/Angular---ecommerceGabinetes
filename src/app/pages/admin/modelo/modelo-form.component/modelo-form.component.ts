import { Component, type OnInit } from "@angular/core"
import { FormsModule } from "@angular/forms"
import { CommonModule } from "@angular/common"
import { MatCardModule } from "@angular/material/card"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"
import { MatSelectModule } from "@angular/material/select"
import { Modelo } from "../../../../models/modelo.model"
import { Marca } from "../../../../models/marca.model"
import { finalize } from "rxjs/operators"
import { ModeloService } from "../../../../services/modelo.service"
import { MarcaService } from "../../../../services/marca.service"
import { ActivatedRoute, Router, RouterModule } from "@angular/router"

@Component({
  selector: "app-modelo-form",
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
    MatSelectModule,
  ],
  templateUrl: "./modelo-form.component.html",
  styleUrls: ["./modelo-form.component.css"],
})
export class ModeloFormComponent implements OnInit {
  modelo: Modelo = { id: 0, nomeModelo: "", marca: {} as Marca }
  marcas: Marca[] = []
  carregando = false
  salvando = false
  erro?: string
  isEdicao = false

  constructor(
    private modeloService: ModeloService,
    private marcaService: MarcaService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.carregarMarcas()
    const idParam = this.route.snapshot.paramMap.get("id")
    const id = idParam ? Number(idParam) : 0

    if (id && id > 0) {
      this.isEdicao = true
      this.carregando = true
      this.modeloService
        .buscarPorId(id)
        .pipe(finalize(() => (this.carregando = false)))
        .subscribe({
          next: (dto) => (this.modelo = dto),
          error: () => (this.erro = "Não foi possível carregar o modelo."),
        })
    }
  }

  carregarMarcas(): void {
    this.marcaService.listarTodos().subscribe({
      next: (data) => (this.marcas = data),
      error: () => (this.erro = "Não foi possível carregar as marcas."),
    })
  }

  salvar(): void {
    this.erro = undefined
    this.salvando = true

    const req$ =
      this.modelo.id && this.modelo.id > 0
        ? this.modeloService.atualizar(this.modelo.id, this.modelo)
        : this.modeloService.criar(this.modelo)

    req$.pipe(finalize(() => (this.salvando = false))).subscribe({
      next: () => this.router.navigate(["admin/modelos"]),
      error: () => (this.erro = "Não foi possível salvar o modelo."),
    })
  }

  cancelar(): void {
    this.router.navigate(["admin/modelos"])
  }
}
