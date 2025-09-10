import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Gabinete } from '../models/gabinete.model'; // ou qualquer outro modelo que queira exibir na home

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  private apiUrl = 'http://localhost:8080/home'; // ajuste para sua rota real

  constructor(private http: HttpClient) { }

  // Exemplo: buscar gabinetes em destaque
  buscarDestaques(): Observable<Gabinete[]> {
    return this.http.get<Gabinete[]>(`${this.apiUrl}/destaques`);
  }

  // Você pode adicionar outros métodos conforme necessário, tipo categorias, marcas, etc.
}
