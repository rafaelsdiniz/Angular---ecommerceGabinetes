import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ItemPedidoService } from '../../../../services/item-pedido.service';
import { ItemPedido } from '../../../../models/item-pedido.model';

export class MatPaginatorIntlPt extends MatPaginatorIntl {
  override itemsPerPageLabel = 'Itens por página';
  override nextPageLabel = 'Próxima página';
  override previousPageLabel = 'Página anterior';
  override firstPageLabel = 'Primeira página';
  override lastPageLabel = 'Última página';
}

@Component({
  selector: 'app-item-pedido-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatButtonModule,
    RouterModule
  ],
  templateUrl: './item-pedido-list.html',
  styleUrls: ['./item-pedido-list.css'],
  providers: [{ provide: MatPaginatorIntl, useClass: MatPaginatorIntlPt }]
})
export class ItemPedidoList implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'pedido', 'gabinete', 'quantidade', 'precoUnitario', 'precoTotal', 'acoes'];
  dataSource = new MatTableDataSource<ItemPedido>();
  carregando = false;
  erro?: string;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private itemPedidoService: ItemPedidoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregando = true;
    this.itemPedidoService.listarTodos().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.carregando = false;
        this.dataSource.filterPredicate = (data: ItemPedido, filter: string) => {
          const dataStr = `${data.pedido.id} ${data.gabinete.nomeExibicao} ${data.quantidade} ${data.precoUnitario} ${data.precoTotal}`;
          return dataStr.toLowerCase().includes(filter);
        };
      },
      error: (err) => {
        this.erro = 'Erro ao carregar itens de pedido';
        console.error(err);
        this.carregando = false;
      }
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

  novo(): void {
    this.router.navigate(['/item-pedido/form']);
  }

  editar(id: number): void {
    this.router.navigate(['/item-pedido/form', id]);
  }

  excluir(id: number): void {
    if (confirm('Deseja realmente excluir este item de pedido?')) {
      this.itemPedidoService.deletar(id).subscribe({
        next: () => this.dataSource.data = this.dataSource.data.filter(e => e.id !== id),
        error: (err) => console.error(err)
      });
    }
  }
}
