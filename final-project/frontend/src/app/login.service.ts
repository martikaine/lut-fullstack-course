import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

const API_URL = 'http://localhost:3001';

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  isAdmin: boolean;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    username: string;
    email: string;
    isAdmin: boolean;
  };
}

/**
 * Handles authentication.
 */
@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private http: HttpClient) {}

  login(username: string, password: string) {
    console.log(username);
    return this.http
      .post<AuthResponse>(
        `${API_URL}/users/auth`,
        {
          username,
          password,
        },
        {
          headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        }
      )
      .pipe(
        tap((res: AuthResponse) => {
          console.log(res);
          localStorage.setItem('id_token', res.token);
          localStorage.setItem('user', JSON.stringify(res.user));
        })
      );
  }

  logout() {
    localStorage.clear();
  }

  register(name: string, email: string, password: string): Observable<any> {
    const body = { name, email, password };
    return this.http.post<any>(`${API_URL}/users/register`, body);
  }
}
