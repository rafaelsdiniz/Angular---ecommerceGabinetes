import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Gabinete } from '../models/gabinete.model';

@Injectable({
  providedIn: 'root'
})
export class GabineteService {
  private apiUrl = 'http://localhost:8080/gabinetes';

  constructor(private http: HttpClient) { }

  listarTodos(): Observable<Gabinete[]> {
    return this.http.get<Gabinete[]>(this.apiUrl);
  }

  salvar(gabinete: Gabinete): Observable<Gabinete> {
    return this.http.post<Gabinete>(this.apiUrl, gabinete);
  }

  buscarPorId(id: number): Observable<Gabinete> {
    return this.http.get<Gabinete>(`${this.apiUrl}/${id}`);
  }

  atualizar(id: number, gabinete: Gabinete): Observable<Gabinete> {
    return this.http.put<Gabinete>(`${this.apiUrl}/${id}`, gabinete);
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
