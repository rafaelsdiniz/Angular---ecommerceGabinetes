// src/app/services/marca.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Marca } from '../models/marca.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class MarcaService {
  private apiUrl = 'http://localhost:8080/marcas';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.obterToken();
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }

  listarTodos(): Observable<Marca[]> {
    return this.http.get<Marca[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  salvar(marca: Marca): Observable<Marca> {
    return this.http.post<Marca>(this.apiUrl, marca, { headers: this.getHeaders() });
  }

  buscarPorId(id: number): Observable<Marca> {
    return this.http.get<Marca>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  atualizar(id: number, marca: Marca): Observable<Marca> {
    return this.http.put<Marca>(`${this.apiUrl}/${id}`, marca, { headers: this.getHeaders() });
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}
