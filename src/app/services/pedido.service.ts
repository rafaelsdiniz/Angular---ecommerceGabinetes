import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pedido } from '../models/pedido.model';
import { StatusPedido } from '../models/enums/statusPedido';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  private apiUrl = 'http://localhost:8080/pedidos';
  
  // ⬇️ Coloca teu token aqui (só pra teste)
  private token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJ1bml0aW5zLWp3dCIsInN1YiI6InJhZmFlbCIsImdyb3VwcyI6WyJBZG0iXSwiZXhwIjoxNzY0NTI5MjA4LCJpYXQiOjE3NjE5MzcyMDgsImp0aSI6ImI4NWZiOTg2LTY1MTktNDJkMi1hZDZjLTc1ZGEyNjZmZGUzZCJ9.C2d5iGEasDXQ-JBJw6EbE6vkeOk35sf45dTx4SUXsnD0xLdflAbCcS25SJP7KDS3fHY6lQDFEewU82se6Hbi_17bf_R1F8RtPS42-aYZde-HOaEyN1gli1ZrIu4wOeRvU_vymgKGRboldJWu2qalktXE5VBrQzNXEOUjK2K9bcfHa3vEoMsPWlUTj_1fJBBp9_Qp4zgGJXx3NKa5Q22J6UPWCOwbDDzS10X47WF-8vbiRaO89fOJ1JSNzuGOALtkUhwdUMpHERAkTnZ89081kCyQL1Zw1-mo5fPYUnTuAH8-x7-nOGGDpqkoZ_vc4gErl_mvdyaivMtPrtHTUEyviA';

  private httpOptions = {
    headers: new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    })
  };

  constructor(private http: HttpClient) {}

  listarTodos(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(this.apiUrl, this.httpOptions);
  }

  salvar(pedido: Pedido): Observable<Pedido> {
    return this.http.post<Pedido>(this.apiUrl, pedido, this.httpOptions);
  }

  buscarPorId(id: number): Observable<Pedido> {
    return this.http.get<Pedido>(`${this.apiUrl}/${id}`, this.httpOptions);
  }

  atualizar(id: number, pedido: Pedido): Observable<Pedido> {
    return this.http.put<Pedido>(`${this.apiUrl}/${id}`, pedido, this.httpOptions);
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.httpOptions);
  }

  finalizarPedido(id: number): Observable<Pedido> {
    return this.http.post<Pedido>(`${this.apiUrl}/${id}/finalizar`, {}, this.httpOptions);
  }

  cancelarPedido(id: number): Observable<Pedido> {
    return this.http.post<Pedido>(`${this.apiUrl}/${id}/cancelar`, {}, this.httpOptions);
  }

  atualizarStatus(id: number, status: StatusPedido): Observable<Pedido> {
    return this.http.put<Pedido>(`${this.apiUrl}/${id}/status?status=${status}`, {}, this.httpOptions);
  }

  buscarPorStatus(status: StatusPedido): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(`${this.apiUrl}/status/${status}`, this.httpOptions);
  }

  buscarHistoricoCliente(clienteId: number): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(`${this.apiUrl}/cliente/${clienteId}/historico`, this.httpOptions);
  }
}
