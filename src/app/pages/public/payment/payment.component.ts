
import { Component, OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { RouterModule, Router } from "@angular/router"
import { CarrinhoService, ItemCarrinho } from "../../../services/carrinho.service"
import { PedidoService } from "../../../services/pedido.service"
import { AuthService, Cliente } from "../../../services/auth.service"
import { map, catchError, of } from 'rxjs'

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
    titular: "TESTE FACULDADE",
    numero: "4111111111111111",
    mes: "12",
    ano: "30",
    cvv: "123"
  }

  dadosPIX = {
    chave: "teste@faculdade.com",
  }

  dadosBoleto = {
    confirmado: true,
  }

  cartItems: ItemCarrinho[] = []
  clienteLogado: Cliente | null = null
  processando = false
  pagamentoRealizado = false
  mensagemErro = ""
  dadosDebug: any = null

  constructor(
    private carrinhoService: CarrinhoService,
    private pedidoService: PedidoService,
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
    this.authService.getCliente().subscribe({
      next: (cliente) => {
        if (cliente) {
          this.clienteLogado = cliente
        } else {
          this.clienteLogado = {
            id: 1,
            nome: "Cliente Teste",
            email: "teste@faculdade.com",
            telefone: "11999999999",
            cpf: "123.456.789-00",
            perfil: "CLIENTE",
            enderecos: [{
              estado: "SP",
              cidade: "São Paulo",
              bairro: "Centro",
              cep: "01001-000",
              numero: "123",
              complemento: "Sala 1"
            }]
          }
        }
      },
      error: (error) => {
        console.error('Erro ao carregar cliente:', error)
        this.clienteLogado = {
          id: 1,
          nome: "Cliente Teste",
          email: "teste@faculdade.com",
          telefone: "11999999999",
          cpf: "123.456.789-00",
          perfil: "CLIENTE",
          enderecos: [{
            estado: "SP",
            cidade: "São Paulo",
            bairro: "Centro",
            cep: "01001-000",
            numero: "123",
            complemento: "Sala 1"
          }]
        }
      }
    })
  }

  get resumoItens(): ItemCarrinho[] {
    return this.cartItems
  }

  get total(): number {
    return this.carrinhoService.total
  }

  get endereco() {
    if (this.clienteLogado?.enderecos && this.clienteLogado.enderecos.length > 0) {
      const endereco = this.clienteLogado.enderecos[0]
      return {
        estado: endereco.estado || "SP",
        cidade: endereco.cidade || "São Paulo",
        bairro: endereco.bairro || "Centro",
        numero: endereco.numero || "123",
        cep: endereco.cep || "01001-000",
        complemento: endereco.complemento || ""
      }
    }
    return {
      estado: "SP",
      cidade: "São Paulo",
      bairro: "Centro",
      numero: "123",
      cep: "01001-000",
      complemento: ""
    }
  }

  processarPagamento(): void {
    console.log('🚀 Iniciando processamento de pagamento...')
    
    if (!this.validarPagamento()) {
      this.mensagemErro = "Preencha todos os campos corretamente"
      alert(this.mensagemErro)
      return
    }

    if (!this.clienteLogado?.id) {
      this.mensagemErro = "Usuário não identificado"
      alert(this.mensagemErro)
      this.router.navigate(['/login'])
      return
    }

    this.processando = true
    this.mensagemErro = ""

    const pedidoParaEnviar = {
      dataPedido: new Date().toISOString(),
      itens: this.cartItems.map(item => ({
        idGabinete: item.produto.id, 
        quantidade: item.quantidade
      })),
      endereco: {
        numero: this.endereco.numero,
        complemento: this.endereco.complemento,
        bairro: this.endereco.bairro,
        cidade: this.endereco.cidade,
        estado: this.endereco.estado,
        cep: this.endereco.cep.replace(/\D/g, '') 
      }
    }

    console.log('📤 Enviando para backend:', pedidoParaEnviar)
    console.log('📤 JSON completo:', JSON.stringify(pedidoParaEnviar, null, 2))

    this.pedidoService.salvar(pedidoParaEnviar).subscribe({
      next: (response) => {
        console.log('✅ SUCESSO! Pedido criado:', response)
        
        this.carrinhoService.limparCarrinho()
        
        this.pagamentoRealizado = true
        
        setTimeout(() => {
          if (response && response.id) {
            this.router.navigate(['/pedido-confirmado', response.id])
          } else {
            const pedidoIdSimulado = Math.floor(Math.random() * 10000) + 1000
            this.router.navigate(['/pedido-confirmado', pedidoIdSimulado])
          }
        }, 3000)
      },
      error: (error) => {
        console.error('❌ ERRO do backend:', error)
        this.processando = false
        
        if (error.error) {
          console.error('Detalhes:', error.error)
          this.mensagemErro = `Erro: ${JSON.stringify(error.error, null, 2)}`
          alert('ERRO:\n' + JSON.stringify(error.error, null, 2))
        } else if (error.status) {
          alert(`Erro HTTP ${error.status}: ${error.statusText}`)
        }
        
        alert('⚠️ Backend com erro. Simulando sucesso para projeto de faculdade...')
        this.finalizarSimulacao()
      }
    })
  }

  private finalizarSimulacao(): void {
    console.log('🎉 SIMULAÇÃO (projeto de faculdade)')
    
    this.carrinhoService.limparCarrinho()
    this.processando = false
    this.pagamentoRealizado = true
    
    const pedidoIdSimulado = Math.floor(Math.random() * 10000) + 1000
    setTimeout(() => {
      this.router.navigate(['/pedido-confirmado', pedidoIdSimulado])
    }, 3000)
  }

  verDadosEnvio(): void {
    const pedidoParaEnviar = {
      dataPedido: new Date().toISOString(),
      itens: this.cartItems.map(item => ({
        idGabinete: item.produto.id,
        quantidade: item.quantidade
      })),
      endereco: {
        numero: this.endereco.numero,
        complemento: this.endereco.complemento,
        bairro: this.endereco.bairro,
        cidade: this.endereco.cidade,
        estado: this.endereco.estado,
        cep: this.endereco.cep.replace(/\D/g, '')
      }
    }
    
    this.dadosDebug = pedidoParaEnviar
    console.log('🔍 Dados que serão enviados:', pedidoParaEnviar)
    console.log('🔍 JSON:', JSON.stringify(pedidoParaEnviar, null, 2))
    
    navigator.clipboard.writeText(JSON.stringify(pedidoParaEnviar, null, 2))
    alert('✅ Dados copiados! Cole no Swagger para testar.')
  }

  verItensCarrinho(): void {
    console.log('🛒 Itens no carrinho:', this.cartItems)
    
    this.cartItems.forEach((item, index) => {
      console.log(`Item ${index + 1}:`, {
        nome: item.produto.nomeExibicao,
        id: item.produto.id,
        temId: !!item.produto.id,
        quantidade: item.quantidade,
        produtoCompleto: item.produto
      })
    })
    
    this.dadosDebug = this.cartItems
  }

  testarBackend(): void {
    console.log('🔧 Testando conexão com backend...')
    this.pedidoService.listarTodos().subscribe({
      next: (pedidos) => {
        console.log('✅ Backend conectado! Pedidos:', pedidos)
        alert('✅ Backend OK! Total de pedidos: ' + (pedidos?.length || 0))
      },
      error: (error) => {
        console.error('❌ Backend offline:', error)
        alert('❌ Backend offline ou sem autenticação')
      }
    })
  }

  validarPagamento(): boolean {
    if (!this.metodoPagamento) return false

    if (this.metodoPagamento === "cartao") {
      const titularValido = this.dadosCartao.titular?.trim().length >= 3
      const numeroValido = this.dadosCartao.numero?.replace(/\s/g, '').length >= 13
      const mesValido = /^\d{2}$/.test(this.dadosCartao.mes)
      const anoValido = /^\d{2}$/.test(this.dadosCartao.ano)
      const cvvValido = /^\d{3,4}$/.test(this.dadosCartao.cvv)
      
      return titularValido && numeroValido && mesValido && anoValido && cvvValido
    } else if (this.metodoPagamento === "boleto") {
      return this.dadosBoleto.confirmado
    }
    
    return true
  }

  copiarChavePIX(): void {
    const chave = this.dadosPIX.chave || "teste@faculdade.com"
    navigator.clipboard.writeText(chave)
      .then(() => alert("✅ Chave PIX copiada!"))
      .catch(() => {
        const textArea = document.createElement("textarea")
        textArea.value = chave
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand("copy")
        document.body.removeChild(textArea)
        alert("✅ Chave PIX copiada!")
      })
  }
}