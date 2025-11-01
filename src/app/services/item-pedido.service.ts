import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ItemPedido } from '../models/item-pedido.model';

@Injectable({
  providedIn: 'root'
})
export class ItemPedidoService {
  private apiUrl = 'http://localhost:8080/itempedido';

  private token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJ1bml0aW5zLWp3dCIsInN1YiI6InJhZmFlbCIsImdyb3VwcyI6WyJBZG0iXSwiZXhwIjoxNzY0NTI5MjA4LCJpYXQiOjE3NjE5MzcyMDgsImp0aSI6ImI4NWZiOTg2LTY1MTktNDJkMi1hZDZjLTc1ZGEyNjZmZGUzZCJ9.C2d5iGEasDXQ-JBJw6EbE6vkeOk35sf45dTx4SUXsnD0xLdflAbCcS25SJP7KDS3fHY6lQDFEewU82se6Hbi_17bf_R1F8RtPS42-aYZde-HOaEyN1gli1ZrIu4wOeRvU_vymgKGRboldJWu2qalktXE5VBrQzNXEOUjK2K9bcfHa3vEoMsPWlUTj_1fJBBp9_Qp4zgGJXx3NKa5Q22J6UPWCOwbDDzS10X47WF-8vbiRaO89fOJ1JSNzuGOALtkUhwdUMpHERAkTnZ89081kCyQL1Zw1-mo5fPYUnTuAH8-x7-nOGGDpqkoZ_vc4gErl_mvdyaivMtPrtHTUEyviA';

  private httpOptions = {
    headers: new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    })
  };

  constructor(private http: HttpClient) { }

  listarTodos(): Observable<ItemPedido[]> {
    return this.http.get<ItemPedido[]>(this.apiUrl);
  }

  criar(item: ItemPedido): Observable<ItemPedido> {
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

  listarPorClienteLogado(): Observable<ItemPedido[]> {
    return this.http.get<ItemPedido[]>(`${this.apiUrl}/meus-itens`);
  }
}
