import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; 
import { PedidoService } from '../../../../services/pedido.service';
import { Pedido } from '../../../../models/pedido.model';
import { StatusPedido } from '../../../../models/enums/statusPedido';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-pedido-form',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule 
  ],
  templateUrl: './pedido-form.html',
  styleUrls: ['./pedido-form.css']
})
export class PedidoForm implements OnInit {
  pedido: Pedido = {
    id: 0,
    cliente: {
      id: 0,
      nome: '',
      email: '',
      telefone: '',
      cpf: '',
      perfil: ''
    },
    dataPedido: new Date().toISOString(),
    itens: [],
    valorTotal: 0,
    status: StatusPedido.PENDENTE,
    endereco: {
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: '',
      cep: ''
    }
  };

  statusPedidos = Object.values(StatusPedido);
  statusOptions = [
    { value: StatusPedido.PENDENTE, label: 'Pendente' },
    { value: StatusPedido.PROCESSANDO, label: 'Processando' },
    { value: StatusPedido.ENVIADO, label: 'Enviado' },
    { value: StatusPedido.ENTREGUE, label: 'Entregue' },
    { value: StatusPedido.CANCELADO, label: 'Cancelado' }
  ];

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
          next: (pedido) => {
            this.pedido = pedido;
          },
          error: () => this.erro = 'Não foi possível carregar o pedido.'
        });
    }
  }

  formatarValor(valor: number): string {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  adicionarItem(): void {
    this.pedido.itens.push({
      id: 0,
      idGabinete: 0,
      nomeGabinete: '',
      quantidade: 1,
      precoUnitario: 0,
      precoTotal: 0
    });
    this.calcularTotal();
  }

  removerItem(index: number): void {
    this.pedido.itens.splice(index, 1);
    this.calcularTotal();
  }

  calcularTotal(): void {
    let total = 0;
    this.pedido.itens.forEach(item => {
      item.precoTotal = item.precoUnitario * item.quantidade;
      total += item.precoTotal;
    });
    this.pedido.valorTotal = total;
  }

  salvar(): void {
    this.erro = undefined;
    this.salvando = true;

    const req$ = this.pedido.id && this.pedido.id > 0
      ? this.pedidoService.atualizar(this.pedido.id, this.pedido)
      : this.pedidoService.criarPedido({
          clienteId: this.pedido.cliente.id,
          endereco: this.pedido.endereco,
          itens: this.pedido.itens.map(item => ({
            idGabinete: item.idGabinete,
            quantidade: item.quantidade
          }))
        });

    req$.pipe(finalize(() => this.salvando = false)).subscribe({
      next: () => this.router.navigate(['/admin/pedidos']),
      error: (error) => {
        console.error('Erro ao salvar pedido:', error);
        this.erro = error.error?.message || 'Não foi possível salvar o pedido.';
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/admin/pedidos']);
  }
}