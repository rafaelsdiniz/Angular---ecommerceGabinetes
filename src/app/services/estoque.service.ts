// src/app/services/estoque.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Estoque } from '../models/estoque.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class EstoqueService {
  private apiUrl = 'http://localhost:8080/estoques';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.obterToken();
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }

  listarTodos(): Observable<Estoque[]> {
    return this.http.get<Estoque[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  buscarPorId(id: number): Observable<Estoque> {
    return this.http.get<Estoque>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  buscarPorGabineteId(gabineteId: number): Observable<Estoque> {
    return this.http.get<Estoque>(`${this.apiUrl}/gabinete/${gabineteId}`, { headers: this.getHeaders() });
  }

  salvar(estoque: Estoque): Observable<Estoque> {
    return this.http.post<Estoque>(this.apiUrl, estoque, { headers: this.getHeaders() });
  }

  atualizar(id: number, estoque: Estoque): Observable<Estoque> {
    return this.http.put<Estoque>(`${this.apiUrl}/${id}`, estoque, { headers: this.getHeaders() });
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  adicionarEstoque(gabineteId: number, quantidade: number): Observable<Estoque> {
    return this.http.post<Estoque>(`${this.apiUrl}/adicionar/${gabineteId}?quantidade=${quantidade}`, {}, { headers: this.getHeaders() });
  }

  removerEstoque(gabineteId: number, quantidade: number): Observable<Estoque> {
    return this.http.post<Estoque>(`${this.apiUrl}/remover/${gabineteId}?quantidade=${quantidade}`, {}, { headers: this.getHeaders() });
  }

  verificarDisponibilidade(gabineteId: number, quantidadeDesejada: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/disponivel/${gabineteId}?quantidade=${quantidadeDesejada}`, { headers: this.getHeaders() });
  }

  listarEstoqueBaixo(quantidadeMinima: number): Observable<Estoque[]> {
    return this.http.get<Estoque[]>(`${this.apiUrl}/baixo?quantidadeMinima=${quantidadeMinima}`, { headers: this.getHeaders() });
  }
}
