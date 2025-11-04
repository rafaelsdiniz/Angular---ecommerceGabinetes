import { inject } from '@angular/core';
import {
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const authService = inject(AuthService);
  const token = authService.obterToken();

  // 🔓 Endpoints públicos (sem token)
  const rotasPublicas = [
    '/gabinetes',
    '/auth',
    '/clientes', // cadastro público
  ];

  // Se for rota pública, não adiciona o token
  const isPublic = rotasPublicas.some((rota) => req.url.includes(rota));

  if (!isPublic && token) {
    // 🔐 Clona a requisição com cabeçalho Authorization
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next(cloned);
  }

  // 👇 Se for rota pública, segue sem alterar
  return next(req);
};
