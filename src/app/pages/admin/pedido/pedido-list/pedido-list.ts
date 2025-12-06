import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { MatCardModule } from "@angular/material/card"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
import { MatChipsModule } from "@angular/material/chips"
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"
import { MatExpansionModule } from "@angular/material/expansion"
import { MatDividerModule } from "@angular/material/divider"
import { MatTooltipModule } from "@angular/material/tooltip"
import { Router } from "@angular/router"
import { Pedido } from "../../../../models/pedido.model"
import { PedidoService } from "../../../../services/pedido.service"
import { StatusPedido } from "../../../../models/enums/statusPedido"

@Component({
  selector: "app-pedido-list",
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    MatDividerModule,
    MatTooltipModule,
  ],
  templateUrl: "./pedido-list.html",
  styleUrls: ["./pedido-list.css"],
})
export class PedidoListComponent implements OnInit {
  pedidos: Pedido[] = []
  pedidosFiltrados: Pedido[] = []
  carregando = true
  pedidoExpandido: number | null = null

  constructor(
    private pedidoService: PedidoService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.carregarPedidos()
  }

  carregarPedidos(): void {
    this.carregando = true
    this.pedidoService.listarTodos().subscribe({
      next: (data) => {
        this.pedidos = data
        this.pedidosFiltrados = data
        this.carregando = false
      },
      error: (err) => {
        console.error("Erro ao buscar pedidos:", err)
        this.carregando = false
      },
    })
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase()
    this.pedidosFiltrados = this.pedidos.filter((pedido) => {
      const clienteNome = pedido.cliente?.nome?.toLowerCase() || ""
      const pedidoId = pedido.id?.toString() || ""
      const status = this.getStatusLabel(pedido.status).toLowerCase()
      return clienteNome.includes(filterValue) || pedidoId.includes(filterValue) || status.includes(filterValue)
    })
  }

  togglePedido(pedidoId: number): void {
    this.pedidoExpandido = this.pedidoExpandido === pedidoId ? null : pedidoId
  }

  isPedidoExpandido(pedidoId: number): boolean {
    return this.pedidoExpandido === pedidoId
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      [StatusPedido.PENDENTE]: "Pendente",
      [StatusPedido.PROCESSANDO]: "Processando",
      [StatusPedido.ENVIADO]: "Enviado",
      [StatusPedido.ENTREGUE]: "Entregue",
      [StatusPedido.CANCELADO]: "Cancelado",
    }
    return labels[status] || status
  }

  getStatusClass(status: string): string {
    const classes: Record<string, string> = {
      [StatusPedido.PENDENTE]: "status-pendente",
      [StatusPedido.PROCESSANDO]: "status-processando",
      [StatusPedido.ENVIADO]: "status-enviado",
      [StatusPedido.ENTREGUE]: "status-entregue",
      [StatusPedido.CANCELADO]: "status-cancelado",
    }
    return classes[status] || ""
  }

  formatarData(data: Date | string): string {
    if (!data) return 'Data não disponível';
    
    try {
      const date = typeof data === 'string' ? new Date(data) : data;
      return date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      console.error('Erro ao formatar data:', data, error);
      return 'Data inválida';
    }
  }

  formatarValor(valor: number): string {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    })
  }

  atualizarStatus(pedidoId: number, novoStatus: string): void {

    const statusEnum = novoStatus as StatusPedido;
    this.pedidoService.atualizarStatus(pedidoId, statusEnum).subscribe({
      next: () => {
        this.carregarPedidos()
      },
      error: (err) => console.error("Erro ao atualizar status:", err),
    })
  }

  cancelarPedido(pedidoId: number): void {
    if (confirm("Deseja realmente cancelar este pedido?")) {
      this.pedidoService.cancelarPedido(pedidoId).subscribe({
        next: () => {
          this.carregarPedidos()
        },
        error: (err) => console.error("Erro ao cancelar pedido:", err),
      })
    }
  }

  finalizarPedido(pedidoId: number): void {
    this.pedidoService.finalizarPedido(pedidoId).subscribe({
      next: () => {
        this.carregarPedidos()
      },
      error: (err) => console.error("Erro ao finalizar pedido:", err),
    })
  }
}