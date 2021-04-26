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
      Accept: 'application/json',
      'Content-Type': ctype
    };
    if (!!token) {
      hds['Authorization'] = `Bearer ${token}`;
    }

    return new Promise((resolve, reject) => {
      this.http.request(!!body ? (type === 'GET' ? 'POST' : type) : 'GET', url, {
        headers: hds,
        responseType: 'json',
        body,
        observe: 'response'
      }).toPromise().then((data: HttpResponse<any>) => {
        if (!this.g.isJSON(data.body) && data.status === 200) {
          return reject('JSON_INVALID');
        }
        return resolve(data.body);
      }, (err: HttpErrorResponse) => {
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
