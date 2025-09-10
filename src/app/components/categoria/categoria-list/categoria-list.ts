import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CategoriaService } from '../../../services/categoria.service';
import { Categoria } from '../../../models/categoria.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-categoria-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './categoria-list.html',
  styleUrls: ['./categoria-list.css']
})
export class CategoriaListComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['id', 'nome', 'descricao', 'acoes'];
  dataSource = new MatTableDataSource<Categoria>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private categoriaService: CategoriaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.categoriaService.listarTodos().subscribe({
      next: (data) => {
        this.dataSource.data = data;

        this.dataSource.filterPredicate = (data: Categoria, filter: string) => {
          const dataStr = data.nome + ' ' + (data.descricao || '');
          return dataStr.toLowerCase().includes(filter);
        };
      },
      error: (err) => console.error('Erro ao buscar categorias:', err)
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) this.dataSource.paginator.firstPage();
  }

  editarCategoria(id: number) {
    this.router.navigate(['/categorias/form', id]);
  }

  excluirCategoria(id: number) {
    if (confirm('Deseja realmente excluir esta categoria?')) {
      this.categoriaService.deletar(id).subscribe({
        next: () => {
          this.dataSource.data = this.dataSource.data.filter(c => c.id !== id);
        },
        error: (err) => console.error('Erro ao excluir categoria:', err)
      });
    }
  }
}
