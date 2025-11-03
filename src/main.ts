import 'zone.js'; // ✅ Necesario para detección de cambios
import { bootstrapApplication } from '@angular/platform-browser'; // ✅ Import correcto
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

// 🔧 Se añade tipado a 'err' para evitar el warning TS7006
bootstrapApplication(AppComponent, appConfig)
  .catch((err: unknown) => console.error(err));
