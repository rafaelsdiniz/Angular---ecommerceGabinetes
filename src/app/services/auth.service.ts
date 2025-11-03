import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import { Observable, BehaviorSubject, tap } from "rxjs";

export interface Endereco {
  rua: string;
  numero: string;
  complemento: string;
  cidade: string;
  estado: string;
  cep: string;
}

export interface Cliente {
  id?: number;
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  perfil?: string;       // ADMIN, CLIENTE
  enderecos?: Endereco[];
}

export interface DadosRegistro {
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  senha: string;
  enderecos: Endereco[];
}

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private apiUrl = "http://localhost:8080";
  private clienteLogado$ = new BehaviorSubject<Cliente | null>(null);
  private isLogado$ = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {
    this.verificarLogin();
  }

  // ========================
  // LOGIN
  // ========================
    login(email: string, senha: string): Observable<HttpResponse<Cliente>> {
    const body = { email, senha };

    return this.http
        .post<Cliente>(`${this.apiUrl}/auth`, body, { observe: 'response' })
        .pipe(
        tap((response) => {
            const token = response.headers.get('Authorization');
            if (token) {
            this.salvarToken(token);
            this.isLogado$.next(true);
            this.clienteLogado$.next(response.body ?? null);
            }
        })
        );
    }

  // ========================
  // REGISTRO
  // ========================
  registrar(dados: DadosRegistro): Observable<Cliente> {
    return this.http.post<Cliente>(`${this.apiUrl}/clientes`, dados);
  }

  // ========================
  // LOGOUT
  // ========================
  logout(): void {
    this.removerToken();
    this.isLogado$.next(false);
    this.clienteLogado$.next(null);
  }

  // ========================
  // PERFIL
  // ========================
  getClienteLogado(): Observable<Cliente | null> {
    const token = this.obterToken();
    if (!token) throw new Error("Token não encontrado");

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<Cliente>(`${this.apiUrl}/cliente/perfil`, { headers });
  }

  carregarCliente(): void {
    try {
      this.getClienteLogado().subscribe({
        next: (cliente) => {
          this.clienteLogado$.next(cliente);
        },
        error: () => {
          // Se falhar, mantém o cliente nulo
        },
      });
    } catch {
      // Token não disponível
    }
  }

  private verificarLogin(): void {
    if (this.estaLogado()) {
      this.isLogado$.next(true);
      this.carregarCliente();
    }
  }

  // ========================
  // OBSERVABLES
  // ========================
  isLogado(): Observable<boolean> {
    return this.isLogado$.asObservable();
  }

  getCliente(): Observable<Cliente | null> {
    return this.clienteLogado$.asObservable();
  }

  // ========================
  // TOKEN
  // ========================
  salvarToken(token: string): void {
    localStorage.setItem("token", token);
  }

  obterToken(): string | null {
    return localStorage.getItem("token");
  }

  removerToken(): void {
    localStorage.removeItem("token");
  }

  estaLogado(): boolean {
    return !!this.obterToken();
  }
}
