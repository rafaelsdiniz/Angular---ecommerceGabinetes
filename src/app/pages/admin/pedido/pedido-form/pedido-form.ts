import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PedidoService } from '../../../../services/pedido.service';
import { Pedido } from '../../../../models/pedido.model';
import { StatusPedido } from '../../../../models/enums/statusPedido';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-pedido-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './pedido-form.html',
  styleUrls: ['./pedido-form.css']
})
export class PedidoForm implements OnInit {
  pedido: Pedido = {
    id: 0,
    cliente: {} as any,
    dataPedido: new Date(),
    itens: [],
    valorTotal: 0,
    statusPedido: StatusPedido.ENTREGUE,
    endereco: {} as any
  };

  statusPedidos = Object.values(StatusPedido);

  carregando = false;
  salvando = false;
  erro?: string;

  constructor(
    private pedidoService: PedidoService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : 0;

    if (id && id > 0) {
      this.carregando = true;
      this.pedidoService.buscarPorId(id)
        .pipe(finalize(() => this.carregando = false))
        .subscribe({
          next: (dto) => this.pedido = dto,
          error: () => this.erro = 'Não foi possível carregar o pedido.'
        });
    }
  }

  salvar(): void {
    this.erro = undefined;
    this.salvando = true;

    const req$ = this.pedido.id && this.pedido.id > 0
      ? this.pedidoService.atualizar(this.pedido.id, this.pedido)
      : this.pedidoService.salvar(this.pedido);

    req$.pipe(finalize(() => this.salvando = false)).subscribe({
      next: () => this.router.navigate(['/pedido']),
      error: () => this.erro = 'Não foi possível salvar o pedido.'
    });
  }

  cancelar(): void {
    this.router.navigate(['/pedido']);
  }
}
