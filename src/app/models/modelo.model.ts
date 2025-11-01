import { Marca } from "./marca.model";

export interface Modelo{
    id?: number;
    nomeModelo: string;
    marca: Marca;
}