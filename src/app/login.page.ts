import { CommonModule } from '@angular/common';
import { Component, inject, signal, WritableSignal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonInputPasswordToggle,
  IonItem,
  IonLabel,
  IonNote,
  IonTitle,
  IonToolbar,
  LoadingController,
} from '@ionic/angular/standalone';
import { AuthService } from './auth.service';
import { LoginDto } from './login.dto';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonButton,
    IonContent,
    IonHeader,
    IonInput,
    IonInputPasswordToggle,
    IonItem,
    IonLabel,
    IonNote,
    IonTitle,
    IonToolbar,
    ReactiveFormsModule,
  ],
})
export class LoginPage {
  private readonly _authService: AuthService = inject(AuthService);
  private readonly formBuilder: FormBuilder = inject(FormBuilder);
  private readonly loadingController: LoadingController =
    inject(LoadingController);
  loading: WritableSignal<HTMLIonLoadingElement | null> = signal(null);
  loginForm: FormGroup = this.formBuilder.group({
    identifier: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    method: [0],
  });

  get isEmailRequired(): boolean {
    const emailControl: AbstractControl | null =
      this.loginForm.get('identifier');
    return emailControl
      ? emailControl.hasError('required') && emailControl.touched
      : false;
  }

  get isEmailInvalid(): boolean {
    const emailControl: AbstractControl | null =
      this.loginForm.get('identifier');
    return emailControl
      ? emailControl.hasError('email') && emailControl.touched
      : false;
  }

  get isPasswordRequired(): boolean {
    const passwordControl: AbstractControl | null =
      this.loginForm.get('password');
    return passwordControl
      ? passwordControl.hasError('required') && passwordControl.touched
      : false;
  }

  get isFormInvalid(): boolean {
    return this.loginForm.invalid;
  }

  async onSubmit(): Promise<void> {
    if (!this.isFormInvalid) {
      const login: LoginDto = this.loginForm.value as LoginDto;
      this.loading.set(
        await this.loadingController.create({
          message: 'Iniciando sesión...',
        })
      );
      await this.loading()?.present();
      this._authService.login(login);

      setTimeout(async () => {
        await this.loading()?.dismiss();
      }, 5000);
    }
  }
}
