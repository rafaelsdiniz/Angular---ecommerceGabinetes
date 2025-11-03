// src/app/services/modelo.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Modelo } from '../models/modelo.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ModeloService {
  private apiUrl = 'http://localhost:8080/modelos';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.obterToken();
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }

  listarTodos(): Observable<Modelo[]> {
    return this.http.get<Modelo[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  criar(modelo: Modelo): Observable<Modelo> {
    return this.http.post<Modelo>(this.apiUrl, modelo, { headers: this.getHeaders() });
  }

  buscarPorId(id: number): Observable<Modelo> {
    return this.http.get<Modelo>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  atualizar(id: number, modelo: Modelo): Observable<Modelo> {
    return this.http.put<Modelo>(`${this.apiUrl}/${id}`, modelo, { headers: this.getHeaders() });
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  listarPorMarcaId(marcaId: number): Observable<Modelo[]> {
    return this.http.get<Modelo[]>(`${this.apiUrl}/marca/${marcaId}`, { headers: this.getHeaders() });
  }

  buscarPorNome(nome: string): Observable<Modelo[]> {
    return this.http.get<Modelo[]>(`${this.apiUrl}/search/${nome}`, { headers: this.getHeaders() });
  }
}
