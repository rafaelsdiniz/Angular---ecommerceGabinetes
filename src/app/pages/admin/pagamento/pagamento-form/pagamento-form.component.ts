import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Pedido } from "../../../../models/pedido.model";
import { FormaPagamento } from "../../../../models/enums/formaPagamento";
import { StatusPagamento } from "../../../../models/enums/statusPagamento";
import { PagamentoService } from "../../../../services/pagamento.service";
import { PedidoService } from "../../../../services/pedido.service";
import { Pagamento } from "../../../../models/pagamento.model";

@Component({
  selector: "app-pagamento-form",
  standalone: true,
  templateUrl: "./pagamento-form.html",
  styleUrls: ["./pagamento-form.css"],
  imports: [CommonModule, ReactiveFormsModule],
})
export class PagamentoFormComponent implements OnInit {
  form!: FormGroup;
  pagamentoId: number | null = null;
  loading = false;
  salvando = false;
  pedidos: Pedido[] = [];

  formasPagamento = Object.values(FormaPagamento).filter(
    (val) => typeof val === "string"
  );
  statusPagamentos = Object.values(StatusPagamento).filter(
    (val) => typeof val === "string"
  );

  constructor(
    private fb: FormBuilder,
    private pagamentoService: PagamentoService,
    private pedidoService: PedidoService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.inicializarFormulario();
    this.carregarPedidos();

    this.route.params.subscribe((params) => {
      if (params["id"]) {
        this.pagamentoId = Number(params["id"]);
        this.carregarPagamento();
      }
    });
  }

  inicializarFormulario(): void {
    this.form = this.fb.group({
      pedido: ["", Validators.required],
      formaPagamento: ["", Validators.required],
      statusPagamento: ["", Validators.required],
      valor: ["", [Validators.required, Validators.min(0)]],
      data: ["", Validators.required],
    });
  }

  carregarPedidos(): void {
    this.pedidoService.listarTodos().subscribe({
      next: (pedidos: Pedido[]) => (this.pedidos = pedidos),
      error: (error: any) => console.error("Erro ao carregar pedidos:", error),
    });
  }

  carregarPagamento(): void {
    if (!this.pagamentoId) return;
    this.loading = true;

    this.pagamentoService.buscarPorId(this.pagamentoId).subscribe({
      next: (pagamento: Pagamento) => {
        this.form.patchValue(pagamento);
        this.loading = false;
      },
      error: (error: any) => {
        console.error("Erro ao carregar pagamento:", error);
        this.loading = false;
      },
    });
  }

  salvar(): void {
    if (this.form.invalid) return;

    this.salvando = true;
    const formValue = this.form.value;

    const pagamento: Pagamento = {
      ...formValue,
      pedido: this.pedidos.find((p) => p.id === Number(formValue.pedido)),
    };

    const requisicao = this.pagamentoId
      ? this.pagamentoService.atualizar(this.pagamentoId, pagamento)
      : this.pagamentoService.salvar(pagamento);

    requisicao.subscribe({
      next: () => {
        this.salvando = false;
        this.router.navigate(["/admin/pagamento"]);
      },
      error: (error: any) => {
        console.error("Erro ao salvar pagamento:", error);
        this.salvando = false;
      },
    });
  }

  cancelar(): void {
    this.router.navigate(["/admin/pagamento"]);
  }
}
