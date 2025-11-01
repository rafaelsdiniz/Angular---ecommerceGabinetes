import { FormaPagamento } from "./enums/formaPagamento";
import { StatusPagamento } from "./enums/statusPagamento";
import { Pedido } from "./pedido.model";

export interface Pagamento{
    id?: number;
    pedido: Pedido;
    formaPagamento: FormaPagamento;
    statusPagamento: StatusPagamento;
    valor: number;
    data: Date;
}