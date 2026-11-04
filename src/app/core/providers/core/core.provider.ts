import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { provideI18n } from '../i18n/i18n.provider';
import { provideNavDirection } from '../nav-direction/nav-direction.provider';

/**
 * Tutti i provider di avvio dell'app (traduzioni, direzione delle transizioni).
 * `app.config.ts` ne registra uno solo: i nuovi provider globali si aggiungono qui.
 */
export function provideCore(): EnvironmentProviders {
  return makeEnvironmentProviders([provideI18n(), provideNavDirection()]);
}
