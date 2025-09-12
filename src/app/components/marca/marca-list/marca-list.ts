import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MarcaService } from '../../../services/marca.service';
import { Marca } from '../../../models/marca.model';
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
  selector: 'app-marca-list',
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
  templateUrl: './marca-list.html',
  styleUrls: ['./marca-list.css']
})
export class MarcaList implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['id', 'nome', 'acoes'];
  dataSource = new MatTableDataSource<Marca>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private marcaService: MarcaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.marcaService.listarTodos().subscribe({
      next: (data) => {
        this.dataSource.data = data;

        this.dataSource.filterPredicate = (data: Marca, filter: string) => {
          return data.nome.toLowerCase().includes(filter);
        };
      },
      error: (err) => console.error('Erro ao buscar marcas:', err)
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

  editarMarca(id: number) {
    this.router.navigate(['/marca/form', id]);
  }

  excluirMarca(id: number) {
    if (confirm('Deseja realmente excluir esta marca?')) {
      this.marcaService.deletar(id).subscribe({
        next: () => {
          this.dataSource.data = this.dataSource.data.filter(m => m.id !== id);
        },
        error: (err) => console.error('Erro ao excluir marca:', err)
      });
    }
  }
}
