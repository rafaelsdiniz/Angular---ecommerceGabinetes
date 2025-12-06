import { Component, type OnInit, OnDestroy } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { FormsModule } from "@angular/forms"
import { Subscription } from "rxjs"
import { AuthService, Cliente, AtualizarPerfilDto, TrocarSenhaDto } from "../../../services/auth.service"
import { PedidoService } from "../../../services/pedido.service"
import { Pedido } from "../../../models/pedido.model"
import { StatusPedido } from "../../../models/enums/statusPedido"
import { HttpClient } from "@angular/common/http"

@Component({
  selector: "app-user-dashboard",
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: "./user-dashboard.component.html",
  styleUrls: ["./user-dashboard.component.css"],
})
export class UserDashboardComponent implements OnInit, OnDestroy {
  cliente: Cliente | null = null
  pedidos: Pedido[] = []

  tabAtiva = "dados"
  modoEdicao = false
  modoTrocaSenha = false
  nomeEdit = ""
  emailEdit = ""
  telefoneEdit = ""
  senhaAtual = ""
  novaSenha = ""
  confirmarNovaSenha = ""
  carregando = false
  erro = ""
  sucesso = ""
  carregandoPedidos = false
  private subscriptions: Subscription[] = []

  constructor(
    private authService: AuthService,
    private pedidoService: PedidoService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.carregarCliente()
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe())
  }

  carregarCliente(): void {
    const clienteSub = this.authService.getCliente().subscribe({
      next: (cliente) => {
        if (cliente) {
          this.cliente = cliente
          this.preencherFormularioEdicao()
          this.carregarPedidos()
        }
      },
      error: (err) => {
        console.error('Erro ao carregar cliente:', err)
        this.cliente = {
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
        this.preencherFormularioEdicao()
        this.carregarPedidos()
      }
    })
    this.subscriptions.push(clienteSub)
  }

  carregarPedidos(): void {
    if (!this.cliente?.id) {
      console.warn('Cliente sem ID, não é possível carregar pedidos')
      this.pedidos = this.mockPedidos()
      return
    }

    this.carregandoPedidos = true
    console.log('📦 Carregando pedidos do cliente ID:', this.cliente.id)

    this.pedidoService.listarPorClienteLogado().subscribe({
      next: (pedidos) => {
        console.log('✅ Pedidos carregados:', pedidos)
        this.pedidos = pedidos || []
        this.carregandoPedidos = false
      },
      error: (err) => {
        console.error("❌ Erro ao carregar pedidos:", err)
        this.carregandoPedidos = false
        
        console.log('⚠️ Usando pedidos mockados para desenvolvimento')
        this.pedidos = this.mockPedidos()
      }
    })
  }

  private mockPedidos(): Pedido[] {
    return [
      {
        id: 1001,
        cliente: {
          id: 1,
          nome: this.cliente?.nome || "Cliente Teste",
          email: this.cliente?.email || "teste@faculdade.com",
          telefone: this.cliente?.telefone || "11999999999",
          cpf: this.cliente?.cpf || "123.456.789-00",
          perfil: "CLIENTE"
        },
        dataPedido: new Date(),
        itens: [
          {
            id: 1,
            idGabinete: 1,
            nomeGabinete: "MasterBox Q300L",
            quantidade: 2,
            precoUnitario: 499.99,
            precoTotal: 999.98
          }
        ],
        valorTotal: 999.98,
        status: StatusPedido.PROCESSANDO,
        endereco: {
          numero: "123",
          complemento: "Apto 101",
          bairro: "Centro",
          cidade: "São Paulo",
          estado: "SP",
          cep: "01234567"
        }
      },
      {
        id: 1002,
        cliente: {
          id: 1,
          nome: this.cliente?.nome || "Cliente Teste",
          email: this.cliente?.email || "teste@faculdade.com",
          telefone: this.cliente?.telefone || "11999999999",
          cpf: this.cliente?.cpf || "123.456.789-00",
          perfil: "CLIENTE"
        },
        dataPedido: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        itens: [
          {
            id: 2,
            idGabinete: 3,
            nomeGabinete: "Gabinete Gamer RGB",
            quantidade: 1,
            precoUnitario: 799.99,
            precoTotal: 799.99
          }
        ],
        valorTotal: 799.99,
        status: StatusPedido.ENTREGUE,
        endereco: {
          numero: "456",
          complemento: "Sala 201",
          bairro: "Jardim Paulista",
          cidade: "São Paulo",
          estado: "SP",
          cep: "04567000"
        }
      }
    ]
  }

  preencherFormularioEdicao(): void {
    if (this.cliente) {
      this.nomeEdit = this.cliente.nome
      this.emailEdit = this.cliente.email
      this.telefoneEdit = this.cliente.telefone
    }
  }

  ativarEdicao(): void {
    this.modoEdicao = true
    this.erro = ""
    this.sucesso = ""
  }

  cancelarEdicao(): void {
    this.modoEdicao = false
    this.preencherFormularioEdicao()
    this.erro = ""
  }

  salvarPerfil(): void {
    this.erro = ""
    this.sucesso = ""

    if (!this.nomeEdit || !this.emailEdit || !this.telefoneEdit) {
      this.erro = "Preencha todos os campos"
      return
    }

    if (this.nomeEdit.length < 3 || this.nomeEdit.length > 200) {
      this.erro = "Nome deve ter entre 3 e 200 caracteres"
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(this.emailEdit)) {
      this.erro = "Email inválido"
      return
    }

    const telefoneNumeros = this.telefoneEdit.replace(/\D/g, "")
    if (telefoneNumeros.length < 10 || telefoneNumeros.length > 11) {
      this.erro = "Telefone deve ter 10 ou 11 dígitos"
      return
    }

    this.carregando = true

    const dados: AtualizarPerfilDto = {
      nome: this.nomeEdit,
      email: this.emailEdit,
      telefone: telefoneNumeros
    }

    console.log('📤 Enviando dados para atualização:', dados)

    this.authService.atualizarPerfil(dados).subscribe({
      next: (clienteAtualizado) => {
        console.log('✅ Perfil atualizado com sucesso:', clienteAtualizado)
        this.sucesso = "Perfil atualizado com sucesso!"
        this.modoEdicao = false
        this.carregando = false
        
        this.cliente = clienteAtualizado
        
        setTimeout(() => this.sucesso = "", 3000)
      },
      error: (err) => {
        console.error("❌ Erro ao atualizar perfil:", err)
        console.error("Detalhes do erro:", err.error)
        
        if (err.status === 400) {
          this.erro = err.error?.message || err.message || "Dados inválidos. Verifique os campos."
        } else if (err.status === 401 || err.status === 403) {
          this.erro = "Sessão expirada. Faça login novamente."
          setTimeout(() => this.authService.logout(), 2000)
        } else {
          this.erro = err.error?.message || err.message || "Erro ao atualizar perfil"
        }
        
        this.carregando = false
      }
    })
  }

  ativarTrocaSenha(): void {
    this.modoTrocaSenha = true
    this.erro = ""
    this.sucesso = ""
    this.senhaAtual = ""
    this.novaSenha = ""
    this.confirmarNovaSenha = ""
  }

  cancelarTrocaSenha(): void {
    this.modoTrocaSenha = false
    this.senhaAtual = ""
    this.novaSenha = ""
    this.confirmarNovaSenha = ""
    this.erro = ""
  }

  salvarNovaSenha(): void {
    this.erro = ""
    this.sucesso = ""

    if (!this.senhaAtual || !this.novaSenha || !this.confirmarNovaSenha) {
      this.erro = "Preencha todos os campos"
      return
    }

    if (this.novaSenha.length < 6) {
      this.erro = "A nova senha deve ter no mínimo 6 caracteres"
      return
    }

    if (this.novaSenha !== this.confirmarNovaSenha) {
      this.erro = "As senhas não coincidem"
      return
    }

    if (this.senhaAtual === this.novaSenha) {
      this.erro = "A nova senha deve ser diferente da atual"
      return
    }

    this.carregando = true

    const dados: TrocarSenhaDto = {
      senhaAtual: this.senhaAtual,
      novaSenha: this.novaSenha
    }

    this.authService.trocarSenha(dados).subscribe({
      next: () => {
        this.sucesso = "Senha alterada com sucesso!"
        this.modoTrocaSenha = false
        this.carregando = false
        this.senhaAtual = ""
        this.novaSenha = ""
        this.confirmarNovaSenha = ""
        setTimeout(() => this.sucesso = "", 3000)
      },
      error: (err) => {
        console.error("Erro ao trocar senha:", err)
        this.erro = err.error?.message || "Erro ao trocar senha. Verifique a senha atual."
        this.carregando = false
      }
    })
  }

  testarEndpointPerfil(): void {
    const dadosTeste = {
      nome: this.cliente?.nome || 'Teste',
      email: this.cliente?.email || 'teste@email.com',
      telefone: '11999999999'
    }

    console.log('🔧 Testando endpoint /clientes/meu-perfil')
    console.log('📤 Dados de teste:', dadosTeste)
    
    this.http.put('http://localhost:8080/clientes/meu-perfil', dadosTeste, {
      headers: this.authService.obterHeaders()
    }).subscribe({
      next: (res) => console.log('✅ Teste bem-sucedido:', res),
      error: (err) => {
        console.error('❌ Teste falhou:', err)
        console.error('Status:', err.status)
        console.error('Mensagem:', err.message)
        console.error('Resposta completa:', err.error)
      }
    })
  }

  get enderecos() {
    return this.cliente?.enderecos ?? []
  }

  getStatusClass(status: string): string {
    switch (status) {
      case StatusPedido.ENTREGUE:
        return "status-entregue"
      case StatusPedido.ENVIADO:
        return "status-enviado"
      case StatusPedido.PROCESSANDO:
        return "status-processando"
      case StatusPedido.CANCELADO:
        return "status-cancelado"
      case StatusPedido.PENDENTE:
        return "status-pendente"
      default:
        return "status-processando"
    }
  }

  formatarStatus(status: string): string {
    const statusMap: { [key: string]: string } = {
      [StatusPedido.PROCESSANDO]: 'Processando',
      [StatusPedido.PENDENTE]: 'Pendente',
      [StatusPedido.ENVIADO]: 'Enviado',
      [StatusPedido.ENTREGUE]: 'Entregue',
      [StatusPedido.CANCELADO]: 'Cancelado'
    }
    return statusMap[status] || status
  }

  formatarData(data: Date | string): string {
    if (!data) return 'Data não disponível'
    
    try {
      const dateObj = typeof data === 'string' ? new Date(data) : data
      return dateObj.toLocaleDateString("pt-BR", {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch (error) {
      console.error('Erro ao formatar data:', data, error)
      return 'Data inválida'
    }
  }

  formatarPreco(preco: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(preco)
  }

  formatarValor(valor: number): string {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    })
  }

  trocarAba(aba: string): void {
    this.tabAtiva = aba
    this.erro = ""
    this.sucesso = ""

    if (aba !== 'dados') {
      this.modoEdicao = false
      this.modoTrocaSenha = false
    }
    
    if (aba === 'pedidos') {
      this.carregarPedidos()
    }
  }

  cancelarPedido(pedidoId: number): void {
    if (confirm("Deseja realmente cancelar este pedido?")) {
      this.pedidoService.cancelarPedido(pedidoId).subscribe({
        next: () => {
          this.carregarPedidos()
          this.sucesso = "Pedido cancelado com sucesso!"
          setTimeout(() => this.sucesso = "", 3000)
        },
        error: (err) => {
          console.error("Erro ao cancelar pedido:", err)
          this.erro = "Erro ao cancelar pedido. Tente novamente."
        }
      })
    }
  }

  verDadosPedidos(): void {
    console.log('📦 Dados dos pedidos:', this.pedidos)
    console.log('👤 Cliente:', this.cliente)
    alert('✅ Verifique o console (F12) para ver os dados dos pedidos')
  }
}