import { Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ActivatedRoute, Router, RouterModule } from '@angular/router'
import { PedidoService } from '../../../services/pedido.service'
import { Pedido } from '../../../models/pedido.model'

@Component({
  selector: 'app-pedido-confirmado',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './pedido-confirmado.component.html',
  styleUrls: ['./pedido-confirmado.component.css']
})
export class PedidoConfirmadoComponent implements OnInit {
  pedidoId: number | null = null
  carregando = false
  erro = ''

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.pedidoId = +params['id']
      if (this.pedidoId) {
        console.log('Pedido confirmado:', this.pedidoId)
      } else {
        this.erro = 'ID do pedido não encontrado'
      }
    })
  }

  verMeuPerfil(): void {
    this.router.navigate(['/perfil'])
  }

  voltarParaLoja(): void {
    this.router.navigate(['/produtos'])
  }
}