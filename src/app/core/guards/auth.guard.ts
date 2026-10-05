//solo  guard che controllano l'accesso alle route a livello globale.
// import { inject } from '@angular/core';
// import { CanActivateFn, Router } from '@angular/router';

// import { AuthService } from '../services/auth.service';

// export const authGuard: CanActivateFn = () => {
//   const authService = inject(AuthService);
//   const router = inject(Router);

//   if (authService.isAuthenticated()) {
//     return true;
//   }

//   return router.createUrlTree(['/login']);
// };
