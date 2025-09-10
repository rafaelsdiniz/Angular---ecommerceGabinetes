import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ClienteFisico } from '../models/cliente-fisico.model';

@Injectable({
  providedIn: 'root'
})
export class ClienteFisicoService {
  private apiUrl = 'http://localhost:8080/clientes/fisicos';

  constructor(private http: HttpClient) { }

  listarTodos(): Observable<ClienteFisico[]> {
    return this.http.get<ClienteFisico[]>(this.apiUrl);
  }

  salvar(cliente: ClienteFisico): Observable<ClienteFisico> {
    return this.http.post<ClienteFisico>(this.apiUrl, cliente);
  }

  buscarPorId(id: number): Observable<ClienteFisico> {
    return this.http.get<ClienteFisico>(`${this.apiUrl}/${id}`);
  }

  atualizar(id: number, cliente: ClienteFisico): Observable<ClienteFisico> {
    return this.http.put<ClienteFisico>(`${this.apiUrl}/${id}`, cliente);
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
