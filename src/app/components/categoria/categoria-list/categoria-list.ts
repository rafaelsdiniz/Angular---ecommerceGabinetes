import { Component, OnInit } from '@angular/core';
import { CategoriaService } from '../../../services/categoria.service';
import { Categoria } from '../../../models/categoria.model';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-categoria-list',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './categoria-list.html',
})
export class CategoriaListComponent implements OnInit {
  categorias: Categoria[] = [];

  constructor(private categoriaService: CategoriaService) {}

  ngOnInit(): void {
    this.carregarCategorias();
  }

  carregarCategorias() {
    this.categoriaService.listarTodos().subscribe(data => {
      this.categorias = data;
    });
  }

  deletarCategoria(id: number) {
    if (confirm('Tem certeza que deseja deletar esta categoria?')) {
      this.categoriaService.deletar(id).subscribe(() => {
        this.carregarCategorias(); 
      });
    }
  }
}
