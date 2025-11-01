export interface Gabinete{
    id?: number;
    nomeExibicao: string;
    marca: string;
    preco: number;
    cor: string;
    formato?: string;
    altura?: number;
    largura?: number;
    peso?: number;
    tamanhoMaxGpu?: number;
    alturaMaxCooler?: number;
    qtdRgb?: number;
    usb?: number;
    usbc?: number;
    descricao?: string;
}