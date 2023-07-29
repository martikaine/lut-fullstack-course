import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

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
    return this.http.get<User>(`api/users/${name}`);
  }
}
