import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ClienteJuridico } from '../models/cliente-juridico.model';

@Injectable({
  providedIn: 'root'
})
export class ClienteJuridicoService {
  private apiUrl = 'http://localhost:8080/clientes/juridicos';

  constructor(private http: HttpClient) { }

  listarTodos(): Observable<ClienteJuridico[]> {
    return this.http.get<ClienteJuridico[]>(this.apiUrl);
  }

  salvar(cliente: ClienteJuridico): Observable<ClienteJuridico> {
    return this.http.post<ClienteJuridico>(this.apiUrl, cliente);
  }

  buscarPorId(id: number): Observable<ClienteJuridico> {
    return this.http.get<ClienteJuridico>(`${this.apiUrl}/${id}`);
  }

  atualizar(id: number, cliente: ClienteJuridico): Observable<ClienteJuridico> {
    return this.http.put<ClienteJuridico>(`${this.apiUrl}/${id}`, cliente);
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
