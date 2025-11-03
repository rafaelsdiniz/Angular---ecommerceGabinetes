import { Component, OnInit, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { MatPaginator, MatPaginatorModule, PageEvent } from "@angular/material/paginator";
import { Pagamento } from "../../../../models/pagamento.model";
import { PagamentoService } from "../../../../services/pagamento.service";

@Component({
  selector: "app-pagamento-list",
  standalone: true,
  templateUrl: "./pagamento-list.html",
  styleUrls: ["./pagamento-list.css"],
  imports: [CommonModule, FormsModule, MatPaginatorModule],
})
export class PagamentoListComponent implements OnInit {
  pagamentos: Pagamento[] = [];
  pagamentosExibidos: Pagamento[] = [];
  busca = "";
  loading = false;
  deletando = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  pageSize = 10;
  pageIndex = 0;
  totalItems = 0;

  constructor(
    private pagamentoService: PagamentoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarPagamentos();
  }

  carregarPagamentos(): void {
    this.loading = true;
    this.pagamentoService.listarTodos().subscribe({
      next: (pagamentos: Pagamento[]) => {
        this.pagamentos = pagamentos;
        this.totalItems = pagamentos.length;
        this.aplicarFiltro();
        this.loading = false;
      },
      error: (error: any) => {
        console.error("Erro ao carregar pagamentos:", error);
        this.loading = false;
      },
    });
  }

  aplicarFiltro(): void {
    let filtrados = this.pagamentos;

    if (this.busca.trim()) {
      const buscaLower = this.busca.toLowerCase();
      filtrados = filtrados.filter(
        (p) =>
          p.id?.toString().includes(buscaLower) ||
          p.formaPagamento?.toLowerCase().includes(buscaLower) ||
          p.statusPagamento?.toLowerCase().includes(buscaLower) ||
          p.valor?.toString().includes(buscaLower)
      );
    }

    this.totalItems = filtrados.length;
    this.pageIndex = 0;
    this.atualizarExibicao(filtrados);
  }

  atualizarExibicao(dados: Pagamento[]): void {
    const inicio = this.pageIndex * this.pageSize;
    const fim = inicio + this.pageSize;
    this.pagamentosExibidos = dados.slice(inicio, fim);
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.aplicarFiltro();
  }

  editar(id: number | undefined): void {
    if (id) this.router.navigate(["/admin/pagamento/form", id]);
  }

  deletar(id: number | undefined): void {
    if (!id) return;
    if (confirm("Tem certeza que deseja deletar este pagamento?")) {
      this.deletando = true;
      this.pagamentoService.deletar(id).subscribe({
        next: () => {
          this.carregarPagamentos();
          this.deletando = false;
        },
        error: (error: any) => {
          console.error("Erro ao deletar pagamento:", error);
          this.deletando = false;
        },
      });
    }
  }

  novo(): void {
    this.router.navigate(["/admin/pagamento/form"]);
  }

  formatarValor(valor: number): string {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor);
  }

  formatarData(data: Date): string {
    return new Intl.DateTimeFormat("pt-BR").format(new Date(data));
  }
}
