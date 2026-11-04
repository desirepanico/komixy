import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import {
  PreloadAllModules,
  provideRouter,
  withInMemoryScrolling,
  withPreloading,
  withViewTransitions,
} from '@angular/router';
import { provideCore } from '@core/providers/core/core.provider';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      withViewTransitions(),
      // Le pagine lazy si scaricano in background dopo l'avvio: il cambio pagina non aspetta la rete
      withPreloading(PreloadAllModules),
      // Ogni pagina nuova parte dall'alto; tornando indietro si ritrova la posizione
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled' }),
    ),
    provideCore(),
  ],
};
