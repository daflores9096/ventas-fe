import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { ApiService } from '../../core/api.service';

export const salesHistoryResolver: ResolveFn<any> = () => {
  const api = inject(ApiService);
  return api.getSales();
};
