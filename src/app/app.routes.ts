import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { ProductsComponent } from './features/products/products.component';
import { ProductImportComponent } from './features/product-import/product-import.component';
import { SalesComponent } from './features/sales/sales.component';
import { authGuard } from './core/auth-guard';
import { LayoutComponent } from './layout/layout.component';
import { SalesHistoryComponent } from './features/sales/sales-history.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },

  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },

      // 👇 NUEVA RUTA (debe ir antes)
      { path: 'products/import', component: ProductImportComponent },

      { path: 'products', component: ProductsComponent },
      { path: 'sales', component: SalesComponent },
      {
        path: 'sales-history',
        component: SalesHistoryComponent,
        canActivate: [authGuard]
      }
    ]
  },

  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '/dashboard' }
];
