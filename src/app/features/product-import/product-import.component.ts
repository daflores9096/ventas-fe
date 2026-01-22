import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as XLSX from 'xlsx';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-import',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-import.component.html',
  styleUrls: ['./product-import.component.css']
})
export class ProductImportComponent {
  loading = false;
  showPreview = false;
  productsPreview: any[] = [];

  readonly REQUIRED_COLUMNS = [
    'nombre_producto',
    'barcode',
    'marca',
    'precio_compra',
    'precio_venta'
  ];

  constructor(
    private productService: ProductService,
    private cdr: ChangeDetectorRef
  ) {}

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];

    if (!file.name.match(/\.(xlsx|xls)$/)) {
      alert('Solo se permiten archivos Excel (.xlsx, .xls)');
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
    const data = new Uint8Array(reader.result as ArrayBuffer);
    const workbook = XLSX.read(data, { type: 'array' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json<any>(sheet, { defval: '' });

    if (!this.validateColumns(rows)) {
      alert(
        'El Excel debe tener exactamente estas columnas:\n' +
        this.REQUIRED_COLUMNS.join(', ')
      );
      return;
    }

    this.productsPreview = rows;
    this.showPreview = true;
    // 🔥 fuerza render
    this.cdr.detectChanges();

  };


    reader.readAsArrayBuffer(file);
  }

  private validateColumns(rows: any[]): boolean {
    if (rows.length === 0) return false;
    const columns = Object.keys(rows[0]);
    return this.REQUIRED_COLUMNS.every(col => columns.includes(col));
  }

  confirmImport() {
    if (this.productsPreview.length === 0) return;

    this.loading = true; // 🔥 aquí, no antes
    this.import(this.productsPreview);
  }


  cancelImport() {
    this.productsPreview = [];
    this.showPreview = false;
  }

  private import(rows: any[]) {
    this.loading = true;

    this.productService.importProducts(rows).subscribe({
      next: (response: any) => {
        this.loading = false;

        // 🔥 limpiar estado visual
        this.productsPreview = [];
        this.showPreview = false;

        this.cdr.detectChanges();

        this.showResult(response.data);
      },
      error: (err) => {
        this.loading = false;

        // 🔥 también limpiar estado en error
        this.productsPreview = [];
        this.showPreview = false;

        this.cdr.detectChanges();

        alert(err?.error?.message || 'Error al importar productos');
      }
    });

  }

  private showResult(result: any) {
    let message = `✅ Productos importados: ${result.imported}\n`;

    if (result.failed.length > 0) {
      message += `\n❌ Productos fallidos:\n\n`;
      result.failed.forEach((f: any) => {
        message += `Fila ${f.row}: ${f.error}\n`;
      });
    }

    alert(message);
  }
}
