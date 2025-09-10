import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';

import { GabineteService } from '../../../services/gabinete.service';
import { Gabinete } from '../../../models/gabinete.model';

@Component({
  selector: 'app-gabinete-list',
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
  templateUrl: './gabinete-list.html',
  styleUrls: ['./gabinete-list.css']
})
export class GabineteList implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'nomeExibicao', 'cor', 'preco', 'acoes'];
  dataSource = new MatTableDataSource<Gabinete>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private gabineteService: GabineteService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.gabineteService.listarTodos().subscribe({
      next: (data) => {
        this.dataSource.data = data;

        this.dataSource.filterPredicate = (gab: Gabinete, filter: string) => {
          const dataStr = gab.nomeExibicao + ' ' + (gab.cor || '') + ' ' + gab.preco;
          return dataStr.toLowerCase().includes(filter);
        };
      },
      error: (err) => console.error('Erro ao buscar gabinetes:', err)
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

  editarGabinete(id: number) {
    this.router.navigate(['/gabinetes/form', id]);
  }

  excluirGabinete(id: number) {
    if (confirm('Deseja realmente excluir este gabinete?')) {
      this.gabineteService.deletar(id).subscribe({
        next: () => {
          this.dataSource.data = this.dataSource.data.filter(g => g.id !== id);
        },
        error: (err) => console.error('Erro ao excluir gabinete:', err)
      });
    }
  }
}
