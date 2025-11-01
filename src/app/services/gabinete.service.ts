import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { Observable } from "rxjs"
import { Gabinete } from "../models/gabinete.model"

@Injectable({
  providedIn: "root",
})
export class GabineteService {
  private apiUrl = "http://localhost:8080/gabinetes"

  private token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJ1bml0aW5zLWp3dCIsInN1YiI6InJhZmFlbCIsImdyb3VwcyI6WyJBZG0iXSwiZXhwIjoxNzY0NTI5MjA4LCJpYXQiOjE3NjE5MzcyMDgsImp0aSI6ImI4NWZiOTg2LTY1MTktNDJkMi1hZDZjLTc1ZGEyNjZmZGUzZCJ9.C2d5iGEasDXQ-JBJw6EbE6vkeOk35sf45dTx4SUXsnD0xLdflAbCcS25SJP7KDS3fHY6lQDFEewU82se6Hbi_17bf_R1F8RtPS42-aYZde-HOaEyN1gli1ZrIu4wOeRvU_vymgKGRboldJWu2qalktXE5VBrQzNXEOUjK2K9bcfHa3vEoMsPWlUTj_1fJBBp9_Qp4zgGJXx3NKa5Q22J6UPWCOwbDDzS10X47WF-8vbiRaO89fOJ1JSNzuGOALtkUhwdUMpHERAkTnZ89081kCyQL1Zw1-mo5fPYUnTuAH8-x7-nOGGDpqkoZ_vc4gErl_mvdyaivMtPrtHTUEyviA';

  private httpOptions = {
    headers: new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    })
  };

  constructor(private http: HttpClient) {}

  listarTodos(): Observable<Gabinete[]> {
    return this.http.get<Gabinete[]>(this.apiUrl)
  }

  salvar(gabinete: Gabinete): Observable<Gabinete> {
    return this.http.post<Gabinete>(this.apiUrl, gabinete)
  }

  buscarPorId(id: number): Observable<Gabinete> {
    return this.http.get<Gabinete>(`${this.apiUrl}/${id}`)
  }

  atualizar(id: number, gabinete: Gabinete): Observable<Gabinete> {
    return this.http.put<Gabinete>(`${this.apiUrl}/${id}`, gabinete)
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
  }

  buscarPorMarca(marca: string): Observable<Gabinete[]> {
    const params = new HttpParams().set("marca", marca)
    return this.http.get<Gabinete[]>(`${this.apiUrl}/marca`, { params })
  }

  buscarPorFaixaPreco(precoMin: number, precoMax: number): Observable<Gabinete[]> {
    const params = new HttpParams().set("precoMin", precoMin.toString()).set("precoMax", precoMax.toString())
    return this.http.get<Gabinete[]>(`${this.apiUrl}/faixa-preco`, { params })
  }

  buscarPorCor(cor: string): Observable<Gabinete[]> {
    const params = new HttpParams().set("cor", cor)
    return this.http.get<Gabinete[]>(`${this.apiUrl}/cor`, { params })
  }

  buscarPorFormato(formato: string): Observable<Gabinete[]> {
    const params = new HttpParams().set("formato", formato)
    return this.http.get<Gabinete[]>(`${this.apiUrl}/formato`, { params })
  }

  buscarPorNome(nome: string): Observable<Gabinete[]> {
    const params = new HttpParams().set("nome", nome)
    return this.http.get<Gabinete[]>(`${this.apiUrl}/nome`, { params })
  }

  buscarPorCategoria(categoriaId: number): Observable<Gabinete[]> {
    return this.http.get<Gabinete[]>(`${this.apiUrl}/categoria/${categoriaId}`)
  }

  listarOrdenadoPorPreco(crescente = true): Observable<Gabinete[]> {
    const params = new HttpParams().set("crescente", crescente.toString())
    return this.http.get<Gabinete[]>(`${this.apiUrl}/ordenado-preco`, { params })
  }

  listarOrdenadoPorNome(): Observable<Gabinete[]> {
    return this.http.get<Gabinete[]>(`${this.apiUrl}/ordenado-nome`)
  }
}
