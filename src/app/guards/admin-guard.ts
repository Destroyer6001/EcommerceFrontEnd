import { CanActivateFn, Router } from '@angular/router';
import {inject} from '@angular/core';
import {Authservice} from '../services/authservice';

export const adminGuard: CanActivateFn = (route, state) => {
  const auth = inject(Authservice);
  const router = inject(Router)

  if (auth.getRole() != 'ADMIN') {
    if (!auth.IsLoggedIn())
    {
      router.navigateByUrl('');
    }
    else
    {
      router.navigateByUrl('/home')
    }

    return false;
  }

  return true;
};
