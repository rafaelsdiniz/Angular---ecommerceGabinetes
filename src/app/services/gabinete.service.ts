// src/app/services/gabinete.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Gabinete } from '../models/gabinete.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class GabineteService {
  private apiUrl = 'http://localhost:8080/gabinetes';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.obterToken();
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }

  listarTodos(): Observable<Gabinete[]> {
    return this.http.get<Gabinete[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  salvar(gabinete: Gabinete): Observable<Gabinete> {
    return this.http.post<Gabinete>(this.apiUrl, gabinete, { headers: this.getHeaders() });
  }

  buscarPorId(id: number): Observable<Gabinete> {
    return this.http.get<Gabinete>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  atualizar(id: number, gabinete: Gabinete): Observable<Gabinete> {
    return this.http.put<Gabinete>(`${this.apiUrl}/${id}`, gabinete, { headers: this.getHeaders() });
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  buscarPorMarca(marca: string): Observable<Gabinete[]> {
    const params = new HttpParams().set('marca', marca);
    return this.http.get<Gabinete[]>(`${this.apiUrl}/marca`, { headers: this.getHeaders(), params });
  }

  buscarPorFaixaPreco(precoMin: number, precoMax: number): Observable<Gabinete[]> {
    const params = new HttpParams().set('precoMin', precoMin.toString()).set('precoMax', precoMax.toString());
    return this.http.get<Gabinete[]>(`${this.apiUrl}/faixa-preco`, { headers: this.getHeaders(), params });
  }

  buscarPorCor(cor: string): Observable<Gabinete[]> {
    const params = new HttpParams().set('cor', cor);
    return this.http.get<Gabinete[]>(`${this.apiUrl}/cor`, { headers: this.getHeaders(), params });
  }

  buscarPorFormato(formato: string): Observable<Gabinete[]> {
    const params = new HttpParams().set('formato', formato);
    return this.http.get<Gabinete[]>(`${this.apiUrl}/formato`, { headers: this.getHeaders(), params });
  }

  buscarPorNome(nome: string): Observable<Gabinete[]> {
    const params = new HttpParams().set('nome', nome);
    return this.http.get<Gabinete[]>(`${this.apiUrl}/nome`, { headers: this.getHeaders(), params });
  }

  buscarPorCategoria(categoriaId: number): Observable<Gabinete[]> {
    return this.http.get<Gabinete[]>(`${this.apiUrl}/categoria/${categoriaId}`, { headers: this.getHeaders() });
  }

  listarOrdenadoPorPreco(crescente = true): Observable<Gabinete[]> {
    const params = new HttpParams().set('crescente', crescente.toString());
    return this.http.get<Gabinete[]>(`${this.apiUrl}/ordenado-preco`, { headers: this.getHeaders(), params });
  }

  listarOrdenadoPorNome(): Observable<Gabinete[]> {
    return this.http.get<Gabinete[]>(`${this.apiUrl}/ordenado-nome`, { headers: this.getHeaders() });
  }
}
