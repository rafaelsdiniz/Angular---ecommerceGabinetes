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
  todosGabinetesFiltrados: Gabinete[] = [] 
  
  filtroNome = ""
  filtrosMarcas: string[] = []
  filtroFaixaPreco: string = ""
  filtrosCores: string[] = []
  
  marcasDisponiveis: string[] = []
  coresDisponiveis: string[] = []
  faixasPreco = [
    { id: '0-500', label: 'Até R$ 500', min: 0, max: 500 },
    { id: '500-1000', label: 'R$ 500 - R$ 1.000', min: 500, max: 1000 },
    { id: '1000-2000', label: 'R$ 1.000 - R$ 2.000', min: 1000, max: 2000 },
    { id: '2000+', label: 'Acima de R$ 2.000', min: 2000, max: Infinity }
  ]

  loading = true
  erro = ""
  filtersActive = false

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
        this.carregarOpcoesFiltros()
        this.aplicarFiltros()
        this.loading = false
      },
      error: (err) => {
        console.error(err)
        this.erro = "Erro ao carregar gabinetes. Tente novamente."
        this.loading = false
      },
    })
  }

  carregarOpcoesFiltros(): void {
    this.marcasDisponiveis = [...new Set(this.gabinetes.map(g => g.marca))].sort()
    
    this.coresDisponiveis = [...new Set(this.gabinetes
      .map(g => g.cor)
      .filter(cor => cor != null && cor.trim() !== '')
    )].sort()
  }

  aplicarFiltros(): void {
    let resultados = [...this.gabinetes]

    if (this.filtroNome.trim()) {
      const termo = this.filtroNome.toLowerCase().trim()
      resultados = resultados.filter(g => 
        g.nomeExibicao.toLowerCase().includes(termo) ||
        g.marca.toLowerCase().includes(termo)
      )
    }

    if (this.filtrosMarcas.length > 0) {
      resultados = resultados.filter(g => 
        this.filtrosMarcas.includes(g.marca)
      )
    }

    if (this.filtroFaixaPreco) {
      const faixa = this.faixasPreco.find(f => f.id === this.filtroFaixaPreco)
      if (faixa) {
        resultados = resultados.filter(g => {
          if (faixa.max === Infinity) {
            return g.preco >= faixa.min
          }
          return g.preco >= faixa.min && g.preco <= faixa.max
        })
      }
    }

    if (this.filtrosCores.length > 0) {
      resultados = resultados.filter(g => {
        const corGabinete = g.cor || 'Não especificada'
        return this.filtrosCores.includes(corGabinete)
      })
    }

    this.todosGabinetesFiltrados = resultados
    this.paginaAtual = 1 
    this.atualizarPaginacao()
  }

  toggleMarca(marca: string, event: any): void {
    if (event.target.checked) {
      this.filtrosMarcas.push(marca)
    } else {
      this.filtrosMarcas = this.filtrosMarcas.filter(m => m !== marca)
    }
    this.aplicarFiltros()
  }

  selecionarFaixaPreco(faixaId: string): void {
    this.filtroFaixaPreco = this.filtroFaixaPreco === faixaId ? '' : faixaId
    this.aplicarFiltros()
  }

  toggleCor(cor: string, event: any): void {
    const corTratada = cor || 'Não especificada'
    if (event.target.checked) {
      this.filtrosCores.push(corTratada)
    } else {
      this.filtrosCores = this.filtrosCores.filter(c => c !== corTratada)
    }
    this.aplicarFiltros()
  }

  removerFiltroNome(): void {
    this.filtroNome = ''
    this.aplicarFiltros()
  }

  removerMarca(marca: string): void {
    this.filtrosMarcas = this.filtrosMarcas.filter(m => m !== marca)
    this.aplicarFiltros()
  }

  removerFaixaPreco(): void {
    this.filtroFaixaPreco = ''
    this.aplicarFiltros()
  }

  removerCor(cor: string): void {
    this.filtrosCores = this.filtrosCores.filter(c => c !== cor)
    this.aplicarFiltros()
  }

  limparFiltros(): void {
    this.filtroNome = ''
    this.filtrosMarcas = []
    this.filtroFaixaPreco = ''
    this.filtrosCores = []
    this.aplicarFiltros()
  }

  contarPorMarca(marca: string): number {
    return this.gabinetes.filter(g => g.marca === marca).length
  }

  contarPorFaixaPreco(faixaId: string): number {
    const faixa = this.faixasPreco.find(f => f.id === faixaId)
    if (!faixa) return 0
    
    return this.gabinetes.filter(g => {
      if (faixa.max === Infinity) {
        return g.preco >= faixa.min
      }
      return g.preco >= faixa.min && g.preco <= faixa.max
    }).length
  }

  contarPorCor(cor: string): number {
    return this.gabinetes.filter(g => (g.cor || 'Não especificada') === cor).length
  }

  obterLabelFaixaPreco(faixaId: string): string {
    const faixa = this.faixasPreco.find(f => f.id === faixaId)
    return faixa ? faixa.label : ''
  }

  temFiltrosAtivos(): boolean {
    return !!this.filtroNome || 
           this.filtrosMarcas.length > 0 || 
           !!this.filtroFaixaPreco || 
           this.filtrosCores.length > 0
  }

  toggleFilters(): void {
    this.filtersActive = !this.filtersActive
  }

  formatarImagemBase64(imagemBase64: string | undefined): string {
    if (!imagemBase64) return '';
    
    if (imagemBase64.startsWith('data:')) {
      return imagemBase64;
    }
    
    return `data:image/jpeg;base64,${imagemBase64}`;
  }

  handleImageError(event: any): void {
    console.error('Erro ao carregar imagem:', event);
    event.target.style.display = 'none';
  }

  atualizarPaginacao(): void {
    this.totalItens = this.todosGabinetesFiltrados.length
    this.totalPaginas = Math.ceil(this.totalItens / this.itensPorPagina)

    if (this.paginaAtual > this.totalPaginas && this.totalPaginas > 0) {
      this.paginaAtual = this.totalPaginas
    }

    this.aplicarPaginacao()
  }

  aplicarPaginacao(): void {
    const inicio = (this.paginaAtual - 1) * this.itensPorPagina
    const fim = inicio + this.itensPorPagina
    this.gabinetesFiltrados = this.todosGabinetesFiltrados.slice(inicio, fim)
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