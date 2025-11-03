// src/app/services/item-pedido.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ItemPedido } from '../models/item-pedido.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ItemPedidoService {
  private apiUrl = 'http://localhost:8080/itempedido';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.obterToken();
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }

  listarTodos(): Observable<ItemPedido[]> {
    return this.http.get<ItemPedido[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  criar(item: ItemPedido): Observable<ItemPedido> {
    return this.http.post<ItemPedido>(this.apiUrl, item, { headers: this.getHeaders() });
  }

  buscarPorId(id: number): Observable<ItemPedido> {
    return this.http.get<ItemPedido>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  atualizar(id: number, item: ItemPedido): Observable<ItemPedido> {
    return this.http.put<ItemPedido>(`${this.apiUrl}/${id}`, item, { headers: this.getHeaders() });
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  listarPorClienteLogado(): Observable<ItemPedido[]> {
    return this.http.get<ItemPedido[]>(`${this.apiUrl}/meus-itens`, { headers: this.getHeaders() });
  }
}
