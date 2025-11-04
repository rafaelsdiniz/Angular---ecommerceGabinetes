import { Component, OnInit } from "@angular/core"
import { FormsModule } from "@angular/forms"
import { CommonModule } from "@angular/common"
import { GabineteService } from "../../../services/gabinete.service"
import { Gabinete } from "../../../models/gabinete.model"
import { Router } from "@angular/router"

@Component({
  selector: "app-produtos",
  templateUrl: "./produtos.component.html",
  styleUrls: ["./produtos.component.css"],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class ProdutosComponent implements OnInit {
  gabinetes: Gabinete[] = []
  gabinetesFiltrados: Gabinete[] = []
  filtroNome = ""
  loading = true
  erro = ""

  paginaAtual = 1
  itensPorPagina = 12
  totalItens = 0
  totalPaginas = 0

  constructor(
    private gabineteService: GabineteService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.carregarTodos()
  }

  carregarTodos(): void {
    this.loading = true
    this.erro = ""
    this.gabineteService.listarTodos().subscribe({
      next: (dados) => {
        this.gabinetes = dados
        this.atualizarPaginacao()
        this.loading = false
      },
      error: (err) => {
        console.error(err)
        this.erro = "Erro ao carregar gabinetes. Tente novamente."
        this.loading = false
      },
    })
  }

  buscarPorNome(): void {
    if (!this.filtroNome.trim()) {
      this.carregarTodos()
      return
    }

    this.loading = true
    this.erro = ""
    this.paginaAtual = 1 // Reset para primeira página
    this.gabineteService.buscarPorNome(this.filtroNome).subscribe({
      next: (dados) => {
        this.gabinetes = dados
        this.atualizarPaginacao()
        this.loading = false
      },
      error: (err) => {
        console.error(err)
        this.erro = "Erro ao buscar gabinetes pelo nome."
        this.loading = false
      },
    })
  }

  atualizarPaginacao(): void {
    this.totalItens = this.gabinetes.length
    this.totalPaginas = Math.ceil(this.totalItens / this.itensPorPagina)

    if (this.paginaAtual > this.totalPaginas && this.totalPaginas > 0) {
      this.paginaAtual = this.totalPaginas
    }

    this.aplicarPaginacao()
  }

  aplicarPaginacao(): void {
    const inicio = (this.paginaAtual - 1) * this.itensPorPagina
    const fim = inicio + this.itensPorPagina
    this.gabinetesFiltrados = this.gabinetes.slice(inicio, fim)
  }

  irParaPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaAtual = pagina
      this.aplicarPaginacao()
    }
  }

  proximaPagina(): void {
    this.irParaPagina(this.paginaAtual + 1)
  }

  paginaAnterior(): void {
    this.irParaPagina(this.paginaAtual - 1)
  }

  verDetalhes(gabineteId: number | undefined): void {
    if (gabineteId) {
      this.router.navigate(["gabinete-detail", gabineteId])
    }
  }

  obterInicio(): number {
    return (this.paginaAtual - 1) * this.itensPorPagina + 1
  }

  obterFim(): number {
    return Math.min(this.paginaAtual * this.itensPorPagina, this.totalItens)
  }
}
