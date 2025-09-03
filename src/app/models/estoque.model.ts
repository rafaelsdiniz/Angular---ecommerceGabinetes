import { Gabinete } from "./gabinete.model";

export interface Estoque{
    id: number;
    gabinete: Gabinete;
    quantidadeDisponivel: number;
}