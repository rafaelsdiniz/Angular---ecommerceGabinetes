import { Cliente } from "./cliente.model";

export interface ClienteJuridico extends Cliente{
    nomeFantasia: string;
    razaoSocial: string;
    cnpj: string;
}