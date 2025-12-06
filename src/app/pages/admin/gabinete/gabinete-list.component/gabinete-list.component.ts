import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core"
import { Gabinete } from "../../../../models/gabinete.model"
import { MatTableDataSource } from "@angular/material/table"
import { MatPaginator } from "@angular/material/paginator"
import { MatSort } from "@angular/material/sort"
import { CommonModule } from "@angular/common"
import { MatTableModule } from "@angular/material/table"
import { MatPaginatorModule } from "@angular/material/paginator"
import { MatSortModule } from "@angular/material/sort"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatCardModule } from "@angular/material/card"
import { MatTooltipModule } from "@angular/material/tooltip"
import { MatPaginatorIntl } from "@angular/material/paginator"
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"
import { FormsModule } from "@angular/forms"
import { MatSelectModule } from "@angular/material/select"
import { GabineteService } from "../../../../services/gabinete.service"
import { Router } from "@angular/router"

export class CustomPaginatorIntl extends MatPaginatorIntl {
  override itemsPerPageLabel = "Itens por página:"
  override nextPageLabel = "Próxima página"
  override previousPageLabel = "Página anterior"
  override firstPageLabel = "Primeira página"
  override lastPageLabel = "Última página"

  override getRangeLabel = (page: number, pageSize: number, length: number): string => {
    if (length === 0 || pageSize === 0) {
      return `0 de ${length}`
    }
    length = Math.max(length, 0)
    const startIndex = page * pageSize
    const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize
    return `${startIndex + 1} - ${endIndex} de ${length}`
  }
}

@Component({
  selector: "app-gabinete-list",
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    FormsModule,
    MatSelectModule,
  ],
  providers: [{ provide: MatPaginatorIntl, useClass: CustomPaginatorIntl }],
  templateUrl: "./gabinete-list.component.html",
  styleUrls: ["./gabinete-list.component.css"],
})
export class GabineteListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ["id", "nomeExibicao", "preco", "cor", "formato", "acoes"]
  dataSource = new MatTableDataSource<Gabinete>()
  carregando = true

  searchType: string = 'all'
  searchValue: string = ''
  precoMin: number | null = null
  precoMax: number | null = null
  mostrarFiltros = false

  @ViewChild(MatPaginator) paginator!: MatPaginator
  @ViewChild(MatSort) sort!: MatSort

  constructor(
    private gabineteService: GabineteService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.carregarGabinetes()
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort
  }

  carregarGabinetes(): void {
    this.carregando = true
    this.gabineteService.listarTodos().subscribe({
      next: (data) => {
        this.dataSource.data = data
        this.carregando = false

        this.dataSource.filterPredicate = (data: Gabinete, filter: string) => {
          const dataStr = data.nomeExibicao + " " + (data.cor || "") + " " + (data.formato || "")
          return dataStr.toLowerCase().includes(filter)
        }
      },
      error: (err) => {
        console.error("Erro ao buscar gabinetes:", err)
        this.carregando = false
      },
    })
  }

  buscar(): void {
    this.carregando = true
    
    if (this.searchType === 'all' && !this.searchValue) {
      this.carregarGabinetes()
      return
    }

    let observable

    switch (this.searchType) {
      case 'nome':
        observable = this.gabineteService.buscarPorNome(this.searchValue)
        break
      case 'marca':
        observable = this.gabineteService.buscarPorMarca(this.searchValue)
        break
      case 'cor':
        observable = this.gabineteService.buscarPorCor(this.searchValue)
        break
      case 'formato':
        observable = this.gabineteService.buscarPorFormato(this.searchValue)
        break
      case 'preco':
        if (this.precoMin !== null && this.precoMax !== null) {
          observable = this.gabineteService.buscarPorFaixaPreco(this.precoMin, this.precoMax)
        } else {
          this.carregando = false
          return
        }
        break
      default:
        observable = this.gabineteService.listarTodos()
    }

    observable.subscribe({
      next: (data) => {
        this.dataSource.data = data
        this.carregando = false
      },
      error: (err) => {
        console.error('Erro ao buscar gabinetes:', err)
        this.carregando = false
      }
    })
  }

  toggleFiltros(): void {
    this.mostrarFiltros = !this.mostrarFiltros
  }

  limparBusca(): void {
    this.searchType = 'all'
    this.searchValue = ''
    this.precoMin = null
    this.precoMax = null
    this.carregarGabinetes()
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value
    this.searchValue = filterValue
    if (this.searchType === 'all') {
      this.dataSource.filter = filterValue.trim().toLowerCase()
      if (this.dataSource.paginator) this.dataSource.paginator.firstPage()
    }
  }

  novoGabinete(): void {
    this.router.navigate(["admin/gabinetes/form"])
  }

  editarGabinete(id: number): void {
    this.router.navigate(["admin/gabinetes/form", id])
  }

  excluirGabinete(id: number): void {
    if (confirm("Deseja realmente excluir este gabinete?")) {
      this.gabineteService.deletar(id).subscribe({
        next: () => {
          this.dataSource.data = this.dataSource.data.filter((g) => g.id !== id)
        },
        error: (err) => console.error("Erro ao excluir gabinete:", err),
      })
    }
  }

  formatarPreco(preco: number): string {
    return preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
  }
}
