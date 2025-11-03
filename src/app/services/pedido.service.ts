import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pedido } from '../models/pedido.model';
import { StatusPedido } from '../models/enums/statusPedido';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  private apiUrl = 'http://localhost:8080/pedidos';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.obterToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  listarTodos(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  salvar(pedido: Pedido): Observable<Pedido> {
    return this.http.post<Pedido>(this.apiUrl, pedido, { headers: this.getHeaders() });
  }

  buscarPorId(id: number): Observable<Pedido> {
    return this.http.get<Pedido>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  atualizar(id: number, pedido: Pedido): Observable<Pedido> {
    return this.http.put<Pedido>(`${this.apiUrl}/${id}`, pedido, { headers: this.getHeaders() });
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  finalizarPedido(id: number): Observable<Pedido> {
    return this.http.post<Pedido>(`${this.apiUrl}/${id}/finalizar`, {}, { headers: this.getHeaders() });
  }

  cancelarPedido(id: number): Observable<Pedido> {
    return this.http.post<Pedido>(`${this.apiUrl}/${id}/cancelar`, {}, { headers: this.getHeaders() });
  }

  atualizarStatus(id: number, status: StatusPedido): Observable<Pedido> {
    return this.http.put<Pedido>(`${this.apiUrl}/${id}/status?status=${status}`, {}, { headers: this.getHeaders() });
  }

  buscarPorStatus(status: StatusPedido): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(`${this.apiUrl}/status/${status}`, { headers: this.getHeaders() });
  }

  buscarHistoricoCliente(clienteId: number): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(`${this.apiUrl}/cliente/${clienteId}/historico`, { headers: this.getHeaders() });
  }
}
