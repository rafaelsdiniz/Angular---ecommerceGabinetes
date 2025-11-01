import { Component, type OnInit } from "@angular/core"
import { FormsModule } from "@angular/forms"
import { CommonModule } from "@angular/common"
import { MatCardModule } from "@angular/material/card"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"
import type { Gabinete } from "../../../../models/gabinete.model"
import { finalize } from "rxjs/operators"
import { GabineteService } from "../../../../services/gabinete.service"
import { ActivatedRoute, Router, RouterModule } from "@angular/router"

@Component({
  selector: "app-gabinete-form",
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
  templateUrl: "./gabinete-form.component.html",
  styleUrls: ["./gabinete-form.component.css"],
})
export class GabineteFormComponent implements OnInit {
  gabinete: Gabinete = {
    nomeExibicao: "",
    preco: 0,
    cor: "",
    marca: "",
  }
  carregando = false
  salvando = false
  erro?: string
  isEdicao = false

  constructor(
    private gabineteService: GabineteService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get("id")
    const id = idParam ? Number(idParam) : 0

    if (id && id > 0) {
      this.isEdicao = true
      this.carregando = true
      this.gabineteService
        .buscarPorId(id)
        .pipe(finalize(() => (this.carregando = false)))
        .subscribe({
          next: (dto) => (this.gabinete = dto),
          error: () => (this.erro = "Não foi possível carregar o gabinete."),
        })
    }
  }

  salvar(): void {
    this.erro = undefined
    this.salvando = true

    const req$ =
      this.gabinete.id && this.gabinete.id > 0
        ? this.gabineteService.atualizar(this.gabinete.id, this.gabinete)
        : this.gabineteService.salvar(this.gabinete)

    req$.pipe(finalize(() => (this.salvando = false))).subscribe({
      next: () => this.router.navigate(["/gabinetes"]),
      error: () => (this.erro = "Não foi possível salvar o gabinete."),
    })
  }

  cancelar(): void {
    this.router.navigate(["/gabinetes"])
  }
}
