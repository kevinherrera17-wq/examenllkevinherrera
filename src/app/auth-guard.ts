import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { PreferencesService } from './preferences.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  private readonly _preferencesService: PreferencesService =
    inject(PreferencesService);
  private readonly _router: Router = inject(Router);

  async canActivate(): Promise<boolean> {
    const isAuthenticated = await this._preferencesService.get<string | null>(
      'token'
    );
    if (!isAuthenticated) {
      this._router.navigate(['/login-app']);
      return false;
    }
    return true;
  }
}
