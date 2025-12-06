import { Injectable } from "@angular/core";
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { map, take } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AdminGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.authService.getCliente().pipe(
      take(1), 
      map((cliente) => {
        if (cliente && cliente.perfil === "ADMIN") {
          return true;
        }

        this.router.navigate(["/"]);
        return false;
      })
    );
  }
}
