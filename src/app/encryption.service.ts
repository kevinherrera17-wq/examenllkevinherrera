import { Injectable, inject } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { EncryptionService } from './encryption.service';

@Injectable({
  providedIn: 'root'
})
export class PreferencesService {
  private readonly _encryptionService: EncryptionService = inject(EncryptionService);

  async setEncrypted(key: string, value: string): Promise<void> {
    const encrypted = this._encryptionService.encrypt(value);
    await Preferences.set({ key, value: encrypted });
  }

  async getDecrypted(key: string): Promise<string> {
    const { value } = await Preferences.get({ key });
    return value ? this._encryptionService.decrypt(value) : '';
  }
}