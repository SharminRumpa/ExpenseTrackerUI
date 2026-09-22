import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Category {
  id: number;
  name: string;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/categories`;

  getAll(): Observable<Category[]> {
    return this.http.get<Category[]>(this.baseUrl);
  }

  create(name: string): Observable<Category> {
    return this.http.post<Category>(this.baseUrl, { name });
  }

  update(id: number, name: string): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, { name });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}