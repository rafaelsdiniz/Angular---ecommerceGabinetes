import { Gabinete } from "./gabinete.model";

export interface InformacaoAdicional{
    id?: number;
    titulo: string;
    descricao: string;
    gabinete: Gabinete;
}