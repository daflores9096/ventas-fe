import { Component, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { ApiService } from '../../core/api.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-products',
  standalone: true,
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
  imports: [FormsModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.Default // ← CLAVE
})
export class ProductsComponent {

  products: any[] = [];   // ← jamás undefined
  loading = false;
  showForm = false;
  editMode = false;

  form = {
    id: null,
    name: '',
    price: '',
    stock: '',
    barcode: ''
  };

  constructor(
    private api: ApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    console.log("📌 loadProducts() ejecutado");
    this.loading = true;

    this.api.getProducts().subscribe({
      next: (res) => {
        this.products = res.data ?? [];
        console.log("Productos cargados:", this.products);

        this.loading = false;
        this.cdr.detectChanges();  // ← fuerza actualización
      },
      error: (err) => {
        console.error("Error cargando productos", err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  startCreate() {
    this.editMode = false;
    this.form = { id: null, name: '', price: '', stock: '', barcode: '' };
    this.showForm = true;
  }

  edit(p: any) {
    this.editMode = true;
    this.form = { ...p };
    this.showForm = true;
  }

  save() {
    console.log(this.form)
    const req = this.editMode
      ? this.api.updateProduct(this.form.id!, this.form)
      : this.api.createProduct(this.form);

    req.subscribe({
      next: () => {
        this.showForm = false;
        this.loadProducts();
      }
    });
  }

  remove(id: number) {
    if (!confirm("¿Eliminar producto?")) return;

    this.api.deleteProduct(id).subscribe({
      next: () => this.loadProducts()
    });
  }

  cancel() {
    this.showForm = false;
  }
}
