import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GabineteService } from '../../../services/gabinete.service';
import { Gabinete } from '../../../models/gabinete.model';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-gabinete-form',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule],
  templateUrl: './gabinete-form.html',
  styleUrls: ['./gabinete-form.css']
})
export class GabineteForm implements OnInit {

  gabinete: Gabinete = { id: 0, nomeExibicao: '', cor: '', preco: 0 };
  carregando = false;
  salvando = false;
  erro?: string;

  constructor(
    private gabineteService: GabineteService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : 0;

    if (id && id > 0) {
      this.carregando = true;
      this.gabineteService.buscarPorId(id)
        .pipe(finalize(() => (this.carregando = false)))
        .subscribe({
          next: (dto) => (this.gabinete = dto),
          error: () => (this.erro = 'Não foi possível carregar o gabinete.')
        });
    }
  }

  salvar(): void {
    this.erro = undefined;
    this.salvando = true;

    const req$ = this.gabinete.id && this.gabinete.id > 0
      ? this.gabineteService.atualizar(this.gabinete.id, this.gabinete)
      : this.gabineteService.salvar(this.gabinete);

    req$.pipe(finalize(() => (this.salvando = false))).subscribe({
      next: () => this.router.navigate(['/gabinete']),
      error: () => (this.erro = 'Não foi possível salvar o gabinete.')
    });
  }

  cancelar(): void {
    this.router.navigate(['/gabinete']);
  }
}
