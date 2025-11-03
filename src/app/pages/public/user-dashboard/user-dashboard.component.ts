import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { AuthService, Cliente } from "../../../services/auth.service"

interface Pedido {
  id: number
  data: string
  status: string
  total: number
  itens: number
}

@Component({
  selector: "app-user-dashboard",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./user-dashboard.component.html",
  styleUrls: ["./user-dashboard.component.css"],
})
export class UserDashboardComponent implements OnInit {
  cliente: Cliente | null = null
  pedidos: Pedido[] = [
    {
      id: 1001,
      data: "2024-10-15",
      status: "Entregue",
      total: 1299.9,
      itens: 1,
    },
    {
      id: 1002,
      data: "2024-11-02",
      status: "Em Transporte",
      total: 649.9,
      itens: 2,
    },
    {
      id: 1003,
      data: "2024-11-03",
      status: "Processando",
      total: 2199.8,
      itens: 3,
    },
  ]

  tabAtiva = "dados"

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getCliente().subscribe((cliente) => {
      if (cliente) {
        this.cliente = cliente
      }
    })
  }

  get enderecos() {
    return this.cliente?.enderecos ?? []
  }

  getStatusClass(status: string): string {
    switch (status) {
      case "Entregue":
        return "status-entregue"
      case "Em Transporte":
        return "status-transporte"
      case "Processando":
        return "status-processando"
      default:
        return "status-cancelado"
    }
  }

  formatarData(data: string): string {
    return new Date(data).toLocaleDateString("pt-BR")
  }

  formatarPreco(preco: number): string {
    return preco.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    })
  }

  trocarAba(aba: string): void {
    this.tabAtiva = aba
  }
}
