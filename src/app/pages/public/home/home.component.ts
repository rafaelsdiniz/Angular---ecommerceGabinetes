import { Component, OnInit, OnDestroy } from "@angular/core"
import { Router } from "@angular/router"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { GabineteService } from "../../../services/gabinete.service"
import { Gabinete } from "../../../models/gabinete.model"
import { CarrinhoService, ItemCarrinho } from "../../../services/carrinho.service"

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class HomeComponent implements OnInit, OnDestroy {
  benefitCards = [
    {
      id: 1,
      title: "Performance Máxima",
      subtitle: "Dissipação Térmica",
      description:
        "Gabinetes com fluxo de ar otimizado garantem temperatura ideal para seus componentes, mantendo a performance em pico durante longas sessões.",
      color: "#ff6b35",
      icon: "⚡",
    },
    {
      id: 2,
      title: "Qualidade Premium",
      subtitle: "Materiais Superiores",
      description:
        "Construção robusta em aço e alumínio com acabamento impecável. Cada detalhe pensado para durabilidade e estética profissional.",
      color: "#f7931e",
      icon: "✓",
    },
    {
      id: 3,
      title: "Design Inovador",
      subtitle: "RGB & Estilo",
      description:
        "Gabinetes modernos com suporte a RGB, vidro temperado e designs exclusivos que transformam seu setup em obra de arte.",
      color: "#ff8c42",
      icon: "✨",
    },
  ]

  destaquesGabinetes: Gabinete[] = []
  todosGabinetes: Gabinete[] = []
  loading = true
  erro = ""
  carouselIndex = 0
  autoPlayInterval: any

  categorias = [
    { nome: "Gabinetes", icone: "🖥️" },
    { nome: "Placas de Vídeo", icone: "🎮" },
    { nome: "Processadores", icone: "⚡" },
    { nome: "Memórias RAM", icone: "💾" },
    { nome: "Armazenamento", icone: "💿" },
    { nome: "Periféricos", icone: "⌨️" },
  ]
  categoriaSelecionada = "Todos"

  emailNewsletter = ""

  marcas = [
    { nome: "Corsair", logo: "/corsair-logo.jpg" },
    { nome: "NZXT", logo: "/nzxt-logo.jpg" },
    { nome: "Cooler Master", logo: "/cooler-master-logo.jpg" },
    { nome: "Thermaltake", logo: "/thermaltake-logo.jpg" },
    { nome: "Lian Li", logo: "/lian-li-logo.jpg" },
  ]

  estatisticas = [
    { valor: "50k+", label: "Clientes Satisfeitos" },
    { valor: "500+", label: "Produtos" },
    { valor: "98%", label: "Satisfação" },
  ]

  constructor(
    private router: Router,
    private gabineteService: GabineteService,
    private carrinhoService: CarrinhoService,
  ) {}

  ngOnInit(): void {
    this.carregarGabinetes()
  }

  ngOnDestroy(): void {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval)
    }
  }

  carregarGabinetes(): void {
    this.loading = true
    this.erro = ""

    this.gabineteService.listarTodos().subscribe({
      next: (gabinetes) => {
        this.todosGabinetes = gabinetes
        this.destaquesGabinetes = gabinetes.slice(0, 4)
        this.iniciarAutoPlay()
        this.loading = false
      },
      error: (error) => {
        console.error("[v0] Error loading gabinetes:", error)
        this.erro = "Erro ao carregar produtos. Tente novamente mais tarde."
        this.loading = false
      },
    })
  }

  iniciarAutoPlay(): void {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval)
    }
    this.autoPlayInterval = setInterval(() => {
      this.proximoBeneficio()
    }, 5000)
  }

  proximoBeneficio(): void {
    this.carouselIndex = (this.carouselIndex + 1) % this.benefitCards.length
    this.resetarAutoPlay()
  }

  beneficioAnterior(): void {
    this.carouselIndex = (this.carouselIndex - 1 + this.benefitCards.length) % this.benefitCards.length
    this.resetarAutoPlay()
  }

  irParaBeneficio(index: number): void {
    this.carouselIndex = index
    this.resetarAutoPlay()
  }

  resetarAutoPlay(): void {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval)
    }
    this.iniciarAutoPlay()
  }

  verDetalhes(produtoId: number | undefined): void {
    if (produtoId) {
      this.router.navigate(["/produto", produtoId])
    }
  }

  adicionarAoCarrinho(produto: Gabinete): void {
    if (!produto.id) {
      alert("Erro: Produto inválido.")
      return
    }

    const itemCarrinho: ItemCarrinho = {
      id: produto.id,
      produto: produto,
      quantidade: 1,
    }

    this.carrinhoService.adicionarItem(itemCarrinho)

    // Feedback visual
    alert(`${produto.nomeExibicao} adicionado ao carrinho!`)
  }

  selecionarCategoria(categoria: string): void {
    this.categoriaSelecionada = categoria
    console.log("[v0] Category selected:", categoria)
    this.router.navigate(["/produtos"], { queryParams: { categoria } })
  }

  inscreverNewsletter(): void {
    if (this.emailNewsletter && this.emailNewsletter.includes("@")) {
      console.log("[v0] Newsletter subscription:", this.emailNewsletter)
      alert("Obrigado por se inscrever! Você receberá nossas novidades em breve.")
      this.emailNewsletter = ""
    } else {
      alert("Por favor, insira um email válido.")
    }
  }

  irParaProdutos(): void {
    this.router.navigate(["/produtos"])
  }

  scrollToDestaques(): void {
    const element = document.querySelector(".destaques-modern")
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  filtrarPorCategoria(categoria: string): void {
    console.log("[v0] Filtering by category:", categoria)
    this.router.navigate(["/produtos"], { queryParams: { categoria } })
  }
}