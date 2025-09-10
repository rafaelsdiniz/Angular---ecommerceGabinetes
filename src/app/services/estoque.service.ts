import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Estoque } from '../models/estoque.model';

@Injectable({
  providedIn: 'root'
})
export class EstoqueService {
  private apiUrl = 'http://localhost:8080/estoques';

  constructor(private http: HttpClient) { }

  listarTodos(): Observable<Estoque[]> {
    return this.http.get<Estoque[]>(this.apiUrl);
  }

  salvar(estoque: Estoque): Observable<Estoque> {
    return this.http.post<Estoque>(this.apiUrl, estoque);
  }

  buscarPorId(id: number): Observable<Estoque> {
    return this.http.get<Estoque>(`${this.apiUrl}/${id}`);
  }

  atualizar(id: number, estoque: Estoque): Observable<Estoque> {
    return this.http.put<Estoque>(`${this.apiUrl}/${id}`, estoque);
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
