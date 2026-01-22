import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, NgIf],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {

  constructor(public auth: AuthService) {}

  logout() {
    this.auth.logout();
    window.location.href = '/login';
  }
}
