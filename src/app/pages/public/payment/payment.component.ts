import { Component, OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { RouterModule, Router } from "@angular/router"
import { CarrinhoService, ItemCarrinho } from "../../../services/carrinho.service"
import { PagamentoService } from "../../../services/pagamento.service"
import { PedidoService } from "../../../services/pedido.service"
import { ItemPedidoService } from "../../../services/item-pedido.service"
import { AuthService, Cliente } from "../../../services/auth.service"
import { Pagamento } from "../../../models/pagamento.model"
import { Pedido } from "../../../models/pedido.model"
import { ItemPedido } from "../../../models/item-pedido.model"
import { FormaPagamento } from "../../../models/enums/formaPagamento"
import { StatusPagamento } from "../../../models/enums/statusPagamento"
import { StatusPedido } from "../../../models/enums/statusPedido"

@Component({
  selector: "app-payment",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: "./payment.component.html",
  styleUrl: "./payment.component.css",
})
export class PaymentComponent implements OnInit {
  metodoPagamento = "cartao"

  dadosCartao = {
    titular: "",
    numero: "",
    mes: "",
    ano: "",
    cvv: "",
  }

  dadosPIX = {
    chave: "",
  }

  dadosBoleto = {
    confirmado: false,
  }

  cartItems: ItemCarrinho[] = []
  clienteLogado: Cliente | null = null
  processando = false
  pagamentoRealizado = false
  mensagemErro = ""

  constructor(
    private carrinhoService: CarrinhoService,
    private pagamentoService: PagamentoService,
    private pedidoService: PedidoService,
    private itemPedidoService: ItemPedidoService,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.carregarCarrinho()
    this.carregarCliente()
  }

  private carregarCarrinho(): void {
    this.cartItems = this.carrinhoService.obterItens()
    if (this.cartItems.length === 0) {
      this.mensagemErro = "Carrinho vazio!"
      setTimeout(() => this.router.navigate(["/carrinho"]), 2000)
    }
  }

  private carregarCliente(): void {
    this.authService.getCliente().subscribe((cliente) => {
      this.clienteLogado = cliente
    })
  }

  get resumoItens(): ItemCarrinho[] {
    return this.cartItems
  }

  get total(): number {
    return this.carrinhoService.total
  }

  get endereco() {
    return (
      this.clienteLogado?.enderecos?.[0] || {
        estado: "",
        cidade: "",
        bairro: "",
        numero: "",
        cep: "",
        complemento: "",
      }
    )
  }

  processarPagamento(): void {
    if (!this.validarPagamento()) {
      this.mensagemErro = "Preencha todos os campos corretamente"
      return
    }

    if (!this.clienteLogado) {
      this.mensagemErro = "Usuário não identificado"
      return
    }

    this.processando = true

    // Criar Pedido com itens do carrinho
    const novoPedido: Partial<Pedido> = {
      cliente: this.clienteLogado,
      dataPedido: new Date(),
      valorTotal: this.total,
      statusPedido: StatusPedido.PROCESSANDO,
      endereco: this.endereco,
      itens: [], // Será preenchido após criar o pedido
    }

    // Salvar pedido
    this.pedidoService.salvar(novoPedido as Pedido).subscribe({
      next: (pedidoCriado) => {
        // Criar ItemPedidos para cada item do carrinho
        const itemsPromises = this.cartItems.map((item) => {
          const itemPedido: Partial<ItemPedido> = {
            pedido: { id: pedidoCriado.id },
            gabinete: item.produto,
            quantidade: item.quantidade,
            precoUnitario: item.produto.preco,
            precoTotal: item.produto.preco * item.quantidade,
          }
          return this.itemPedidoService.criar(itemPedido as ItemPedido)
        })

        Promise.all(itemsPromises)
          .then(() => {
            // Criar Pagamento
            const novoPagamento: Partial<Pagamento> = {
              pedido: pedidoCriado,
              formaPagamento: this.mapearFormaPagamento(),
              statusPagamento: StatusPagamento.APROVADO,
              valor: this.total,
              data: new Date(),
            }

            this.pagamentoService.salvar(novoPagamento as Pagamento).subscribe({
              next: (pagamentoCriado) => {
                this.processando = false
                this.pagamentoRealizado = true
                // Limpar carrinho após sucesso
                this.carrinhoService.limparCarrinho()
              },
              error: (err) => {
                this.mensagemErro = "Erro ao processar pagamento"
                this.processando = false
              },
            })
          })
          .catch((err) => {
            this.mensagemErro = "Erro ao criar itens do pedido"
            this.processando = false
          })
      },
      error: (err) => {
        this.mensagemErro = "Erro ao criar pedido"
        this.processando = false
      },
    })
  }

  private mapearFormaPagamento(): FormaPagamento {
    switch (this.metodoPagamento) {
      case "cartao":
        return FormaPagamento.CARTAO_CREDITO
      case "pix":
        return FormaPagamento.PIX
      case "boleto":
        return FormaPagamento.BOLETO
      default:
        return FormaPagamento.CARTAO_CREDITO
    }
  }

  validarPagamento(): boolean {
    if (this.metodoPagamento === "cartao") {
      return (
        this.dadosCartao.titular !== "" &&
        this.dadosCartao.numero !== "" &&
        this.dadosCartao.mes !== "" &&
        this.dadosCartao.ano !== "" &&
        this.dadosCartao.cvv !== ""
      )
    } else if (this.metodoPagamento === "pix") {
      return this.dadosPIX.chave !== ""
    } else if (this.metodoPagamento === "boleto") {
      return this.dadosBoleto.confirmado
    }
    return false
  }

  copiarChavePIX(): void {
    const chave =
      "00020126580014br.gov.bcb.pix0136xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx52040000530398654061234.565802BR5913TESTE LTDA6009SAO PAULO62410503***63041D3D"
    navigator.clipboard.writeText(chave)
    alert("Chave PIX copiada para a área de transferência!")
  }
}
