import { CanActivateFn, Router } from '@angular/router';
import {inject} from '@angular/core';
import {Authservice} from '../services/authservice';

export const adminGuard: CanActivateFn = (route, state) => {
  const auth = inject(Authservice);
  const router = inject(Router)

  if (auth.getRole() == 'ADMIN') {
    return true;
  }
  else
  {
    if (!auth.IsLoggedIn())
    {
      return router.createUrlTree(['']);
    }
    else
    {
      return router.createUrlTree(['/home'])
    }
  }
};
