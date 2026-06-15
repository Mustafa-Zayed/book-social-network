import {
  ApplicationConfig,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { inject } from '@angular/core';
import { routes } from './app.routes';
import { tokenInterceptorProvider } from './services/interceptor/token.interceptor';
import { KeycloakService } from './services/keycloak/keycloak.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([tokenInterceptorProvider])),
    provideAppInitializer(() => inject(KeycloakService).init()),
  ],
};
