import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ItemPedidoService } from '../../../../services/item-pedido.service';
import { ItemPedido } from '../../../../models/item-pedido.model';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-item-pedido-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './item-pedido-form.html',
  styleUrls: ['./item-pedido-form.css']
})
export class ItemPedidoForm implements OnInit {
  itemPedido: ItemPedido = { 
    id: 0, 
    pedido: { id: 0 }, 
    gabinete: { id: 0, nomeExibicao: '', preco: 0, cor: '', marca: '' }, 
    quantidade: 0, 
    precoUnitario: 0, 
    precoTotal: 0 
  };
  carregando = false;
  salvando = false;
  erro?: string;

  constructor(
    private itemPedidoService: ItemPedidoService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : 0;

    if (id && id > 0) {
      this.carregando = true;
      this.itemPedidoService.buscarPorId(id)
        .pipe(finalize(() => this.carregando = false))
        .subscribe({
          next: (dto) => this.itemPedido = dto,
          error: () => this.erro = 'Não foi possível carregar o item de pedido.'
        });
    }
  }

  salvar(): void {
    this.erro = undefined;
    this.salvando = true;

    const req$ = this.itemPedido.id && this.itemPedido.id > 0
      ? this.itemPedidoService.atualizar(this.itemPedido.id, this.itemPedido)
      : this.itemPedidoService.criar(this.itemPedido);

    req$.pipe(finalize(() => this.salvando = false)).subscribe({
      next: () => this.router.navigate(['/item-pedido']),
      error: () => this.erro = 'Não foi possível salvar o item de pedido.'
    });
  }

  cancelar(): void {
    this.router.navigate(['/item-pedido']);
  }
}
