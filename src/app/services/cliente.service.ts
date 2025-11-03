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

  // ========================
  // LISTAR TODOS
  // ========================
  listarTodos(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.apiUrl, this.getHttpOptions());
  }

  // ========================
  // BUSCAR POR ID
  // ========================
  buscarPorId(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.apiUrl}/${id}`, this.getHttpOptions());
  }

  // ========================
  // BUSCAR POR CPF (query param)
  // ========================
  buscarPorCpf(cpf: string): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.apiUrl}/cpf?cpf=${cpf}`, this.getHttpOptions());
  }

  // ========================
  // CRIAR CLIENTE
  // ========================
  criar(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(this.apiUrl, cliente, this.getHttpOptions());
  }

  // ========================
  // ATUALIZAR CLIENTE
  // ========================
  atualizar(id: number, cliente: Cliente): Observable<Cliente> {
    return this.http.put<Cliente>(`${this.apiUrl}/${id}`, cliente, this.getHttpOptions());
  }

  // ========================
  // DELETAR CLIENTE
  // ========================
  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.getHttpOptions());
  }
}
