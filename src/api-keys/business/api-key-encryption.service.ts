import { Injectable } from '@nestjs/common';
import {
  Cipher,
  Decipher,
  createCipheriv,
  createDecipheriv,
  randomBytes,
  scrypt,
} from 'crypto';
import { ApiKeyEncryptionResult } from './encryption.interface';

@Injectable()
export class ApiKeyEncryptionService {
  public readonly keyLength = 32;
  public readonly cipherType = 'aes-256-ctr';

  public async encrypt(
    secretKey: string,
    uuid: string,
  ): Promise<ApiKeyEncryptionResult> {
    const iv = randomBytes(16);
    const cipher = await this.getCipher(secretKey, iv);
    const key = this.buildBase64Key(cipher, uuid);

    return {
      key,
      iv: iv.toString('base64'),
    };
  }

  public async decrypt(secretKey: string, iv: Buffer): Promise<string | null> {
    const decipher = await this.getDecipher(secretKey, iv);
    return this.parseBase64Key(secretKey, decipher);
  }

  private async getCipher(secretKey: string, iv: Buffer): Promise<Cipher> {
    const key = await this.getKey(secretKey);
    return createCipheriv(this.cipherType, key, iv);
  }

  private async getDecipher(secretKey: string, iv: Buffer): Promise<Decipher> {
    const key = await this.getKey(secretKey);
    return createDecipheriv(this.cipherType, key, iv);
  }

  private async getKey(secretKey: string): Promise<Buffer> {
    return new Promise((res) => {
      scrypt(Buffer.from(secretKey), 'salt', this.keyLength, (_, key) => {
        res(key);
      });
    });
  }

  private buildBase64Key(cipher: Cipher, uuid: string): string {
    return `${cipher.update(uuid, 'utf8', 'base64')}${cipher.final('base64')}`;
  }

  private parseBase64Key(secretKey: string, decipher: Decipher): string {
    return `${decipher.update(secretKey, 'base64')}${decipher.final('base64')}`;
  }
}
