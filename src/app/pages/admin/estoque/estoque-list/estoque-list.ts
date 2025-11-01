import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core"
import { Estoque } from "../../../../models/estoque.model"
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
import { EstoqueService } from "../../../../services/estoque.service"
import { Router } from "@angular/router"
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"

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
  selector: "app-estoque-list",
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
  ],
  providers: [{ provide: MatPaginatorIntl, useClass: CustomPaginatorIntl }],
  templateUrl: "./estoque-list.html",
  styleUrls: ["./estoque-list.css"],
})
export class EstoqueListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ["id", "gabinete", "quantidadeDisponivel", "acoes"]
  dataSource = new MatTableDataSource<Estoque>()
  carregando = true

  @ViewChild(MatPaginator) paginator!: MatPaginator
  @ViewChild(MatSort) sort!: MatSort

  constructor(
    private estoqueService: EstoqueService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.carregarEstoque()
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort
  }

  carregarEstoque(): void {
    this.carregando = true
    this.estoqueService.listarTodos().subscribe({
      next: (data) => {
        this.dataSource.data = data
        this.carregando = false

        this.dataSource.filterPredicate = (data: Estoque, filter: string) => {
          const dataStr = (data.gabinete?.nomeExibicao || "") + " " + (data.quantidadeDisponivel || "")
          return dataStr.toLowerCase().includes(filter)
        }
      },
      error: (err) => {
        console.error("Erro ao buscar estoque:", err)
        this.carregando = false
      },
    })
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value
    this.dataSource.filter = filterValue.trim().toLowerCase()
    if (this.dataSource.paginator) this.dataSource.paginator.firstPage()
  }

  novoEstoque(): void {
    this.router.navigate(["admin/estoque/form"])
  }

  editarEstoque(id: number): void {
    this.router.navigate(["admin/estoque/form", id])
  }

  excluirEstoque(id: number): void {
    if (confirm("Deseja realmente excluir este estoque?")) {
      this.estoqueService.deletar(id).subscribe({
        next: () => {
          this.dataSource.data = this.dataSource.data.filter((e) => e.id !== id)
        },
        error: (err) => console.error("Erro ao excluir estoque:", err),
      })
    }
  }
}
