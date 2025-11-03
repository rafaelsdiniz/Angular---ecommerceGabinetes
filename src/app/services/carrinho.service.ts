import { Injectable } from '@angular/core';
import { Gabinete } from '../models/gabinete.model';

export interface ItemCarrinho {
  id: number;
  produto: Gabinete;
  quantidade: number;
}

@Injectable({ providedIn: 'root' })
export class CarrinhoService {
  private itens: ItemCarrinho[] = [];

  constructor() {
    const salvo = localStorage.getItem('carrinho');
    if (salvo) this.itens = JSON.parse(salvo);
  }

  obterItens(): ItemCarrinho[] {
    return this.itens;
  }

  adicionarItem(item: ItemCarrinho): void {
    const existente = this.itens.find(i => i.id === item.id);
    if (existente) {
      existente.quantidade += item.quantidade;
    } else {
      this.itens.push({ ...item });
    }
    this.salvar();
  }

  atualizarQuantidade(id: number, quantidade: number): void {
    const item = this.itens.find(i => i.id === id);
    if (item) {
      item.quantidade = quantidade;
      if (item.quantidade <= 0) this.removerItem(id);
      else this.salvar();
    }
  }

  removerItem(id: number): void {
    this.itens = this.itens.filter(i => i.id !== id);
    this.salvar();
  }

  limparCarrinho(): void {
    this.itens = [];
    localStorage.removeItem('carrinho');
  }

  get total(): number {
    return this.itens.reduce((acc, i) => acc + i.produto.preco * i.quantidade, 0);
  }

  get totalItens(): number {
    return this.itens.reduce((acc, i) => acc + i.quantidade, 0);
  }

  private salvar() {
    localStorage.setItem('carrinho', JSON.stringify(this.itens));
  }
}
