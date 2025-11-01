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
import { Estoque} from "../../../../models/estoque.model"
import { finalize } from "rxjs/operators"
import { EstoqueService } from "../../../../services/estoque.service"
import { GabineteService } from "../../../../services/gabinete.service"
import { ActivatedRoute, Router, RouterModule } from "@angular/router"
import { Gabinete } from "../../../../models/gabinete.model"

@Component({
  selector: "app-estoque-form",
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
  templateUrl: "./estoque-form.html",
  styleUrls: ["./estoque-form.css"],
})
export class EstoqueFormComponent implements OnInit {
  estoque: Estoque = { id: 0, gabinete: {} as Gabinete, quantidadeDisponivel: 0 }
  gabinetes: Gabinete[] = []
  carregando = false
  salvando = false
  erro?: string
  isEdicao = false

  constructor(
    private estoqueService: EstoqueService,
    private gabineteService: GabineteService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.carregarGabinetes()

    const idParam = this.route.snapshot.paramMap.get("id")
    const id = idParam ? Number(idParam) : 0

    if (id && id > 0) {
      this.isEdicao = true
      this.carregando = true
      this.estoqueService
        .buscarPorId(id)
        .pipe(finalize(() => (this.carregando = false)))
        .subscribe({
          next: (dto) => (this.estoque = dto),
          error: () => (this.erro = "Não foi possível carregar o estoque."),
        })
    }
  }

  carregarGabinetes(): void {
    this.gabineteService.listarTodos().subscribe({
      next: (data) => (this.gabinetes = data),
      error: () => (this.erro = "Não foi possível carregar os gabinetes."),
    })
  }

  salvar(): void {
    this.erro = undefined
    this.salvando = true

    const req$ =
      this.estoque.id && this.estoque.id > 0
        ? this.estoqueService.atualizar(this.estoque.id, this.estoque)
        : this.estoqueService.salvar(this.estoque)

    req$.pipe(finalize(() => (this.salvando = false))).subscribe({
      next: () => this.router.navigate(["admin/estoque"]),
      error: () => (this.erro = "Não foi possível salvar o estoque."),
    })
  }

  cancelar(): void {
    this.router.navigate(["admin/estoque"])
  }
}
