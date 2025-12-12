import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular/standalone';
import { environment } from 'src/environments/environment.prod';
import { PreferencesService } from './preferences.service';
import { TokenResponseDto } from './token-response.dto';
import { LoginDto } from './login.dto';

const API_URL = `${environment.API_URL}`;
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly _http: HttpClient = inject(HttpClient);
  private readonly _preferencesService: PreferencesService =
    inject(PreferencesService);
  private readonly _router: Router = inject(Router);
  private readonly _toastController: ToastController = inject(ToastController);

  login(model: LoginDto): void {
    this._http.post<TokenResponseDto>(`https://localhost${API_URL}`, model).subscribe({
      next: (response: TokenResponseDto) => {
        this._preferencesService.set('accessToken', response.accessToken);
        this.showToast('Inicio de sesión exitoso');
        this._router.navigate(['/folder']);
      },
      error: () => {
        this.showToast('Error al iniciar sesión', true);
      },
    });
  }

  async showToast(message: string, error: boolean = false) {
    const toast = await this._toastController.create({
      message,
      duration: 2000,
      color: error ? 'danger' : 'success',
      position: 'top',
    });
    await toast.present();
  }
}
