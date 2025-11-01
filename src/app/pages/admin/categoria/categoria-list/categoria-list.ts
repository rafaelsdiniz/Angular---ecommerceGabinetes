import { type AfterViewInit, Component, type OnInit, ViewChild } from "@angular/core"
import type { Categoria } from "../../../../models/categoria.model"
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
import { CategoriaService } from "../../../../services/categoria.service"
import { Router } from "@angular/router"
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


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
  selector: "app-categoria-list",
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
  templateUrl: "./categoria-list.html",
  styleUrls: ["./categoria-list.css"],
})
export class CategoriaListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ["id", "nome", "descricao", "acoes"]
  dataSource = new MatTableDataSource<Categoria>()
  carregando = true

  @ViewChild(MatPaginator) paginator!: MatPaginator
  @ViewChild(MatSort) sort!: MatSort

  constructor(
    private categoriaService: CategoriaService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.carregarCategorias()
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort
  }

  carregarCategorias(): void {
    this.carregando = true
    this.categoriaService.listarTodos().subscribe({
      next: (data) => {
        this.dataSource.data = data
        this.carregando = false

        this.dataSource.filterPredicate = (data: Categoria, filter: string) => {
          const dataStr = data.nome + " " + (data.descricao || "")
          return dataStr.toLowerCase().includes(filter)
        }
      },
      error: (err) => {
        console.error("Erro ao buscar categorias:", err)
        this.carregando = false
      },
    })
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value
    this.dataSource.filter = filterValue.trim().toLowerCase()
    if (this.dataSource.paginator) this.dataSource.paginator.firstPage()
  }

  novaCategoria(): void {
    this.router.navigate(["admin/categorias/form"])
  }

  editarCategoria(id: number): void {
    this.router.navigate(["admin/categorias/form", id])
  }

  excluirCategoria(id: number): void {
    if (confirm("Deseja realmente excluir esta categoria?")) {
      this.categoriaService.deletar(id).subscribe({
        next: () => {
          this.dataSource.data = this.dataSource.data.filter((c) => c.id !== id)
        },
        error: (err) => console.error("Erro ao excluir categoria:", err),
      })
    }
  }
}
