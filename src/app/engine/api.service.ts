/* eslint-disable @typescript-eslint/naming-convention */
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalService } from './global.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {

  constructor(
    public http: HttpClient,
    public g: GlobalService
  ) { }

  public call(url: string, token?: string, body?: any, type: 'POST' | 'GET' | 'PUT' | 'DELETE' = 'GET', ctype = 'application/json'): Promise<any> {
    const hds = {
      'Content-Type': ctype
    };
    if (!!token) {
      hds['Authorization'] = `Bearer ${token}`;
    }

    const init = {
      method: !!body ? (type === 'GET' ? 'POST' : type) : 'GET',
      headers: hds
    };
    if (!!body) {
      init['body'] = body;
    }

    return new Promise((resolve, reject) => {
      fetch(url, init).then(async (data: Response) =>
        resolve(await data.json())
        , (err: HttpErrorResponse) => {
          if (err.status === 401) {
            return reject('UNAUTHORIZED');
          }
          if (err.status === 403) {
            return reject('FORBIDDEN');
          }
          return reject('UNKNOWN');
        }).catch(() => reject('UNKNOWN'));
    });
  }
}
