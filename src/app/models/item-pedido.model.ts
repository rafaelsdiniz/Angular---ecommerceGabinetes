import { Gabinete } from "./gabinete.model";
import { Pedido } from "./pedido.model";

export interface ItemPedido{
    id?: number;
    pedido: Partial<Pedido>;
    gabinete: Gabinete;
    quantidade: number;
    precoUnitario: number;
    precoTotal: number;
}