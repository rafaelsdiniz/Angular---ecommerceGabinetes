import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of, throwError } from 'rxjs';
import { Pedido } from '../models/pedido.model';
import { StatusPedido } from '../models/enums/statusPedido';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  private apiUrl = 'http://localhost:8080/pedidos';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.obterToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token || ''}`,
      'Content-Type': 'application/json',
    });
  }

  criarPedido(pedidoData: any): Observable<any> {
    console.log('📦 Enviando pedido para backend:', pedidoData);

    const cliente = this.authService.getUsuarioLogado();

    if (!cliente) {
      console.error("❌ Nenhum cliente logado! (JWT inválido)");
      return throwError(() => new Error("Cliente não autenticado"));
    }

    const payload = {
      endereco: pedidoData.endereco,
      itens: pedidoData.itens.map((item: any) => ({
        idGabinete: item.idGabinete,
        quantidade: item.quantidade
      }))
    };

    console.log('📤 Payload final enviado ao backend:', payload);

    return this.http.post<any>(`${this.apiUrl}`, payload, {
      headers: this.getHeaders()
    }).pipe(
      catchError((error) => {
        console.error('❌ Erro ao criar pedido:', error);
        return throwError(() => error);
      })
    );
  }

  salvar(pedidoData: any): Observable<any> {
    return this.criarPedido(pedidoData);
  }

  listarTodos(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(this.apiUrl, {
      headers: this.getHeaders(),
    }).pipe(
      catchError((error) => {
        console.error('❌ Erro ao listar pedidos:', error);
        return of(this.mockPedidos());
      })
    );
  }

  buscarPorId(id: number): Observable<Pedido> {
    return this.http.get<Pedido>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders(),
    }).pipe(
      catchError((error) => {
        console.error(`❌ Erro ao buscar pedido ${id}:`, error);
        return of(this.mockPedido(id));
      })
    );
  }

  atualizar(id: number, pedido: Pedido): Observable<Pedido> {
    return this.http.put<Pedido>(`${this.apiUrl}/${id}`, pedido, {
      headers: this.getHeaders(),
    }).pipe(
      catchError((error) => {
        console.error(`❌ Erro ao atualizar pedido ${id}:`, error);
        return throwError(() => error);
      })
    );
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders(),
    }).pipe(
      catchError((error) => {
        console.error(`❌ Erro ao deletar pedido ${id}:`, error);
        return throwError(() => error);
      })
    );
  }

  finalizarPedido(id: number): Observable<Pedido> {
    return this.http.post<Pedido>(`${this.apiUrl}/${id}/finalizar`, {}, {
      headers: this.getHeaders(),
    }).pipe(
      catchError((error) => {
        console.error(`❌ Erro ao finalizar pedido ${id}:`, error);
        return throwError(() => error);
      })
    );
  }

  cancelarPedido(id: number): Observable<Pedido> {
    return this.http.post<Pedido>(`${this.apiUrl}/${id}/cancelar`, {}, {
      headers: this.getHeaders(),
    }).pipe(
      catchError((error) => {
        console.error(`❌ Erro ao cancelar pedido ${id}:`, error);
        return throwError(() => error);
      })
    );
  }

  atualizarStatus(id: number, status: StatusPedido): Observable<Pedido> {
    return this.http.put<Pedido>(`${this.apiUrl}/${id}/status?status=${status}`, {}, {
      headers: this.getHeaders(),
    }).pipe(
      catchError((error) => {
        console.error(`❌ Erro ao atualizar status do pedido ${id}:`, error);
        return throwError(() => error);
      })
    );
  }

  buscarPorStatus(status: StatusPedido): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(`${this.apiUrl}/status/${status}`, {
      headers: this.getHeaders(),
    }).pipe(
      catchError((error) => {
        console.error(`❌ Erro ao buscar pedidos por status ${status}:`, error);
        return of([]);
      })
    );
  }

  buscarHistoricoCliente(clienteId: number): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(`${this.apiUrl}/cliente/${clienteId}/historico`, {
      headers: this.getHeaders(),
    }).pipe(
      catchError((error) => {
        console.error(`❌ Erro ao buscar histórico do cliente ${clienteId}:`, error);
        return of(this.mockPedidos());
      })
    );
  }

  listarPorClienteLogado(): Observable<Pedido[]> {
  return this.http.get<Pedido[]>(`${this.apiUrl}/meus-pedidos`, {
    headers: this.getHeaders(),
  }).pipe(
    catchError((error) => {
      console.error('❌ Erro ao listar pedidos do cliente:', error);
      return of([]);
    })
  );
}


  private mockPedidos(): Pedido[] {
    return [];
  }

  private mockPedido(id: number): Pedido {
    return {
      id,
      cliente: null as any,
      dataPedido: new Date(),
      itens: [],
      valorTotal: 0,
      status: StatusPedido.PENDENTE,
      endereco: null as any
    };
  }
}
