import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Modelo } from '../models/modelo.model';

@Injectable({
  providedIn: 'root'
})
export class ModeloService {
  private apiUrl = 'http://localhost:8080/modelos';

  private token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJ1bml0aW5zLWp3dCIsInN1YiI6InJhZmFlbCIsImdyb3VwcyI6WyJBZG0iXSwiZXhwIjoxNzY0NTI5MjA4LCJpYXQiOjE3NjE5MzcyMDgsImp0aSI6ImI4NWZiOTg2LTY1MTktNDJkMi1hZDZjLTc1ZGEyNjZmZGUzZCJ9.C2d5iGEasDXQ-JBJw6EbE6vkeOk35sf45dTx4SUXsnD0xLdflAbCcS25SJP7KDS3fHY6lQDFEewU82se6Hbi_17bf_R1F8RtPS42-aYZde-HOaEyN1gli1ZrIu4wOeRvU_vymgKGRboldJWu2qalktXE5VBrQzNXEOUjK2K9bcfHa3vEoMsPWlUTj_1fJBBp9_Qp4zgGJXx3NKa5Q22J6UPWCOwbDDzS10X47WF-8vbiRaO89fOJ1JSNzuGOALtkUhwdUMpHERAkTnZ89081kCyQL1Zw1-mo5fPYUnTuAH8-x7-nOGGDpqkoZ_vc4gErl_mvdyaivMtPrtHTUEyviA';

  private httpOptions = {
    headers: new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    })
  };

  constructor(private http: HttpClient) { }

  listarTodos(): Observable<Modelo[]> {
    return this.http.get<Modelo[]>(this.apiUrl);
  }

  criar(modelo: Modelo): Observable<Modelo> {
    return this.http.post<Modelo>(this.apiUrl, modelo);
  }

  buscarPorId(id: number): Observable<Modelo> {
    return this.http.get<Modelo>(`${this.apiUrl}/${id}`);
  }

  atualizar(id: number, modelo: Modelo): Observable<Modelo> {
    return this.http.put<Modelo>(`${this.apiUrl}/${id}`, modelo);
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  listarPorMarcaId(marcaId: number): Observable<Modelo[]> {
    return this.http.get<Modelo[]>(`${this.apiUrl}/marca/${marcaId}`);
  }

  buscarPorNome(nome: string): Observable<Modelo[]> {
    return this.http.get<Modelo[]>(`${this.apiUrl}/search/${nome}`);
  }
}
