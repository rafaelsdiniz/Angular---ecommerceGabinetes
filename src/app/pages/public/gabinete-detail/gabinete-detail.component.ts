import { Component, type OnInit } from "@angular/core"
import { ActivatedRoute, Router } from "@angular/router"
import { CommonModule } from "@angular/common"
import { GabineteService } from "../../../services/gabinete.service"
import { Gabinete } from "../../../models/gabinete.model"
import { CarrinhoService } from "../../../services/carrinho.service"

@Component({
  selector: "app-gabinete-detail",
  templateUrl: "./gabinete-detail.component.html",
  styleUrls: ["./gabinete-detail.component.css"],
  standalone: true,
  imports: [CommonModule],
})
export class GabineteDetailComponent implements OnInit {
  gabinete: Gabinete | null = null
  loading = true
  erro = ""

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private gabineteService: GabineteService,
    private carrinhoService: CarrinhoService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = params["id"]
      if (id) {
        this.carregarDetalhes(Number(id))
      } else {
        this.erro = "ID inválido"
        this.loading = false
      }
    })
  }

  carregarDetalhes(id: number): void {
    this.loading = true
    this.erro = ""
    this.gabineteService.buscarPorId(id).subscribe({
      next: (dados) => {
        this.gabinete = dados
        this.loading = false
      },
      error: (err) => {
        console.error(err)
        this.erro = "Gabinete não encontrado"
        this.loading = false
      },
    })
  }

  voltar(): void {
    this.router.navigate(["/produtos"])
  }

  adicionarAoCarrinho(): void {
    if (!this.gabinete) return;

    this.carrinhoService.adicionarItem({
      id: this.gabinete.id!,
      produto: this.gabinete, // 👈 passa o objeto completo aqui
      quantidade: 1
    });
  }


}
