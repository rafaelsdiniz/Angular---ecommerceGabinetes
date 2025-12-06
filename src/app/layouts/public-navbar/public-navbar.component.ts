import { Component, OnInit, OnDestroy, HostListener } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule, Router } from "@angular/router"
import { FormsModule } from "@angular/forms"
import { Subscription, debounceTime, distinctUntilChanged, Subject } from "rxjs"
import { AuthService } from "../../services/auth.service"
import { CarrinhoService } from "../../services/carrinho.service"
import { GabineteService } from "../../services/gabinete.service"
import { Gabinete } from "../../models/gabinete.model"

@Component({
  selector: "app-public-navbar",
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: "./public-navbar.component.html",
  styleUrls: ["./public-navbar.component.css"],
})
export class PublicNavbarComponent implements OnInit, OnDestroy {
  menuAberto = false
  isLogado = false
  clienteNome = ""
  isAdmin = false
  searchQuery = ""
  searchFocused = false
  totalItensCarrinho = 0
  
  searchResults: Gabinete[] = []
  showSuggestions = false
  isLoading = false
  private searchSubject = new Subject<string>()
  private subscriptions: Subscription[] = []

  constructor(
    private authService: AuthService,
    private router: Router,
    private carrinhoService: CarrinhoService,
    private gabineteService: GabineteService,
  ) {}

  ngOnInit(): void {
    const authSub = this.authService.isLogado().subscribe((logado) => {
      this.isLogado = logado
    })
    this.subscriptions.push(authSub)

    const clienteSub = this.authService.getCliente().subscribe((cliente) => {
      if (cliente) {
        this.clienteNome = cliente.nome || cliente.email
        this.isAdmin = cliente.perfil === "ADMIN"
      }
    })
    this.subscriptions.push(clienteSub)

    const carrinhoSub = this.carrinhoService.totalItens$.subscribe((total) => {
      this.totalItensCarrinho = total
    })
    this.subscriptions.push(carrinhoSub)

    const searchSub = this.searchSubject
      .pipe(
        debounceTime(300), 
        distinctUntilChanged() 
      )
      .subscribe(query => {
        this.buscarProdutos(query)
      })
    this.subscriptions.push(searchSub)
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe())
  }

  onSearchInput(): void {
    if (this.searchQuery.trim().length >= 2) {
      this.searchSubject.next(this.searchQuery.trim())
    } else {
      this.searchResults = []
      this.showSuggestions = false
    }
  }

  buscarProdutos(query: string): void {
    if (!query) {
      this.searchResults = []
      this.showSuggestions = false
      return
    }

    this.isLoading = true
    this.gabineteService.listarTodos().subscribe({
      next: (gabinetes) => {
        const termoBusca = query.toLowerCase()
        
        const resultados = gabinetes.filter(gabinete => 
          gabinete.nomeExibicao.toLowerCase().includes(termoBusca) ||
          gabinete.marca.toLowerCase().includes(termoBusca)
        ).slice(0, 5) 
        
        this.searchResults = resultados
        this.showSuggestions = resultados.length > 0
        this.isLoading = false
      },
      error: (error) => {
        console.error('Erro na busca:', error)
        this.isLoading = false
        this.searchResults = []
        this.showSuggestions = false
      }
    })
  }

  realizarBusca(): void {
    if (this.searchQuery.trim()) {
      this.router.navigate(["/produtos"], {
        queryParams: { search: this.searchQuery.trim() },
      })
      this.fecharSugestoes()
      this.fecharMenu()
      this.searchQuery = ""
    }
  }

  selecionarProduto(gabinete: Gabinete): void {
    if (gabinete.id) {
      this.router.navigate(["/gabinete-detail", gabinete.id])
      this.fecharSugestoes()
      this.searchQuery = ""
    }
  }

  onSearchFocus(): void {
    this.searchFocused = true
    if (this.searchQuery.trim().length >= 2 && this.searchResults.length > 0) {
      this.showSuggestions = true
    }
  }

  onSearchBlur(): void {
    setTimeout(() => {
      this.searchFocused = false
      this.showSuggestions = false
    }, 200)
  }

  fecharSugestoes(): void {
    this.showSuggestions = false
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    this.fecharSugestoes()
  }

  limparBusca(): void {
    this.searchQuery = ""
    this.searchResults = []
    this.showSuggestions = false
  }

  abrirFecharMenu(): void {
    this.menuAberto = !this.menuAberto
    if (this.menuAberto) {
      this.fecharSugestoes()
    }
  }

  fecharMenu(): void {
    this.menuAberto = false
  }

  logout(): void {
    this.authService.logout()
    this.fecharMenu()
    this.router.navigate(["/"])
  }

  irParaAdmin(): void {
    this.router.navigate(["/admin/categorias"])
    this.fecharMenu()
  }
}