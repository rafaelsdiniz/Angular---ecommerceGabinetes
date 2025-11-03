import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { CarrinhoService, ItemCarrinho } from "../../../services/carrinho.service"

@Component({
  selector: "app-cart",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./cart.component.html",
  styleUrl: "./cart.component.css",
})
export class CartComponent implements OnInit {
  cartItems: ItemCarrinho[] = []

  constructor(private carrinhoService: CarrinhoService) {}

  ngOnInit(): void {
    this.carregarCarrinho()
  }

  private carregarCarrinho(): void {
    this.cartItems = this.carrinhoService.obterItens()
  }

  get total(): number {
    return this.carrinhoService.total
  }

  get totalItens(): number {
    return this.carrinhoService.totalItens
  }

  aumentarQuantidade(id: number): void {
    const item = this.cartItems.find((i) => i.id === id)
    if (item) {
      const novaQtd = item.quantidade + 1
      this.carrinhoService.atualizarQuantidade(id, novaQtd)
      this.carregarCarrinho()
    }
  }

  diminuirQuantidade(id: number): void {
    const item = this.cartItems.find((i) => i.id === id)
    if (item && item.quantidade > 1) {
      const novaQtd = item.quantidade - 1
      this.carrinhoService.atualizarQuantidade(id, novaQtd)
      this.carregarCarrinho()
    }
  }

  removerItem(id: number): void {
    this.carrinhoService.removerItem(id)
    this.carregarCarrinho()
  }

  limparCarrinho(): void {
    this.carrinhoService.limparCarrinho()
    this.cartItems = []
  }
}
