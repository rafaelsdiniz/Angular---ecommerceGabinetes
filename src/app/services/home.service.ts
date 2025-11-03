import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Gabinete } from '../models/gabinete.model'; // ou qualquer outro modelo que queira exibir na home

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  private apiUrl = 'http://localhost:8080/home'; // ajuste para sua rota real

  private token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJ1bml0aW5zLWp3dCIsInN1YiI6InJhZmFlbC5kaW5pekBnbWFpbC5jb20iLCJncm91cHMiOlsiQURNSU4iXSwiZXhwIjoxNzY0NzgwMTQ1LCJpYXQiOjE3NjIxODgxNDUsImp0aSI6IjkzOTk4NWUxLWY4MDctNDE4MC1iYzVjLWIxY2E4ZWFjYmI0OCJ9.NJz76ztsW4-QYwPL1Ts9qPF3a0elv5Dk_HYzKs1zGXpW-s9C-nLIM50a15qZu6sBSlcET7bHiddFTsuSJ5OMEpi56LqU-h0c_VciUwAnZX0l8aH1uFGLo9JYjrkljcUYrfVKJ6SrK-hjG-oSqRiBHZJUPv70HVo9-KjibpJtM5Ty7mAao_FkbPBQcl-JB1CJilG5NjOIAqWA5YVoy114n5u3yqCytrv_pMql0V8svUY-mmbeDCHmhM6tKDuPU8Zurj-TKygX7FLfLOHonOTVSFjjvr2Fc5jaZqLvjGMR_vnBSCzWAcf-M_GYD2KS0wIV62S8RB6DOB7XyPUzitupOw';

  private httpOptions = {
    headers: new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    })
  };

  constructor(private http: HttpClient) { }

  // Exemplo: buscar gabinetes em destaque
  buscarDestaques(): Observable<Gabinete[]> {
    return this.http.get<Gabinete[]>(`${this.apiUrl}/destaques`);
  }

  // Você pode adicionar outros métodos conforme necessário, tipo categorias, marcas, etc.
}
