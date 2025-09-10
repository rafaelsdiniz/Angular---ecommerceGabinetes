import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CategoriaService } from '../../../services/categoria.service';
import { Categoria } from '../../../models/categoria.model';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-categoria-form',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule],
  templateUrl: './categoria-form.html', 
  styleUrls: ['./categoria-form.css'],
})
export class CategoriaFormComponent implements OnInit {
  categoria: Categoria = { id: 0, nome: '', descricao: '' };
  carregando = false;
  salvando = false;
  erro?: string;

  constructor(
    private categoriaService: CategoriaService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // se a rota tiver um :id (ex.: /categorias/123/editar) carrega os dados
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : 0;

    if (id && id > 0) {
      this.carregando = true;
      this.categoriaService.buscarPorId(id)
        .pipe(finalize(() => (this.carregando = false)))
        .subscribe({
          next: (dto) => (this.categoria = dto),
          error: () => (this.erro = 'Não foi possível carregar a categoria.')
        });
    }
  }

  salvar(): void {
    this.erro = undefined;
    this.salvando = true;

    const req$ = this.categoria.id && this.categoria.id > 0
      ? this.categoriaService.atualizar(this.categoria.id, this.categoria)
      : this.categoriaService.salvar(this.categoria);

    req$.pipe(finalize(() => (this.salvando = false))).subscribe({
      next: () => this.router.navigate(['/categorias']),
      error: () => (this.erro = 'Não foi possível salvar a categoria.')
    });
  }

  cancelar(): void {
    this.router.navigate(['/categorias']);
  }
}
