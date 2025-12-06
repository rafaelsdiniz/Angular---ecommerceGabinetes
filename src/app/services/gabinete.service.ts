
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
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
    
    if (token && token.length > 2000) {
      console.warn('Token muito grande, ignorando para evitar erro 431');
      this.authService.limparTudo();
      return new HttpHeaders();
    }
    
    return token
      ? new HttpHeaders({ 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        })
      : new HttpHeaders({ 'Content-Type': 'application/json' });
  }

  private getPublicHeaders(): HttpHeaders {
    return new HttpHeaders({ 'Content-Type': 'application/json' });
  }


  uploadImagem(gabineteId: number, file: File): Observable<Gabinete> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', file.name);

    return this.http.post<Gabinete>(`${this.apiUrl}/${gabineteId}/imagem`, formData, {
      headers: this.getHeadersForFormData()
    }).pipe(
      catchError(error => {
        if (error.status === 431) this.handleHeaderTooLarge();
        throw error;
      })
    );
  }

  deletarImagem(gabineteId: number): Observable<Gabinete> {
    return this.http.delete<Gabinete>(`${this.apiUrl}/${gabineteId}/imagem`, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => {
        if (error.status === 431) this.handleHeaderTooLarge();
        throw error;
      })
    );
  }

  obterUrlImagem(gabineteId: number): Observable<{ url: string }> {
    return this.http.get<{ url: string }>(`${this.apiUrl}/${gabineteId}/imagem/url`, {
      headers: this.getPublicHeaders()
    });
  }

  private getHeadersForFormData(): HttpHeaders {
    const token = this.authService.obterToken();
    
    if (token && token.length > 2000) {
      this.authService.limparTudo();
      return new HttpHeaders();
    }
    
    return token
      ? new HttpHeaders({ 'Authorization': `Bearer ${token}` })
      : new HttpHeaders();
  }

  listarTodos(): Observable<Gabinete[]> {
    return this.http.get<Gabinete[]>(this.apiUrl, { 
      headers: this.getPublicHeaders() 
    }).pipe(
      catchError(error => {
        if (error.status === 431) this.handleHeaderTooLarge();
        throw error;
      })
    );
  }

  buscarPorNome(nome: string): Observable<Gabinete[]> {
    const params = new HttpParams().set('nome', nome);
    return this.http.get<Gabinete[]>(`${this.apiUrl}/buscar/nome`, { 
      params,
      headers: this.getPublicHeaders() 
    }).pipe(
      catchError(error => {
        if (error.status === 431) this.handleHeaderTooLarge();
        throw error;
      })
    );
  }

  buscarPorId(id: number): Observable<Gabinete> {
    return this.http.get<Gabinete>(`${this.apiUrl}/${id}`, { 
      headers: this.getHeaders() 
    }).pipe(
      catchError(error => {
        if (error.status === 431) return this.buscarPorIdSemToken(id);
        throw error;
      })
    );
  }

  private buscarPorIdSemToken(id: number): Observable<Gabinete> {
    return this.http.get<Gabinete>(`${this.apiUrl}/public/${id}`, {
      headers: this.getPublicHeaders()
    });
  }

  salvar(gabinete: Gabinete): Observable<Gabinete> {
    return this.http.post<Gabinete>(this.apiUrl, gabinete, { 
      headers: this.getHeaders() 
    }).pipe(
      catchError(error => {
        if (error.status === 431) this.handleHeaderTooLarge();
        throw error;
      })
    );
  }

  atualizar(id: number, gabinete: Gabinete): Observable<Gabinete> {
    return this.http.put<Gabinete>(`${this.apiUrl}/${id}`, gabinete, { 
      headers: this.getHeaders() 
    }).pipe(
      catchError(error => {
        if (error.status === 431) this.handleHeaderTooLarge();
        throw error;
      })
    );
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { 
      headers: this.getHeaders() 
    }).pipe(
      catchError(error => {
        if (error.status === 431) this.handleHeaderTooLarge();
        throw error;
      })
    );
  }

  buscarPorMarca(marca: string): Observable<Gabinete[]> {
    const params = new HttpParams().set('marca', marca);
    return this.http.get<Gabinete[]>(`${this.apiUrl}/buscar/marca`, { 
      params, 
      headers: this.getHeaders() 
    }).pipe(
      catchError(error => {
        if (error.status === 431) this.handleHeaderTooLarge();
        throw error;
      })
    );
  }

  buscarPorFaixaPreco(precoMin: number, precoMax: number): Observable<Gabinete[]> {
    const params = new HttpParams()
      .set('min', precoMin.toString())
      .set('max', precoMax.toString());
    return this.http.get<Gabinete[]>(`${this.apiUrl}/buscar/preco`, { 
      params, 
      headers: this.getHeaders() 
    }).pipe(
      catchError(error => {
        if (error.status === 431) this.handleHeaderTooLarge();
        throw error;
      })
    );
  }

  buscarPorCor(cor: string): Observable<Gabinete[]> {
    const params = new HttpParams().set('cor', cor);
    return this.http.get<Gabinete[]>(`${this.apiUrl}/buscar/cor`, { 
      params, 
      headers: this.getHeaders() 
    }).pipe(
      catchError(error => {
        if (error.status === 431) this.handleHeaderTooLarge();
        throw error;
      })
    );
  }

  buscarPorFormato(formato: string): Observable<Gabinete[]> {
    const params = new HttpParams().set('formato', formato);
    return this.http.get<Gabinete[]>(`${this.apiUrl}/buscar/formato`, { 
      params, 
      headers: this.getHeaders() 
    }).pipe(
      catchError(error => {
        if (error.status === 431) this.handleHeaderTooLarge();
        throw error;
      })
    );
  }

  buscarPorCategoria(categoriaId: number): Observable<Gabinete[]> {
    return this.http.get<Gabinete[]>(`${this.apiUrl}/buscar/categoria/${categoriaId}`, { 
      headers: this.getHeaders() 
    }).pipe(
      catchError(error => {
        if (error.status === 431) this.handleHeaderTooLarge();
        throw error;
      })
    );
  }

  listarOrdenadoPorPreco(crescente = true): Observable<Gabinete[]> {
    const params = new HttpParams().set('crescente', crescente.toString());
    return this.http.get<Gabinete[]>(`${this.apiUrl}/ordenar/preco`, { 
      params, 
      headers: this.getHeaders() 
    }).pipe(
      catchError(error => {
        if (error.status === 431) this.handleHeaderTooLarge();
        throw error;
      })
    );
  }

  listarOrdenadoPorNome(): Observable<Gabinete[]> {
    return this.http.get<Gabinete[]>(`${this.apiUrl}/ordenar/nome`, { 
      headers: this.getHeaders() 
    }).pipe(
      catchError(error => {
        if (error.status === 431) this.handleHeaderTooLarge();
        throw error;
      })
    );
  }

  private handleHeaderTooLarge(): void {
    console.error('Erro 431: Headers muito grandes. Limpando token...');
    this.authService.limparTudo();
    setTimeout(() => window.location.reload(), 1000);
  }

  limparCacheEAutenticacao(): void {
    console.log('Limpando cache e autenticação...');
    this.authService.limparTudo();
  }
}