import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { AuthService, Cliente, Endereco, DadosRegistro } from "../../../services/auth.service";

@Component({
  selector: "app-register",
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"],
})
export class RegisterComponent {
  registerForm: FormGroup;
  erro = "";
  carregando = false;
  mostrarSenha = false;
  mostrarConfirmarSenha = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.registerForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]],
      email: ['', [Validators.required, Validators.email]],
      telefone: ['', [Validators.required, Validators.pattern(/^\d{10,11}$/)]],
      cpf: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      confirmarSenha: ['', [Validators.required]],
      aceitouTermos: [false, [Validators.requiredTrue]],
      enderecos: this.fb.array([this.criarEnderecoFormGroup()])
    }, { validators: this.senhasIguaisValidator });
  }

  criarEnderecoFormGroup(): FormGroup {
    return this.fb.group({
      estado: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(2)]],
      cidade: ['', [Validators.required]],
      bairro: ['', [Validators.required]],
      cep: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
      numero: ['', [Validators.required]],
      complemento: ['']
    });
  }

  senhasIguaisValidator(group: FormGroup) {
    const senha = group.get('senha')?.value;
    const confirmarSenha = group.get('confirmarSenha')?.value;
    return senha === confirmarSenha ? null : { senhasNaoConferem: true };
  }

  get enderecosArray(): FormArray {
    return this.registerForm.get('enderecos') as FormArray;
  }

  onSubmit(): void {
    this.erro = "";

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.markFormGroupTouched(this.registerForm);
      this.erro = "Por favor, preencha todos os campos corretamente";
      return;
    }

    if (this.registerForm.errors?.['senhasNaoConferem']) {
      this.erro = "As senhas não coincidem";
      return;
    }

    this.carregando = true;

    const formValue = this.registerForm.value;

    const dadosRegistro: DadosRegistro = {
      nome: formValue.nome,
      email: formValue.email,
      telefone: formValue.telefone.replace(/\D/g, ""),
      cpf: formValue.cpf.replace(/\D/g, ""),
      senha: formValue.senha,
      enderecos: formValue.enderecos,
    };

    this.authService.registrar(dadosRegistro).subscribe({
      next: () => {
        this.router.navigate(["/login"], {
          queryParams: { message: "Conta criada com sucesso! Faça login para continuar." },
        });
      },
      error: (err) => {
        console.error("[v0] Register error:", err);
        this.erro = err.error?.message || "Erro ao criar conta. Tente novamente.";
        this.carregando = false;
      },
      complete: () => {
        this.carregando = false;
      },
    });
  }

  private markFormGroupTouched(formGroup: FormGroup | FormArray) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();

      if (control instanceof FormGroup || control instanceof FormArray) {
        this.markFormGroupTouched(control);
      }
    });
  }

  adicionarEndereco(): void {
    this.enderecosArray.push(this.criarEnderecoFormGroup());
  }

  removerEndereco(index: number): void {
    if (this.enderecosArray.length > 1) {
      this.enderecosArray.removeAt(index);
    }
  }

  toggleMostrarSenha(): void {
    this.mostrarSenha = !this.mostrarSenha;
  }

  toggleMostrarConfirmarSenha(): void {
    this.mostrarConfirmarSenha = !this.mostrarConfirmarSenha;
  }

  getSenhaForca(): string {
    const senha = this.registerForm.get('senha')?.value || '';
    if (!senha) return "";
    if (senha.length < 6) return "fraca";
    if (senha.length < 10) return "media";
    return "forte";
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  isEnderecoFieldInvalid(index: number, fieldName: string): boolean {
    const field = this.enderecosArray.at(index).get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.registerForm.get(fieldName);
    if (!field || !field.errors) return '';

    if (field.errors['required']) return 'Este campo é obrigatório';
    if (field.errors['email']) return 'Email inválido';
    if (field.errors['minlength']) return `Mínimo ${field.errors['minlength'].requiredLength} caracteres`;
    if (field.errors['maxlength']) return `Máximo ${field.errors['maxlength'].requiredLength} caracteres`;
    if (field.errors['pattern']) {
      if (fieldName === 'telefone') return 'Telefone deve ter 10 ou 11 dígitos';
      if (fieldName === 'cpf') return 'CPF deve ter 11 dígitos';
    }

    return '';
  }

  getEnderecoFieldError(index: number, fieldName: string): string {
    const field = this.enderecosArray.at(index).get(fieldName);
    if (!field || !field.errors) return '';

    if (field.errors['required']) return 'Obrigatório';
    if (field.errors['minlength']) return `Mín. ${field.errors['minlength'].requiredLength}`;
    if (field.errors['maxlength']) return `Máx. ${field.errors['maxlength'].requiredLength}`;
    if (field.errors['pattern'] && fieldName === 'cep') return 'CEP deve ter 8 dígitos';

    return '';
  }
}
