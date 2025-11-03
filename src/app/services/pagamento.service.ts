import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pagamento } from '../models/pagamento.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PagamentoService {
  private apiUrl = 'http://localhost:8080/pagamentos';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.obterToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  listarTodos(): Observable<Pagamento[]> {
    return this.http.get<Pagamento[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  salvar(pagamento: Pagamento): Observable<Pagamento> {
    return this.http.post<Pagamento>(this.apiUrl, pagamento, { headers: this.getHeaders() });
  }

  buscarPorId(id: number): Observable<Pagamento> {
    return this.http.get<Pagamento>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  atualizar(id: number, pagamento: Pagamento): Observable<Pagamento> {
    return this.http.put<Pagamento>(`${this.apiUrl}/${id}`, pagamento, { headers: this.getHeaders() });
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}
