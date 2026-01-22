import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ApiService } from '../../core/api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],   // ← IMPORTANTE
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {

  totalSales = 0;
  totalRevenue = 0;
  totalProductsSold = 0;

  dailyChartData = {
    labels: [],
    datasets: [
      { label: 'Ventas por día', data: [] }
    ]
  };

  productChartData = {
    labels: [],
    datasets: [
      { label: 'Productos vendidos', data: [] }
    ]
  };

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.loadTotal();
    this.loadDaily();
    this.loadProductReport();
  }

  loadTotal() {
    this.api.getReportTotals().subscribe({
      next: (res) => {
        this.totalSales = Number(res.data.total_sales);
        this.totalRevenue = Number(res.data.total_revenue);
      }
    });
  }

  loadDaily() {
    this.api.getReportDaily().subscribe({
      next: (res) => {
        this.dailyChartData = {
          labels: res.data.map((d: any) => d.date),
          datasets: [
            { label: 'Ventas por día', data: res.data.map((d: any) => Number(d.total_amount)) }
          ]
        };
      }
    });
  }

  loadProductReport() {
    this.api.getReportByProduct().subscribe({
      next: (res) => {
        const quantities = res.data.map((p: any) => Number(p.total_quantity));

        this.totalProductsSold = quantities.reduce((a: number, b: number) => a + b, 0);

        this.productChartData = {
          labels: res.data.map((p: any) => p.product_name),
          datasets: [
            { label: 'Productos vendidos', data: quantities }
          ]
        };
      }
    });
  }
}
