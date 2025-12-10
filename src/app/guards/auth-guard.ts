import {Authservice} from '../services/authservice';
import {Router, CanActivateFn} from '@angular/router';
import {inject} from '@angular/core';


export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(Authservice);
  const router = inject(Router)

  if (!auth.IsLoggedIn()) {
    router.navigateByUrl('');
    return false;
  }

  return true;
}
