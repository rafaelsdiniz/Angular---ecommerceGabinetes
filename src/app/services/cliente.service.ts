import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import type { Cliente } from "../services/auth.service";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: "root",
})
export class ClienteService {
  private apiUrl = "http://localhost:8080/clientes";

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHttpOptions(): { headers: HttpHeaders } {
    const token = this.authService.obterToken();
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token || ""}`,
      }),
    };
  }

  // Endpoints públicos → sem token
  criar(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(this.apiUrl, cliente);
  }

  // Endpoints autenticados → com token
  listarTodos(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.apiUrl, this.getHttpOptions());
  }

  buscarPorId(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.apiUrl}/${id}`, this.getHttpOptions());
  }

  buscarPorCpf(cpf: string): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.apiUrl}/cpf?cpf=${cpf}`, this.getHttpOptions());
  }

  atualizar(id: number, cliente: Cliente): Observable<Cliente> {
    return this.http.put<Cliente>(`${this.apiUrl}/${id}`, cliente, this.getHttpOptions());
  }

  alterarSenha(id: number, senhaAtual: string, novaSenha: string): Observable<any> {
    const dados = { senhaAtual, novaSenha };
    return this.http.put(`${this.apiUrl}/${id}/minha-senha`, dados, this.getHttpOptions());
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.getHttpOptions());
  }
}
