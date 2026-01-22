import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private base = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  // LOGIN
  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.base}/auth/login`, { username, password });
  }

  // PRODUCTOS
  getProducts(): Observable<any> {
    return this.http.get<any>(`${this.base}/products`);
  }

  getProduct(id: number): Observable<any> {
    return this.http.get<any>(`${this.base}/products/${id}`);
  }

  createProduct(data: any): Observable<any> {
    console.log('product service data: ' + { data })
    return this.http.post<any>(`${this.base}/products`, data);
  }

  updateProduct(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.base}/products/${id}`, data);
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete<any>(`${this.base}/products/${id}`);
  }

  // SALES
  createSale(data: any) {
    return this.http.post<any>(`${this.base}/sales`, data);
  }

  getSales(params?: {
    page?: number;
    limit?: number;
    status?: string;
    from?: string;
    to?: string;
    q?: string;
  }) {
    return this.http.get<any>(`${this.base}/sales`, {
      params: {
        ...(params?.page && { page: params.page }),
        ...(params?.limit && { limit: params.limit }),
        ...(params?.status && { status: params.status }),
        ...(params?.from && { from: params.from }),
        ...(params?.to && { to: params.to }),
        ...(params?.q && { q: params.q }),
      }
    });
  }

  // Totales generales (KPIs)
  getReportTotals() {
    return this.http.get<any>(`${this.base}/reports/total`);
  }

  // Ventas por día (línea)
  getReportDaily() {
    return this.http.get<any>(`${this.base}/reports/daily`);
  }

  // Ventas por producto (barras)
  getReportByProduct() {
    return this.http.get<any>(`${this.base}/reports/products`);
  }

  // Ventas por usuario (opcional)
  getReportByUser() {
    return this.http.get<any>(`${this.base}/reports/users`);
  }

  searchProducts(query: string) {
    return this.http.get<any>(`${this.base}/products?search=${query}`);
  }

  getSaleDetail(id: number) {
    return this.http.get<any>(`${this.base}/sales/${id}`);
  }

  cancelSale(id: number) {
    return this.http.post<any>(
      `${this.base}/sales/${id}/cancel`,
      {}
    );
  }

}
