import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public chartType: ChartType = 'bar';
  public chartLabels: string[] = [];
  public chartData: number[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<any>(`${environment.apiUrl}/reports/daily`).subscribe({
      next: (res) => {
        // Corrige el error de 'res.data' → tu backend devuelve { status, data }
        const data = res.data || res;
        this.chartLabels = data.map((x: any) => x.date);
        this.chartData = data.map((x: any) => x.total_amount);
      },
      error: (err) => console.error('Error cargando reporte:', err)
    });
  }
}
