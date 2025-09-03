import { Component } from '@angular/core';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CategoriaService } from '../../../services/categoria.service';
import { Categoria } from '../../../models/categoria.model';

@Component({
  selector: 'app-categoria-form',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule],
  templateUrl: './categoria-form.html',
})
export class CategoriaFormComponent {
  categoria: Categoria = { id: 0, nome: '', descricao: '' }; // inicializa com todos os campos

  constructor(
    private categoriaService: CategoriaService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  salvar() {
    if (this.categoria.id) {
      this.categoriaService.atualizar(this.categoria.id, this.categoria)
        .subscribe(() => this.router.navigate(['/categorias']));
    } else {
      this.categoriaService.salvar(this.categoria)
        .subscribe(() => this.router.navigate(['/categorias']));
    }
  }

  cancelar() {
    this.router.navigate(['/categorias']);
  }
}
