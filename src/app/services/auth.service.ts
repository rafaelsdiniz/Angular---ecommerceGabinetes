import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import { Observable, BehaviorSubject, tap, map } from "rxjs";
import { Router } from "@angular/router";

export interface Endereco {
  estado: string;
  cidade: string;
  bairro: string;
  cep: string;
  numero: string;
  complemento?: string;
}

export interface Cliente {
  id?: number;
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  perfil: string; // ADMIN, CLIENTE
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

  constructor(private http: HttpClient, private router: Router) {
    this.verificarLogin();
  }

  // ========================
  // LOGIN
  // ========================
  login(email: string, senha: string): Observable<Cliente> {
    return this.http
      .post<Cliente>(`${this.apiUrl}/auth`, { email, senha }, { observe: 'response' })
      .pipe(
        tap((resp: HttpResponse<Cliente>) => {
          const token = resp.headers.get('Authorization')?.replace('Bearer ', '');
          const cliente = resp.body;

          if (token && cliente) {
            this.salvarToken(token);
            this.isLogado$.next(true);
            this.clienteLogado$.next(cliente);

            // 🔁 Redirecionamento automático
            if (cliente.perfil === "ADMIN") {
              this.router.navigate(["/admin/dashboard"]);
            } else {
              this.router.navigate(["/"]);
            }
          }
        }),
        map((resp: HttpResponse<Cliente>) => resp.body!)
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
    this.router.navigate(["/login"]);
  }

  // ========================
  // PERFIL
  // ========================
  getCliente(): Observable<Cliente | null> {
    return this.clienteLogado$.asObservable();
  }

  isLogado(): Observable<boolean> {
    return this.isLogado$.asObservable();
  }

  carregarCliente(): void {
    const token = this.obterToken();
    if (!token) return;

    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    this.http.get<Cliente>(`${this.apiUrl}/clientes/perfil`, { headers }).subscribe({
      next: (cliente) => this.clienteLogado$.next(cliente),
      error: () => this.logout(),
    });
  }

  // ========================
  // TOKEN
  // ========================
  obterToken(): string | null {
    return localStorage.getItem("token");
  }

  private salvarToken(token: string) {
    localStorage.setItem("token", token);
  }

  private removerToken() {
    localStorage.removeItem("token");
  }

  estaLogado(): boolean {
    return !!this.obterToken();
  }

  private verificarLogin() {
    if (this.estaLogado()) {
      this.isLogado$.next(true);
      this.carregarCliente();
    }
  }
}
