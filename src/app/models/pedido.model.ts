import { Cliente } from "./cliente.model";
import { Endereco } from "./endereco.model";
import { StatusPedido } from "./enums/statusPedido";
import { ItemPedido } from "./item-pedido.model";

export interface Pedido{
    id: number;
    cliente: Cliente;
    dataPedido: Date;
    itens: ItemPedido[];
    valorTotal: number;
    statusPedido: StatusPedido;
    endereco: Endereco;
}