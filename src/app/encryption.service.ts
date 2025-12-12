import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class EncryptionService {
  decrypt(encoded: string): string {
    return window.atob(encoded);
  }

  encrypt(data: string): string {
    return window.btoa(data);
  }
}
