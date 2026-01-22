import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { firstValueFrom } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  imports: [FormsModule]
})
export class LoginComponent {

  username = '';
  password = '';
  error = '';

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private router: Router
  ) {}

  async doLogin() {
    this.error = '';

    if (!this.username || !this.password) {
      this.error = 'Debes ingresar usuario y contraseña';
      return;
    }

    try {
      const res = await firstValueFrom(
        this.api.login(this.username, this.password)
      );

      if (res?.status !== 'success') {
        this.error = res?.message || 'Credenciales inválidas';
        return;
      }

      this.auth.setSession(res.data.token, res.data.user);
      this.router.navigate(['/dashboard']);

    } catch (err: any) {
      console.error("Error login:", err);

      if (err.status === 401) {
        this.error = 'Credenciales incorrectas';
      } else {
        this.error = 'Error al iniciar sesión';
      }
    }
  }
}
