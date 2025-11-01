// src/app/services/estoque.service.ts
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import type { Estoque } from '../models/estoque.model';

@Injectable({
  providedIn: 'root'
})
export class EstoqueService {
  private apiUrl = 'http://localhost:8080/estoques';

  private token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJ1bml0aW5zLWp3dCIsInN1YiI6InJhZmFlbCIsImdyb3VwcyI6WyJBZG0iXSwiZXhwIjoxNzY0NTI5MjA4LCJpYXQiOjE3NjE5MzcyMDgsImp0aSI6ImI4NWZiOTg2LTY1MTktNDJkMi1hZDZjLTc1ZGEyNjZmZGUzZCJ9.C2d5iGEasDXQ-JBJw6EbE6vkeOk35sf45dTx4SUXsnD0xLdflAbCcS25SJP7KDS3fHY6lQDFEewU82se6Hbi_17bf_R1F8RtPS42-aYZde-HOaEyN1gli1ZrIu4wOeRvU_vymgKGRboldJWu2qalktXE5VBrQzNXEOUjK2K9bcfHa3vEoMsPWlUTj_1fJBBp9_Qp4zgGJXx3NKa5Q22J6UPWCOwbDDzS10X47WF-8vbiRaO89fOJ1JSNzuGOALtkUhwdUMpHERAkTnZ89081kCyQL1Zw1-mo5fPYUnTuAH8-x7-nOGGDpqkoZ_vc4gErl_mvdyaivMtPrtHTUEyviA';

  private httpOptions = {
    headers: new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    })
  };

  constructor(private http: HttpClient) {}

  listarTodos(): Observable<Estoque[]> {
    return this.http.get<Estoque[]>(this.apiUrl);
  }

  buscarPorId(id: number): Observable<Estoque> {
    return this.http.get<Estoque>(`${this.apiUrl}/${id}`);
  }

  buscarPorGabineteId(gabineteId: number): Observable<Estoque> {
    return this.http.get<Estoque>(`${this.apiUrl}/gabinete/${gabineteId}`);
  }

  salvar(estoque: Estoque): Observable<Estoque> {
    return this.http.post<Estoque>(this.apiUrl, estoque);
  }

  atualizar(id: number, estoque: Estoque): Observable<Estoque> {
    return this.http.put<Estoque>(`${this.apiUrl}/${id}`, estoque);
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  adicionarEstoque(gabineteId: number, quantidade: number): Observable<Estoque> {
    return this.http.post<Estoque>(`${this.apiUrl}/adicionar/${gabineteId}?quantidade=${quantidade}`, {});
  }

  removerEstoque(gabineteId: number, quantidade: number): Observable<Estoque> {
    return this.http.post<Estoque>(`${this.apiUrl}/remover/${gabineteId}?quantidade=${quantidade}`, {});
  }

  verificarDisponibilidade(gabineteId: number, quantidadeDesejada: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/disponivel/${gabineteId}?quantidade=${quantidadeDesejada}`);
  }

  listarEstoqueBaixo(quantidadeMinima: number): Observable<Estoque[]> {
    return this.http.get<Estoque[]>(`${this.apiUrl}/baixo?quantidadeMinima=${quantidadeMinima}`);
  }
}
