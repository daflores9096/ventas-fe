import {
  Component,
  OnInit,
  AfterViewInit,
  ChangeDetectorRef,
  ViewChild,
  ElementRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/api.service';

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.css'],
})
export class SalesComponent implements OnInit, AfterViewInit {

  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  products: any[] = [];
  filtered: any[] = [];
  cart: any[] = [];
  search = '';
  scannerMode = false;

  // Para detectar escáner
  private lastKeyTime = 0;

  constructor(
    private api: ApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.focusSearch(), 200);
  }

  focusSearch() {
    if (this.searchInput?.nativeElement) {
      this.searchInput.nativeElement.focus();
    }
  }

  loadProducts() {
    this.api.getProducts().subscribe({
      next: (res) => {
        this.products = res.data;
        this.filtered = [...this.products];
        this.cdr.detectChanges();
      }
    });
  }

  onSearchChange() {
    if (!this.search.trim()) {
      this.filtered = [...this.products];
      return;
    }

    // Si está en modo escáner → búsqueda exacta por barcode
    if (this.scannerMode) {
      const found = this.products.find(
        p => p.barcode && p.barcode.toString() === this.search.trim()
      );

      if (found) {
        this.addToCart(found);
        //this.playBeep();
        this.flashItem(found.id);

        // 🔴 CLAVE: no volver a mostrar todo
        this.filtered = [found];
      }

      this.search = '';
      this.focusSearch();
      return;
    }

    // Modo normal (buscar por nombre)
    const s = this.search.toLowerCase();
    this.filtered = this.products.filter(
      p => p.name.toLowerCase().includes(s) || (p.barcode + '').includes(s)
    );
  }

  // Agregar al carrito
  addToCart(product: any) {
    const item = this.cart.find(p => p.id === product.id);
    if (item) item.qty++;
    else this.cart.push({ ...product, qty: 1 });

    this.cdr.detectChanges();
  }

  changeQty(item: any, amount: number) {
    item.qty += amount;
    if (item.qty <= 0) {
      this.cart = this.cart.filter(i => i.id !== item.id);
    }
    this.cdr.detectChanges();
  }

  getCartTotal() {
    return this.cart.reduce((sum, p) => sum + p.qty * p.price, 0);
  }

  checkout() {
    if (this.cart.length === 0) return;

    const saleData = {
      items: this.cart.map(p => ({
        product_id: p.id,
        quantity: p.qty,
        price: p.price
      }))
    };

    this.api.createSale(saleData).subscribe({
      // next: () => {
      //   alert("Venta registrada correctamente");
      //   this.cart = [];
      //   this.loadProducts();
      // }
      next: () => {
        this.cart = [];
        this.search = '';
        this.filtered = [...this.products];
        this.loadProducts();
        //this.playBeep();
      }
    });
  }

  // 🔊 Sound feedback
  playBeep() {
    const audio = new Audio('/assets/beep.mp3'); // agrega beep.mp3 en /public o /assets
    audio.play();
  }

  // 💡 Flash visual en el producto añadido
  flashItem(productId: number) {
    const el = document.getElementById('prod-' + productId);
    if (!el) return;

    el.classList.add('flash');
    setTimeout(() => el.classList.remove('flash'), 300);
  }
}
