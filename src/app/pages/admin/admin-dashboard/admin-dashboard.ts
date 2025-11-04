import { Component, OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { MatCardModule } from "@angular/material/card"
import { MatTableModule } from "@angular/material/table"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"
import { MatChipsModule } from "@angular/material/chips"
import { MatDividerModule } from "@angular/material/divider"
import { GabineteService } from "../../../services/gabinete.service"
import { PedidoService } from "../../../services/pedido.service"
import { ClienteService } from "../../../services/cliente.service"
import { finalize } from "rxjs/operators"
import { forkJoin } from "rxjs"

interface StatCard {
  titulo: string
  valor: number | string
  icone: string
  cor: string
}

interface PedidoRecente {
  id: number
  clienteNome: string
  total: number
  status: string
  data: Date
}

@Component({
  selector: "app-admin-dashboard",
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatDividerModule,
  ],
  templateUrl: "./admin-dashboard.html",
  styleUrls: ["./admin-dashboard.css"],
})
export class AdminDashboardComponent implements OnInit {
  carregando = true
  erro?: string

  // Estatísticas
  stats: StatCard[] = []
  totalGabinetes = 0
  totalPedidos = 0
  totalClientes = 0
  vendiasMes = "R$ 0,00"

  // Dados das tabelas
  pedidosRecentes: any[] = []
  gabinetesDestaque: any[] = []
  clientesAtivos: any[] = []

  displayedColumnsPedidos = ["id", "cliente", "total", "status", "data", "acao"]
  displayedColumnsGabinetes = ["id", "nome", "marca", "preco", "estoque"]
  displayedColumnsClientes = ["id", "nome", "email", "telefone", "acao"]

  constructor(
    private gabineteService: GabineteService,
    private pedidoService: PedidoService,
    private clienteService: ClienteService,
  ) {}

  ngOnInit(): void {
    this.carregarDados()
  }

  carregarDados(): void {
    this.carregando = true
    this.erro = undefined

    forkJoin({
      gabinetes: this.gabineteService.listarTodos(),
      pedidos: this.pedidoService.listarTodos(),
      clientes: this.clienteService.listarTodos(),
    })
      .pipe(finalize(() => (this.carregando = false)))
      .subscribe({
        next: (dados) => {
          this.processarDados(dados)
        },
        error: () => {
          this.erro = "Não foi possível carregar os dados do dashboard."
        },
      })
  }

  private processarDados(dados: any): void {
    const gabinetes = dados.gabinetes || []
    this.totalGabinetes = gabinetes.length
    this.gabinetesDestaque = gabinetes.slice(0, 5)

    const pedidos = dados.pedidos || []
    this.totalPedidos = pedidos.length
    this.pedidosRecentes = pedidos.slice(0, 8)

    const vendiasTotais = pedidos.reduce((acc: number, pedido: any) => acc + (pedido.total || 0), 0)
    this.vendiasMes = this.formatarMoeda(vendiasTotais)

    const clientes = dados.clientes || []
    this.totalClientes = clientes.length
    this.clientesAtivos = clientes.slice(0, 5)

    this.stats = [
      {
        titulo: "Total de Gabinetes",
        valor: this.totalGabinetes,
        icone: "inventory_2",
        cor: "#ff6500",
      },
      {
        titulo: "Total de Pedidos",
        valor: this.totalPedidos,
        icone: "shopping_cart",
        cor: "#4CAF50",
      },
      {
        titulo: "Total de Clientes",
        valor: this.totalClientes,
        icone: "people",
        cor: "#2196F3",
      },
      {
        titulo: "Vendas este Mês",
        valor: this.vendiasMes,
        icone: "trending_up",
        cor: "#9C27B0",
      },
    ]
  }

  formatarMoeda(valor: number): string {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor)
  }

  obterCorStatus(status: string): string {
    const statusMap: { [key: string]: string } = {
      PENDENTE: "#FFA500",
      CONFIRMADO: "#4CAF50",
      ENVIADO: "#2196F3",
      ENTREGUE: "#8BC34A",
      CANCELADO: "#F44336",
    }
    return statusMap[status] || "#999"
  }

  editarPedido(id: number): void {
    console.log("Editar pedido:", id)
  }

  editarGabinete(id: number): void {
    console.log("Editar gabinete:", id)
  }

  editarCliente(id: number): void {
    console.log("Editar cliente:", id)
  }

  verMais(tipo: string): void {
    console.log("Ver mais:", tipo)
  }
}
