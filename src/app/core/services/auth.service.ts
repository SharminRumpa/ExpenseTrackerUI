import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { RegisterRequest, LoginRequest, AuthResponse } from '../../shared/models/auth.model';

const TOKEN_KEY = 'expense_tracker_token';
const USER_KEY = 'expense_tracker_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = `${environment.apiUrl}/auth`;

  currentUser = signal<{ userId: number;name: string; email: string } | null>(this.loadUser());


getUserId(): number | null {
  return this.currentUser()?.userId ?? null;
}

  constructor(private http: HttpClient, private router: Router) {}

  register(dto: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/register`, dto)
      .pipe(tap(res => this.setSession(res)));
  }

  login(dto: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, dto)
      .pipe(tap(res => this.setSession(res)));
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }


  private setSession(res: AuthResponse): void {
  localStorage.setItem(TOKEN_KEY, res.token);
  const user = { userId: res.userId, name: res.name, email: res.email };
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  this.currentUser.set(user);
}

private loadUser(): { userId: number; name: string; email: string } | null {
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
}
}