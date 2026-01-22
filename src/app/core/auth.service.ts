import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private tokenKey = 'token';
  private userKey = 'user';

  // NEW: estado reactivo del usuario
  user = signal<any | null>(null);

  constructor() {
    // Intentar cargar usuario desde localStorage al arrancar App
    const raw = localStorage.getItem(this.userKey);
    if (raw) {
      try {
        this.user.set(JSON.parse(raw));
      } catch {
        this.user.set(null);
      }
    }
  }

  // Guardar token + usuario
  setSession(token: string, user: any) {
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.userKey, JSON.stringify(user));
    this.user.set(user);
  }

  // Saber si está logueado
  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  getUser() {
    return this.user();
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.user.set(null);
  }
}
