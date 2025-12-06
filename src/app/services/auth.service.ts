import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import { Observable, BehaviorSubject, tap, map, catchError, of } from "rxjs";
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
  perfil: string;
  enderecos?: Endereco[];
}

export interface DadosRegistro {
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  senha: string;
  perfil?: string; 
}

export interface AtualizarPerfilDto {
  nome: string;
  email: string;
  telefone: string;
}

export interface TrocarSenhaDto {
  senhaAtual: string;
  novaSenha: string;
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

  
  private validarToken(token: string | null): boolean {
    if (!token) return false;
    
    if (token.length > 2000) {
      console.warn('Token muito grande, possivelmente corrompido');
      this.limparTokenCorrompido();
      return false;
    }
    
    const parts = token.split('.');
    if (parts.length !== 3) {
      this.limparTokenCorrompido();
      return false;
    }
    
    return true;
  }

  private limparTokenCorrompido(): void {
    console.log('Limpando token corrompido...');
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    this.isLogado$.next(false);
    this.clienteLogado$.next(null);
  }

  login(email: string, senha: string): Observable<Cliente> {
    return this.http
      .post<Cliente>(`${this.apiUrl}/auth`, { email, senha }, { observe: 'response' })
      .pipe(
        tap((resp: HttpResponse<Cliente>) => {
          const token = resp.headers.get('Authorization')?.replace('Bearer ', '');
          const cliente = resp.body;

          if (token && cliente && this.validarToken(token)) {
            this.salvarToken(token);
            this.isLogado$.next(true);
            this.clienteLogado$.next(cliente);

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


  registrar(dados: DadosRegistro): Observable<Cliente> {
    return this.http.post<Cliente>(`${this.apiUrl}/clientes`, dados);
  }


  logout(): void {
    this.removerToken();
    this.isLogado$.next(false);
    this.clienteLogado$.next(null);
    this.router.navigate(["/login"]);
  }


  getCliente(): Observable<Cliente | null> {
    return this.clienteLogado$.asObservable();
  }

  isLogado(): Observable<boolean> {
    return this.isLogado$.asObservable();
  }

  carregarCliente(): void {
    const token = this.obterToken();
    if (!token || !this.validarToken(token)) {
      this.limparTokenCorrompido();
      return;
    }

    this.http.get<Cliente>(`${this.apiUrl}/clientes/meu-perfil`, { 
      headers: this.obterHeaders() 
    }).subscribe({
      next: (cliente) => {
        this.clienteLogado$.next(cliente);
        this.isLogado$.next(true);
      },
      error: (err) => {
        console.error('Erro ao carregar perfil:', err);
        if (err.status === 401 || err.status === 403 || err.status === 431) {
          this.limparTokenCorrompido();
        } else {
          this.logout();
        }
      },
    });
  }


  obterToken(): string | null {
    const token = localStorage.getItem("token");
    return this.validarToken(token) ? token : null;
  }

  obterHeaders(): HttpHeaders {
    const token = this.obterToken();
    let headers = new HttpHeaders();
    
    headers = headers.set('Content-Type', 'application/json');
    
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    
    return headers;
  }

  private salvarToken(token: string) {
    if (this.validarToken(token)) {
      localStorage.setItem("token", token);
    }
  }

  private removerToken() {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
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

  atualizarPerfil(dados: AtualizarPerfilDto): Observable<Cliente> {
    return this.http.put<Cliente>(`${this.apiUrl}/clientes/meu-perfil`, dados, { 
      headers: this.obterHeaders() 
    }).pipe(
      tap((clienteAtualizado) => {
        this.clienteLogado$.next(clienteAtualizado);
      }),
      catchError((err) => {
        if (err.status === 401 || err.status === 403 || err.status === 431) {
          this.limparTokenCorrompido();
        }
        throw err;
      })
    );
  }

  trocarSenha(dados: TrocarSenhaDto): Observable<any> {
    return this.http.put<void>(`${this.apiUrl}/clientes/minha-senha`, dados, { 
      headers: this.obterHeaders() 
    }).pipe(
      catchError((err) => {
        if (err.status === 401 || err.status === 403 || err.status === 431) {
          this.limparTokenCorrompido();
        }
        throw err;
      })
    );
  }


  getUsuarioLogado(): Cliente | null {
    return this.clienteLogado$.value;
  }

  limparTudo(): void {
    console.log('Limpando todos os dados de autenticação...');
    this.removerToken();
    this.isLogado$.next(false);
    this.clienteLogado$.next(null);
    
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
  }
}