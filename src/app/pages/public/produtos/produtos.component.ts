import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { GabineteService } from "../../../services/gabinete.service";
import { Gabinete } from "../../../models/gabinete.model";
import { Router } from "@angular/router";

@Component({
  selector: "app-produtos",
  templateUrl: "./produtos.component.html",
  styleUrls: ["./produtos.component.css"],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class ProdutosComponent implements OnInit {
  gabinetes: Gabinete[] = [];
  filtroMarca = "";
  loading = true;
  erro = "";

  constructor(
    private gabineteService: GabineteService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarTodos();
  }

  carregarTodos(): void {
    this.loading = true;
    this.erro = "";
    this.gabineteService.listarTodos().subscribe({
      next: (dados) => {
        this.gabinetes = dados;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.erro = "Erro ao carregar gabinetes. Tente novamente.";
        this.loading = false;
      },
    });
  }

  buscarPorMarca(): void {
    if (!this.filtroMarca.trim()) {
      this.carregarTodos();
      return;
    }

    this.loading = true;
    this.erro = "";
    this.gabineteService.buscarPorMarca(this.filtroMarca).subscribe({
      next: (dados) => {
        this.gabinetes = dados;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.erro = "Erro ao buscar gabinetes pela marca.";
        this.loading = false;
      },
    });
  }

  verDetalhes(gabineteId: number | undefined): void {
    if (gabineteId) {
      this.router.navigate(["gabinete-detail", gabineteId]);
    }
  }
}
