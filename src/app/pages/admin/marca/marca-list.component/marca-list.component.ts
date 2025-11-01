import { type AfterViewInit, Component, type OnInit, ViewChild } from "@angular/core";
import type { Marca } from "../../../../models/marca.model";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { MatPaginator, MatPaginatorModule, MatPaginatorIntl } from "@angular/material/paginator";
import { MatSort, MatSortModule } from "@angular/material/sort";
import { CommonModule } from "@angular/common";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatCardModule } from "@angular/material/card";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MarcaService } from "../../../../services/marca.service";
import { Router } from "@angular/router";

export class CustomPaginatorIntl extends MatPaginatorIntl {
  override itemsPerPageLabel = "Itens por página:";
  override nextPageLabel = "Próxima página";
  override previousPageLabel = "Página anterior";
  override firstPageLabel = "Primeira página";
  override lastPageLabel = "Última página";

  override getRangeLabel = (page: number, pageSize: number, length: number): string => {
    if (length === 0 || pageSize === 0) {
      return `0 de ${length}`;
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
    return `${startIndex + 1} - ${endIndex} de ${length}`;
  };
}

@Component({
  selector: "app-marca-list",
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
  templateUrl: "./marca-list.component.html",
  styleUrls: ["./marca-list.component.css"],
})
export class MarcaListComponent implements OnInit {
  displayedColumns: string[] = ["id", "nome", "descricao", "acoes"];
  dataSource = new MatTableDataSource<Marca>();
  carregando = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private marcaService: MarcaService, private router: Router) {}

  ngOnInit(): void {
    this.carregarMarcas();
  }

  carregarMarcas(): void {
    this.carregando = true;
    this.marcaService.listarTodos().subscribe({
      next: (data) => {
        this.dataSource.data = data;

        // Conecta paginator e sort **após os dados carregarem**
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        this.dataSource.filterPredicate = (marca: Marca, filter: string) => {
          const dataStr = marca.nome + " " + (marca.descricao || "");
          return dataStr.toLowerCase().includes(filter);
        };

        this.carregando = false;
      },
      error: (err) => {
        console.error("Erro ao buscar marcas:", err);
        this.carregando = false;
      },
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) this.dataSource.paginator.firstPage();
  }

  novaMarca(): void {
    this.router.navigate(["/marcas/form"]);
  }

  editarMarca(id: number): void {
    this.router.navigate(["/marcas/form", id]);
  }

  excluirMarca(id: number): void {
    if (confirm("Deseja realmente excluir esta marca?")) {
      this.marcaService.deletar(id).subscribe({
        next: () => {
          this.dataSource.data = this.dataSource.data.filter((m) => m.id !== id);
        },
        error: (err) => console.error("Erro ao excluir marca:", err),
      });
    }
  }
}
