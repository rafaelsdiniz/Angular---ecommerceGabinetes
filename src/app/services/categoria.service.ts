import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Categoria } from '../models/categoria.model';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private apiUrl = 'http://localhost:8080/categorias';

  constructor(private http: HttpClient) { }

  listarTodos(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.apiUrl);
  }

  salvar(categoria: Categoria): Observable<Categoria> {
    return this.http.post<Categoria>(this.apiUrl, categoria);
  }

  buscarPorId(id: number): Observable<Categoria> {
    return this.http.get<Categoria>(this.apiUrl + '/' + id)
  }

  atualizar(id: number, categoria: Categoria): Observable<Categoria> {
    return this.http.put<Categoria>(this.apiUrl + '/' + id, categoria)
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(this.apiUrl + '/' + id)
  }
}
