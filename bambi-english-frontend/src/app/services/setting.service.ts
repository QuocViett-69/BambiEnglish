import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingService {
  private apiUrl = 'http://localhost:3000/api/settings';

  constructor(private http: HttpClient) {}

  getSettings(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  updateSettings(data: any): Observable<any> {
    return this.http.patch(this.apiUrl, data);
  }
}
