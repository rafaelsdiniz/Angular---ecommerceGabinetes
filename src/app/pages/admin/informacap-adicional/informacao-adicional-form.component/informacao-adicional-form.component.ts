// src/app/pages/admin/informacao-adicional/form/informacao-adicional-form.component.ts

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

// Forms
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

// Common
import { NgIf } from '@angular/common';

// Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatError } from '@angular/material/form-field';

import { InformacaoAdicionalService } from '../../../../services/informacao-adicional.service';
import { InformacaoAdicional } from '../../../../models/informacaoAdicional.model';

@Component({
  selector: 'app-informacao-adicional-form',
  standalone: true,
  templateUrl: './informacao-adicional-form.component.html',
  styleUrls: ['./informacao-adicional-form.component.css'],
  imports: [
    // Common
    NgIf,

    // Forms
    ReactiveFormsModule,

    // Material
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ]
})
export class InformacaoAdicionalFormComponent implements OnInit {

  informacaoForm: FormGroup;
  isEdicao = false;
  informacaoId?: number;
  carregando = false;
  salvando = false;
  erro = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private informacaoAdicionalService: InformacaoAdicionalService
  ) {
    this.informacaoForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.maxLength(100)]],
      descricao: ['', [Validators.required, Validators.maxLength(500)]],
      gabineteId: ['', [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEdicao = true;
      this.informacaoId = +id;
      this.carregarInformacao();
    }
  }

  carregarInformacao(): void {
    if (!this.informacaoId) return;

    this.carregando = true;

    this.informacaoAdicionalService.buscarPorId(this.informacaoId).subscribe({
      next: (informacao) => {
        this.informacaoForm.patchValue({
          titulo: informacao.titulo,
          descricao: informacao.descricao,
          gabineteId: informacao.gabineteId
        });
        this.carregando = false;
      },
      error: () => {
        this.erro = 'Erro ao carregar informação adicional';
        this.carregando = false;
      }
    });
  }

  salvar(): void {
    if (this.informacaoForm.invalid) {
      this.informacaoForm.markAllAsTouched();
      return;
    }

    this.salvando = true;
    this.erro = '';

    const informacaoData: InformacaoAdicional = this.informacaoForm.value;

    if (this.isEdicao && this.informacaoId) {
      this.informacaoAdicionalService.atualizar(this.informacaoId, informacaoData).subscribe({
        next: () => this.router.navigate(['/informacoes-adicionais']),
        error: () => {
          this.erro = 'Erro ao atualizar informação adicional';
          this.salvando = false;
        }
      });

    } else {
      this.informacaoAdicionalService.criar(informacaoData).subscribe({
        next: () => this.router.navigate(['/informacoes-adicionais']),
        error: () => {
          this.erro = 'Erro ao criar informação adicional';
          this.salvando = false;
        }
      });
    }
  }

  cancelar(): void {
    this.router.navigate(['/informacoes-adicionais']);
  }

  // Getters
  get titulo() { return this.informacaoForm.get('titulo'); }
  get descricao() { return this.informacaoForm.get('descricao'); }
  get gabineteId() { return this.informacaoForm.get('gabineteId'); }
}
