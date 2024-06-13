import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Auth, onAuthStateChanged } from '@angular/fire/auth'; // Importa la versión correcta de Auth
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(Auth);
  const router = inject(Router);

  return new Observable<boolean>(subscriber => {
    onAuthStateChanged(auth, user => {
      if (user) {
        subscriber.next(true);
        subscriber.complete();
      } else {
        router.navigate(['/login']);
        subscriber.next(false);
        subscriber.complete();
      }
    });
  });
};