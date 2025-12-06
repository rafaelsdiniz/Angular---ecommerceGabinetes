
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { finalize } from "rxjs/operators";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { Gabinete } from "../../../../models/gabinete.model";
import { GabineteService } from "../../../../services/gabinete.service";
import { MinioHelperService } from "../../../../services/minio-helper.service";
import { AuthService } from "../../../../services/auth.service";

@Component({
  selector: "app-gabinete-form",
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    RouterModule,
  ],
  templateUrl: "./gabinete-form.component.html",
  styleUrls: ["./gabinete-form.component.css"],
})
export class GabineteFormComponent implements OnInit {
  gabineteForm: FormGroup;
  carregando = false;
  salvando = false;
  uploadando = false;
  erro?: string;
  isEdicao = false;
  imagemPreviewUrl?: string;
  gabineteId?: number;
  imagemKeyAtual?: string;
  usuarioLogado: any = null;

  constructor(
    private gabineteService: GabineteService,
    private minioHelper: MinioHelperService,
    private authService: AuthService,
    public router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.gabineteForm = this.fb.group({
      nomeExibicao: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]],
      marca: ['', [Validators.required]],
      preco: [0, [Validators.required, Validators.min(0.01)]],
      cor: ['', [Validators.required]],
      formato: [''],
      altura: [null],
      largura: [null],
      peso: [null],
      descricao: [''],
      imagemKey: ['']
    });
  }

  ngOnInit(): void {
    this.authService.getCliente().subscribe(cliente => {
      this.usuarioLogado = cliente;
      
      if (!this.usuarioLogado) {
        this.erro = "Você precisa estar logado para acessar esta página.";
        return;
      }

      if (this.usuarioLogado.perfil !== 'ADMIN') {
        this.erro = "Apenas administradores podem gerenciar gabinetes.";
        return;
      }

      const idParam = this.route.snapshot.paramMap.get("id");
      const id = idParam ? Number(idParam) : 0;

      if (id && id > 0) {
        this.isEdicao = true;
        this.gabineteId = id;
        this.carregarGabinete(id);
      }
    });
  }

  private carregarGabinete(id: number): void {
    this.carregando = true;
    this.gabineteService
      .buscarPorId(id)
      .pipe(finalize(() => (this.carregando = false)))
      .subscribe({
        next: (gabinete) => {
          this.gabineteForm.patchValue({
            nomeExibicao: gabinete.nomeExibicao,
            marca: gabinete.marca,
            preco: gabinete.preco,
            cor: gabinete.cor,
            formato: gabinete.formato || '',
            altura: gabinete.altura || null,
            largura: gabinete.largura || null,
            peso: gabinete.peso || null,
            descricao: gabinete.descricao || '',
            imagemKey: gabinete.imagemKey || ''
          });

          this.imagemKeyAtual = gabinete.imagemKey;
          this.imagemPreviewUrl = gabinete.imagemUrl;
        },
        error: (error) => {
          console.error('Erro ao carregar gabinete:', error);
          if (error.status === 401) {
            this.erro = "Sessão expirada. Faça login novamente.";
            this.authService.logout();
            this.router.navigate(['/login']);
          } else {
            this.erro = "Não foi possível carregar o gabinete.";
          }
        }
      });
  }

  async onFileSelected(event: Event): Promise<void> {
    if (!this.usuarioLogado) {
      this.erro = "Você precisa estar logado para fazer upload de imagens.";
      return;
    }

    if (this.usuarioLogado.perfil !== 'ADMIN') {
      this.erro = "Apenas administradores podem fazer upload de imagens.";
      return;
    }

    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];
    
    const validation = this.minioHelper.validateImageFile(file);
    if (!validation.isValid) {
      this.erro = validation.error;
      return;
    }

    this.erro = undefined;
    this.uploadando = true;

    try {
      const previewBase64 = await this.minioHelper.fileToBase64(file);
      this.imagemPreviewUrl = previewBase64;

      const resultado = await this.minioHelper.uploadOptimizedImage(file);
      
      this.gabineteForm.patchValue({ imagemKey: resultado.fileKey });
      this.imagemKeyAtual = resultado.fileKey;
      
      this.imagemPreviewUrl = resultado.fileUrl;

      console.log('✅ Upload realizado:', resultado.fileName);

    } catch (error: any) {
      console.error('❌ Erro no upload:', error);
      
      if (error.status === 401) {
        this.erro = "Sessão expirada. Faça login novamente para fazer upload de imagens.";
        this.authService.logout();
        this.router.navigate(['/login']);
      } else if (error.status === 413) {
        this.erro = "Arquivo muito grande. Tente uma imagem menor.";
      } else if (error.status === 403) {
        this.erro = "Permissão negada. Apenas administradores podem fazer upload.";
      } else if (error.status === 0) {
        this.erro = "Servidor indisponível. Verifique se o backend está rodando.";
      } else {
        this.erro = "Erro ao fazer upload da imagem. Tente novamente.";
      }
      
      this.imagemPreviewUrl = undefined;
    } finally {
      this.uploadando = false;
    }
  }

  salvar(): void {
    if (!this.usuarioLogado || this.usuarioLogado.perfil !== 'ADMIN') {
      this.erro = "Apenas administradores podem salvar gabinetes.";
      return;
    }

    this.erro = undefined;

    if (this.gabineteForm.invalid) {
      this.gabineteForm.markAllAsTouched();
      this.erro = "Por favor, preencha todos os campos obrigatórios corretamente.";
      return;
    }

    this.salvando = true;

    const gabinete: Gabinete = {
      ...this.gabineteForm.value,
      id: this.gabineteId
    };

    const req$ = this.isEdicao && gabinete.id
      ? this.gabineteService.atualizar(gabinete.id, gabinete)
      : this.gabineteService.salvar(gabinete);

    req$.pipe(finalize(() => (this.salvando = false))).subscribe({
      next: () => {
        console.log('✅ Gabinete salvo com sucesso!');
        this.router.navigate(["admin/gabinetes"]);
      },
      error: (error) => {
        console.error('❌ Erro ao salvar gabinete:', error);
        
        if (error.status === 401) {
          this.erro = "Sessão expirada. Faça login novamente.";
          this.authService.logout();
          this.router.navigate(['/login']);
        } else if (error.status === 403) {
          this.erro = "Permissão negada. Apenas administradores podem salvar gabinetes.";
        } else {
          this.erro = "Não foi possível salvar o gabinete. Verifique os dados e tente novamente.";
        }
      },
    });
  }

  cancelar(): void {
    this.router.navigate(["admin/gabinetes"]);
  }

  async removerImagem(): Promise<void> {
    if (!this.usuarioLogado || this.usuarioLogado.perfil !== 'ADMIN') {
      this.erro = "Apenas administradores podem remover imagens.";
      return;
    }

    if (this.isEdicao && this.gabineteId && this.imagemKeyAtual) {
      try {
        await this.minioHelper.deleteFile(this.imagemKeyAtual).toPromise();

        const gabineteAtualizado = await this.gabineteService.deletarImagem(this.gabineteId).toPromise();
        
        this.gabineteForm.patchValue({ imagemKey: '' });
        this.imagemPreviewUrl = undefined;
        this.imagemKeyAtual = undefined;

        console.log('✅ Imagem removida com sucesso!');

      } catch (error: any) {
        console.error('❌ Erro ao remover imagem:', error);
        
        if (error.status === 401) {
          this.erro = "Sessão expirada. Faça login novamente.";
          this.authService.logout();
          this.router.navigate(['/login']);
        } else if (error.status === 403) {
          this.erro = "Permissão negada. Apenas administradores podem remover imagens.";
        } else {
          this.erro = "Erro ao remover imagem. Tente novamente.";
        }
      }
    } else {
      this.gabineteForm.patchValue({ imagemKey: '' });
      this.imagemPreviewUrl = undefined;
      this.imagemKeyAtual = undefined;
    }
  }

  testarConexaoMinio(): void {
    if (!this.usuarioLogado || this.usuarioLogado.perfil !== 'ADMIN') {
      this.erro = "Apenas administradores podem testar a conexão.";
      return;
    }

    this.minioHelper.testConnection().subscribe({
      next: (result) => {
        console.log('✅ MinIO conectado:', result.message);
        alert('Conexão com MinIO: OK!');
      },
      error: (error) => {
        console.error('❌ MinIO offline:', error);
        
        if (error.status === 401) {
          this.erro = "Sessão expirada. Faça login novamente.";
          this.authService.logout();
          this.router.navigate(['/login']);
        } else {
          alert('Erro na conexão com MinIO. Verifique se o serviço está rodando.');
        }
      }
    });
  }

  verificarAutenticacao(): void {
    const token = this.authService.obterToken();
    console.log('Token presente:', !!token);
    console.log('Usuário logado:', this.usuarioLogado);
    console.log('É admin:', this.usuarioLogado?.perfil === 'ADMIN');
    
    if (!token) {
      this.erro = "Token não encontrado. Faça login novamente.";
    } else if (!this.usuarioLogado) {
      this.erro = "Usuário não carregado. Recarregue a página.";
    } else if (this.usuarioLogado.perfil !== 'ADMIN') {
      this.erro = "Usuário não é administrador.";
    } else {
      this.erro = undefined;
      alert('Autenticação: OK!');
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.gabineteForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.gabineteForm.get(fieldName);
    if (!field || !field.errors) return '';

    if (field.errors['required']) return 'Este campo é obrigatório';
    if (field.errors['minlength']) return `Mínimo ${field.errors['minlength'].requiredLength} caracteres`;
    if (field.errors['maxlength']) return `Máximo ${field.errors['maxlength'].requiredLength} caracteres`;
    if (field.errors['min']) return `Valor mínimo: ${field.errors['min'].min}`;

    return '';
  }

  podeFazerUpload(): boolean {
    return this.usuarioLogado && this.usuarioLogado.perfil === 'ADMIN' && !this.uploadando;
  }

  podeSalvar(): boolean {
    return this.usuarioLogado && 
           this.usuarioLogado.perfil === 'ADMIN' && 
           !this.salvando && 
           !this.uploadando && 
           this.gabineteForm.valid;
  }
}