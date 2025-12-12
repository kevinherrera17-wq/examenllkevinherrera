import { inject, Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root',
})
export class PreferencesService {
  private readonly _encryptionService: EncryptionService =
    inject(EncryptionService);

  async get<T>(key: string): Promise<T | null> {
    const encodedKey: string = this._encryptionService.encrypt(key);
    const { value } = await Preferences.get({ key: encodedKey });
    const decodedData = this._encryptionService.decrypt(value ?? '');
    return decodedData ? (JSON.parse(decodedData) as T) : null;
  }

  async set<T>(key: string, value: T): Promise<void> {
    console.log('Saving preference:', key, value);
    const dataToEncode = JSON.stringify(value);
    const encodedData = this._encryptionService.encrypt(dataToEncode);
    const encodedKey: string = this._encryptionService.encrypt('key');

    await Preferences.set({
      key: encodedKey,
      value: encodedData,
    });
  }
}
