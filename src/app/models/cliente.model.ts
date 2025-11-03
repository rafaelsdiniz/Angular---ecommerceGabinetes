import { Endereco } from './endereco.model';

export interface Cliente {
  id?: number;
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  perfil: string;        
  enderecos?: Endereco[];
}
