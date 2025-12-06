export interface Pedido {
  id: number;
  cliente: {
    id: number;
    nome: string;
    email: string;
    telefone: string;
    cpf: string;
    perfil: string;
  };
  dataPedido: Date | string;
  itens: {
    id: number;
    idGabinete: number;
    nomeGabinete: string;
    quantidade: number;
    precoUnitario: number;
    precoTotal: number;
  }[];
  valorTotal: number;
  status: string; 
  endereco: {
    numero: string;
    complemento: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
  };
}

export enum StatusPedido {
  PENDENTE = 'PENDENTE',
  PROCESSANDO = 'PROCESSANDO',
  ENVIADO = 'ENVIADO',
  ENTREGUE = 'ENTREGUE',
  CANCELADO = 'CANCELADO'
}