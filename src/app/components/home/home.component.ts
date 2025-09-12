import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

interface Product {
  id: number;
  title: string;
  subtitle: string;
  img: string;
  price: string;
  badge?: string;
  description?: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
  search = '';

  // ano atual para exibir no footer
  currentYear: number = new Date().getFullYear();

  // exemplo de produtos
  products: Product[] = [
    { id: 1, title: 'Gabinete Gamer Alpha', subtitle: 'Mid-Tower | RGB', img: 'assets/gabinete1.png', price: 'R$ 599,00', badge: 'Novo', description: 'Fluxo de ar otimizado e painéis em vidro temperado.' },
    { id: 2, title: 'Gabinete Thunder', subtitle: 'Full-Tower | Silence', img: 'assets/gabinete2.png', price: 'R$ 749,00', badge: 'Promo', description: 'Isolamento acústico e suporte a placas E-ATX.' },
    { id: 3, title: 'Gabinete Compact', subtitle: 'Mini-ITX | Premium', img: 'assets/gabinete3.png', price: 'R$ 499,00', description: 'Design compacto com ótimo aproveitamento interno.' },
    { id: 4, title: 'Gabinete Phantom', subtitle: 'Mid-Tower | RGB', img: 'assets/gabinete1.png', price: 'R$ 649,00', description: 'Painel frontal ventilado e suporte para 360mm.' },
  ];

  get filtered() {
    const q = this.search.trim().toLowerCase();
    return q ? this.products.filter(p => (p.title + ' ' + p.subtitle).toLowerCase().includes(q)) : this.products;
  }

  onLike(product: Product) {
    console.log('Liked', product.id);
  }

  onShare(product: Product) {
    if ((navigator as any).share) {
      (navigator as any).share({
        title: product.title,
        text: product.subtitle,
        url: location.href
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(location.href + `#product-${product.id}`);
    }
  }
}
