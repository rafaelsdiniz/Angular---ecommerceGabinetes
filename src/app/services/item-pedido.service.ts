import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ItemPedido } from '../models/item-pedido.model';

@Injectable({
  providedIn: 'root'
})
export class ItemPedidoService {
  private apiUrl = 'http://localhost:8080/itempedido';

  constructor(private http: HttpClient) { }

  listarTodos(): Observable<ItemPedido[]> {
    return this.http.get<ItemPedido[]>(this.apiUrl);
  }

  salvar(item: ItemPedido): Observable<ItemPedido> {
    return this.http.post<ItemPedido>(this.apiUrl, item);
  }

  buscarPorId(id: number): Observable<ItemPedido> {
    return this.http.get<ItemPedido>(`${this.apiUrl}/${id}`);
  }

  atualizar(id: number, item: ItemPedido): Observable<ItemPedido> {
    return this.http.put<ItemPedido>(`${this.apiUrl}/${id}`, item);
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
