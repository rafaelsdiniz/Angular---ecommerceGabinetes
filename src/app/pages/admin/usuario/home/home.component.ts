import { Component, type OnInit, type OnDestroy } from "@angular/core"
import { CommonModule } from "@angular/common"
import { MatToolbarModule } from "@angular/material/toolbar"
import { MatIconModule } from "@angular/material/icon"
import { MatButtonModule } from "@angular/material/button"
import { MatCardModule } from "@angular/material/card"
import { MatInputModule } from "@angular/material/input"
import { MatBadgeModule } from "@angular/material/badge"
import { MatMenuModule } from "@angular/material/menu"
import { FormsModule } from "@angular/forms"

interface Product {
  id: number
  title: string
  subtitle: string
  img: string
  price: number
  oldPrice?: number
  badge?: string
  rating?: number
  installments?: number
  discount?: number
}

interface Category {
  name: string
  icon: string
  link: string
}

interface Brand {
  name: string
  img: string
  link: string
}

@Component({
  selector: "app-home",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatBadgeModule,
    MatMenuModule,
  ],
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit, OnDestroy {
  search = ""
  currentYear: number = new Date().getFullYear()

  countdownHours = 4
  countdownMinutes = 22
  countdownSeconds = 46
  private countdownInterval: any

  currentSlide = 0
  private carouselInterval: any

  activeFilter = "TODOS"

  hotDeals: Product[] = [
    {
      id: 1,
      title: "Gabinete Gamer NZXT H510 Elite",
      subtitle: "Mid Tower, Vidro Temperado, RGB, ATX",
      img: "/assets/gabinete1.png",
      price: 899.9,
      oldPrice: 1299.0,
      badge: "OFERTA",
      rating: 5,
      installments: 10,
      discount: 31,
    },
    {
      id: 2,
      title: "Gabinete Corsair 4000D Airflow",
      subtitle: "Mid Tower, Lateral Vidro, Preto, ATX",
      img: "/assets/gabinete2.png",
      price: 649.9,
      oldPrice: 849.0,
      badge: "PRIME",
      rating: 5,
      installments: 10,
    },
    {
      id: 3,
      title: "Gabinete Lian Li O11 Dynamic",
      subtitle: "Mid Tower, Vidro Duplo, RGB, E-ATX",
      img: "/assets/gabinete3.png",
      price: 1299.9,
      oldPrice: 1699.0,
      badge: "LANÇAMENTO",
      rating: 5,
      installments: 10,
      discount: 24,
    },
    {
      id: 4,
      title: "Gabinete Cooler Master TD500 Mesh",
      subtitle: "Mid Tower, Frontal Mesh, 3x RGB Fan",
      img: "/assets/gabinete04.webp",
      price: 579.9,
      oldPrice: 749.0,
      badge: "OFERTA",
      rating: 4,
      installments: 5,
    },
        {
      id: 5,
      title: "Gabinete Cooler Master TD500 Mesh",
      subtitle: "Mid Tower, Frontal Mesh, 3x RGB Fan",
      img: "/assets/gabinete04.webp",
      price: 579.9,
      oldPrice: 749.0,
      badge: "OFERTA",
      rating: 4,
      installments: 5,
    },
  ]

  featuredProducts: Product[] = [
    {
      id: 6,
      title: "Gabinete Thermaltake View 51 TG",
      subtitle: "Full Tower, 4x Vidro Temperado, RGB",
      img: "/assets/gabinete1.png",
      price: 1899.0,
      oldPrice: 2499.0,
      badge: "LANÇAMENTO",
      rating: 5,
      installments: 10,
    },
    {
      id: 7,
      title: "Gabinete be quiet! Pure Base 500DX",
      subtitle: "Mid Tower, Mesh Frontal, 3x Pure Wings",
      img: "/assets/gabinete1.png",
      price: 849.9,
      rating: 5,
      installments: 8,
    },
    {
      id: 8,
      title: "Gabinete Phanteks Eclipse P400A",
      subtitle: "Mid Tower, Mesh RGB, Vidro Temperado",
      img: "/assets/gabinete1.png",
      price: 699.9,
      oldPrice: 899.0,
      badge: "PROMOÇÃO",
      rating: 4,
      installments: 7,
    },
    {
      id: 9,
      title: "Gabinete ASUS TUF Gaming GT502",
      subtitle: "Mid Tower, RGB, Vidro Temperado, ATX",
      img: "/assets/gabinete1.png",
      price: 1099.9,
      oldPrice: 1399.0,
      rating: 5,
      installments: 10,
    },
    {
      id: 10,
      title: "Gabinete MSI MAG Forge 100R",
      subtitle: "Mid Tower, Lateral Vidro, RGB Fan",
      img: "/assets/gabinete1.png",
      price: 449.9,
      rating: 4,
      installments: 4,
      badge: "NOVO",
    },
  ]

  categories: Category[] = [
    { name: "MID TOWER", icon: "computer", link: "/mid-tower" },
    { name: "FULL TOWER", icon: "dns", link: "/full-tower" },
    { name: "MINI TOWER", icon: "tablet_mac", link: "/mini-tower" },
    { name: "GABINETES RGB", icon: "lightbulb", link: "/rgb" },
    { name: "VIDRO TEMPERADO", icon: "crop_square", link: "/vidro-temperado" },
    { name: "AIRFLOW", icon: "air", link: "/airflow" },
    { name: "COMPACTOS", icon: "phone_android", link: "/compactos" },
    { name: "PREMIUM", icon: "star", link: "/premium" },
  ]

  brands: Brand[] = [
    { name: "CORSAIR", img: "/assets/Corsair-logo.png", link: "/marca/corsair" },
    { name: "NZXT", img: "/assets/nzxtlogo.webp", link: "/marca/nzxt" },
    { name: "LIAN LI", img: "/assets/lianlilogo.png", link: "/marca/lian-li" },
    { name: "COOLER MASTER", img: "/assets/collermasterlogo.png", link: "/marca/cooler-master" },
    { name: "THERMALTAKE", img: "/assets/Thermaltake-Logo.png", link: "/marca/thermaltake" },
    { name: "FRACTAL DESIGN", img: "/assets/fractal.png", link: "/marca/fractal-design" },
    { name: "PHANTEKS", img: "/assets/phanteks.png", link: "/marca/phanteks" },
    { name: "BE QUIET!", img: "/assets/bequiet.png", link: "/marca/be-quiet" },
  ]

  filters = [
    "TODOS",
    "LANÇAMENTOS",
    "MID TOWER",
    "FULL TOWER",
    "MINI TOWER",
    "RGB",
    "VIDRO TEMPERADO",
    "AIRFLOW",
    "COMPACTOS",
    "PREMIUM",
  ]

  ngOnInit() {
    this.startCountdown()
    this.startCarousel()
  }

  ngOnDestroy() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval)
    }
    if (this.carouselInterval) {
      clearInterval(this.carouselInterval)
    }
  }

  startCountdown() {
    this.countdownInterval = setInterval(() => {
      if (this.countdownSeconds > 0) {
        this.countdownSeconds--
      } else {
        this.countdownSeconds = 59
        if (this.countdownMinutes > 0) {
          this.countdownMinutes--
        } else {
          this.countdownMinutes = 59
          if (this.countdownHours > 0) {
            this.countdownHours--
          }
        }
      }
    }, 1000)
  }

  startCarousel() {
    this.carouselInterval = setInterval(() => {
      this.nextSlide()
    }, 5000)
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % 3
  }

  prevSlide() {
    this.currentSlide = this.currentSlide === 0 ? 2 : this.currentSlide - 1
  }

  goToSlide(index: number) {
    this.currentSlide = index
  }

  setFilter(filter: string) {
    this.activeFilter = filter
  }

  get filtered() {
    const q = this.search.trim().toLowerCase()
    const allProducts = [...this.hotDeals, ...this.featuredProducts]
    return q ? allProducts.filter((p) => (p.title + " " + p.subtitle).toLowerCase().includes(q)) : allProducts
  }

  formatPrice(price: number): string {
    return price.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  calculateInstallment(price: number, installments: number): string {
    return (price / installments).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  onAddToCart(product: Product) {
    console.log("Adicionado ao carrinho:", product.id)
  }
}
