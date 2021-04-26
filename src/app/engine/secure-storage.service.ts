import { Injectable } from '@angular/core';
import * as SecureLS from 'secure-ls';
import { ISavedWorker } from '../interfaces/saved-worker.interface';
import * as CryptoJS from 'crypto-js';
import * as moment from 'moment';

@Injectable({ providedIn: 'root' })
export class SecureStorageService {

  private vault: SecureLS = null;

  constructor() {
    this.init();
  }

  async init(): Promise<void> {
    /* DISCLAIMER:
      I am using Secure Storage because I intend to implement a PIN "authentication" mechanism.
      For now it generates a random key for the vault...
    */
    let secret = localStorage.getItem('secret');
    if (!!!secret) {
      secret = CryptoJS.SHA512(moment().unix().toString()).toString();
      localStorage.setItem('secret', secret);
    }

    return new Promise(async (ok, nook) => {
      try {
        this.vault = new SecureLS({
          isCompression: true,
          encodingType: 'aes',
          encryptionSecret: secret
        });
        return ok();
      } catch (err) {
        return nook('vault');
      }
    });
  }

  // Workers operations
  async addOrUpdateWorker(worker: ISavedWorker) {
    let current: ISavedWorker[] = (await this.get('workers')) || [];
    const exists = current.find(o => o.url === worker.url);
    if (!!exists) {
      current = current.filter(o => o.url !== worker.url);
    }
    current.push(worker);
    await this.set('workers', current);
  }

  async removeWorker(url: string) {
    let current: ISavedWorker[] = (await this.get('workers')) || [];
    current = current.filter(o => o.url !== url);
    await this.set('workers', current);
  }

  // CRUD
  async get(key: string) {
    try {
      return JSON.parse(this.vault.get(key));
    } catch (err) {
      return undefined;
    }
  }

  async set(key: string, value: any) {
    try {
      this.vault.set(key, JSON.stringify(value));
      return true;
    } catch (err) {
      return false;
    }
  }

  async keys(): Promise<string[]> {
    try {
      const keys = this.vault.getAllKeys();
      return Promise.resolve(keys.filter((o) => o !== '_secure__ls__sign__enclave'));
    } catch (err) {
      return Promise.reject();
    }
  }

  async remove(key: string) {
    try {
      this.vault.remove(key);
      return true;
    } catch (err) {
      return false;
    }
  }

  async clear() {
    try {
      const bid = localStorage.getItem('_secure__ls__sign__enclave');
      this.vault.clear();
      if (bid) {
        localStorage.setItem('_secure__ls__sign__enclave', bid);
      }
      return true;
    } catch (err) {
      return false;
    }
  }

}
