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

  // ✅ gera headers apenas se houver token
  private getHeaders(): HttpHeaders {
    const token = this.authService.obterToken();
    return token
      ? new HttpHeaders({ 'Authorization': `Bearer ${token}` })
      : new HttpHeaders();
  }

  // ============================================
  // PÚBLICOS
  // ============================================

  listarTodos(): Observable<Gabinete[]> {
    return this.http.get<Gabinete[]>(this.apiUrl);
  }

  buscarPorNome(nome: string): Observable<Gabinete[]> {
    const params = new HttpParams().set('nome', nome);
    return this.http.get<Gabinete[]>(`${this.apiUrl}/buscar/nome`, { params });
  }

  // ============================================
  // PROTEGIDOS (precisam de token)
  // ============================================

  salvar(gabinete: Gabinete): Observable<Gabinete> {
    return this.http.post<Gabinete>(this.apiUrl, gabinete, { headers: this.getHeaders() });
  }

  atualizar(id: number, gabinete: Gabinete): Observable<Gabinete> {
    return this.http.put<Gabinete>(`${this.apiUrl}/${id}`, gabinete, { headers: this.getHeaders() });
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  buscarPorId(id: number): Observable<Gabinete> {
    return this.http.get<Gabinete>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  buscarPorMarca(marca: string): Observable<Gabinete[]> {
    const params = new HttpParams().set('marca', marca);
    return this.http.get<Gabinete[]>(`${this.apiUrl}/buscar/marca`, { params, headers: this.getHeaders() });
  }

  buscarPorFaixaPreco(precoMin: number, precoMax: number): Observable<Gabinete[]> {
    const params = new HttpParams()
      .set('min', precoMin.toString())
      .set('max', precoMax.toString());
    return this.http.get<Gabinete[]>(`${this.apiUrl}/buscar/preco`, { params, headers: this.getHeaders() });
  }

  buscarPorCor(cor: string): Observable<Gabinete[]> {
    const params = new HttpParams().set('cor', cor);
    return this.http.get<Gabinete[]>(`${this.apiUrl}/buscar/cor`, { params, headers: this.getHeaders() });
  }

  buscarPorFormato(formato: string): Observable<Gabinete[]> {
    const params = new HttpParams().set('formato', formato);
    return this.http.get<Gabinete[]>(`${this.apiUrl}/buscar/formato`, { params, headers: this.getHeaders() });
  }

  buscarPorCategoria(categoriaId: number): Observable<Gabinete[]> {
    return this.http.get<Gabinete[]>(`${this.apiUrl}/buscar/categoria/${categoriaId}`, { headers: this.getHeaders() });
  }

  listarOrdenadoPorPreco(crescente = true): Observable<Gabinete[]> {
    const params = new HttpParams().set('crescente', crescente.toString());
    return this.http.get<Gabinete[]>(`${this.apiUrl}/ordenar/preco`, { params, headers: this.getHeaders() });
  }

  listarOrdenadoPorNome(): Observable<Gabinete[]> {
    return this.http.get<Gabinete[]>(`${this.apiUrl}/ordenar/nome`, { headers: this.getHeaders() });
  }
}
