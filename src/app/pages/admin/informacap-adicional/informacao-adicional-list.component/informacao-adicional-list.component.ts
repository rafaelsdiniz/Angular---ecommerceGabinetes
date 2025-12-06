
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgIf, NgFor, SlicePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { InformacaoAdicionalService } from '../../../../services/informacao-adicional.service';
import { InformacaoAdicional } from '../../../../models/informacaoAdicional.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-informacao-list',
  standalone: true,
  templateUrl: './informacao-adicional-list.component.html',
  styleUrls: ['./informacao-adicional-list.component.css'],
  imports: [
    NgIf,
    NgFor,
    SlicePipe,
    FormsModule,
    
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
  ]
})
export class InformacaoAdicionalListComponent implements OnInit {

  displayedColumns: string[] = ['id', 'titulo', 'descricao', 'gabinete', 'acoes'];
  dataSource = new MatTableDataSource<InformacaoAdicional>([]);
  carregando = true;

  filtroGabineteId?: number;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private informacaoService: InformacaoAdicionalService,
  private router: Router
  ) {}

  ngOnInit() {
    this.carregarInformacoes();
  }

  carregarInformacoes() {
    this.carregando = true;

    this.informacaoService.listarTodos().subscribe({
      next: (dados) => {
        let lista = dados;

        if (this.filtroGabineteId) {
          lista = lista.filter(x => x.gabineteId == this.filtroGabineteId);
        }

        this.dataSource = new MatTableDataSource(lista);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.carregando = false;
      },
      error: (err) => {
        console.error(err);
        this.carregando = false;
      }
    });
  }

  aplicarFiltro(event: Event) {
    const valor = (event.target as HTMLInputElement).value;
    this.dataSource.filter = valor.trim().toLowerCase();
  }

  limparFiltroGabinete() {
    this.filtroGabineteId = undefined;
    this.carregarInformacoes();
  }

  novaInformacao() {
    this.router.navigate(['/admin/informacoes-adicionais/form']);
  }

  editarInformacao(id: number) {
    this.router.navigate([`/admin/informacoes-adicionais/form/${id}`]);
  }

  excluirInformacao(id: number) {
    // Aqui normalmente abriria um diálogo de confirmação
    // Após confirmar, chama o service e recarrega a lista
    if (confirm('Deseja realmente excluir?')) {
      this.informacaoService.deletar(id).subscribe({
        next: () => this.carregarInformacoes(),
        error: (err) => console.error(err)
      });
    }
  }}
