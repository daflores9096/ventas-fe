import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/api.service';
import { ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-sales-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sales-history.component.html',
  styleUrls: ['./sales-history.component.css'],
})

export class SalesHistoryComponent implements OnInit {

  sales: any[] = [];
  selectedSale: any = null;
  loading = false;
  showModal = false;

  page = 1;
  limit = 10;
  total = 0;

  filters: {
    status?: string;
    from?: string;
    to?: string;
    q?: string;
  } = {};

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
  this.loadSales();
}

get totalPages(): number {
  return Math.ceil(this.total / this.limit);
}


  loadSales() {
    this.loading = true;

    this.api.getSales({
      page: this.page,
      limit: this.limit,
      ...this.filters
    }).subscribe({
      next: (res) => {
        this.sales = res.data.data;
        this.total = res.data.total;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando ventas', err);
        this.loading = false;
      }
    });
  }

  openDetail(id: number) {
    this.showModal = true;
    this.selectedSale = null;

    this.api.getSaleDetail(id).subscribe({
      next: (res) => {
        this.selectedSale = res.data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando detalle', err);
        this.showModal = false;
      }
    });
  }

  closeDetail() {
    this.showModal = false;
    this.selectedSale = null;
  }

  cancelSale(id: number) {
    if (!confirm('¿Anular esta venta?')) return;

    this.api.cancelSale(id).subscribe({
      next: () => {
        alert('Venta anulada y stock restaurado');
        this.loadSales();
      },
      error: (err) => {
        alert(err.error?.message || 'Error al anular venta');
      }
    });
  }

  applyFilters() {
    this.page = 1;
    this.loadSales();
  }

  changePage(p: number) {
    this.page = p;
    this.loadSales();
  }

  nextPage() {
    if (this.page * this.limit < this.total) {
      this.page++;
      this.loadSales();
    }
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.loadSales();
    }
  }

}
