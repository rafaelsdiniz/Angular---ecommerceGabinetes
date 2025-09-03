import { Cliente } from "./cliente.model";

export interface ClienteFisico extends Cliente{
    cpf: string;
    idade: number;
    nome: string;
    sobreNome: string;
}