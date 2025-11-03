// src/app/services/informacao-adicional.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InformacaoAdicional } from '../models/informacaoAdicional.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class InformacaoAdicionalService {
  private apiUrl = 'http://localhost:8080/informacoes-adicionais';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.obterToken();
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }

  listarTodos(): Observable<InformacaoAdicional[]> {
    return this.http.get<InformacaoAdicional[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  buscarPorId(id: number): Observable<InformacaoAdicional> {
    return this.http.get<InformacaoAdicional>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  criar(info: InformacaoAdicional): Observable<InformacaoAdicional> {
    return this.http.post<InformacaoAdicional>(this.apiUrl, info, { headers: this.getHeaders() });
  }

  atualizar(id: number, info: InformacaoAdicional): Observable<InformacaoAdicional> {
    return this.http.put<InformacaoAdicional>(`${this.apiUrl}/${id}`, info, { headers: this.getHeaders() });
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  listarPorGabinete(gabineteId: number): Observable<InformacaoAdicional[]> {
    return this.http.get<InformacaoAdicional[]>(`${this.apiUrl}/gabinete/${gabineteId}`, { headers: this.getHeaders() });
  }
}
