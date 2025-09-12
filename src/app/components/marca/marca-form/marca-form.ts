import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MarcaService } from '../../../services/marca.service';
import { Marca } from '../../../models/marca.model';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-marca-form',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule],
  templateUrl: './marca-form.html',
  styleUrls: ['./marca-form.css']
})
export class MarcaForm implements OnInit {
  marca: Marca = { id: 0, nome: '' };
  carregando = false;
  salvando = false;
  erro?: string;

  constructor(
    private marcaService: MarcaService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : 0;

    if (id && id > 0) {
      this.carregando = true;
      this.marcaService.buscarPorId(id)
        .pipe(finalize(() => (this.carregando = false)))
        .subscribe({
          next: (dto) => (this.marca = dto),
          error: () => (this.erro = 'Não foi possível carregar a marca.')
        });
    }
  }

  salvar(): void {
    this.erro = undefined;
    this.salvando = true;

    const req$ = this.marca.id && this.marca.id > 0
      ? this.marcaService.atualizar(this.marca.id, this.marca)
      : this.marcaService.salvar(this.marca);

    req$.pipe(finalize(() => (this.salvando = false))).subscribe({
      next: () => this.router.navigate(['/marca']),
      error: () => (this.erro = 'Não foi possível salvar a marca.')
    });
  }

  cancelar(): void {
    this.router.navigate(['/marca']);
  }
}
