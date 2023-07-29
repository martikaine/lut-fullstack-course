import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const API_URL = 'http://localhost:3001';

export interface User {
  username: string;
  passwordHash: string;
  email: string;
  createdAt: Date;
  karma: number;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  getProfile(name: string) {
    return this.http.get<User>(`${API_URL}/users/${name}`);
  }
}
