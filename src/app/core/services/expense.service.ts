import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Expense, ExpenseFilter } from '../../shared/models/expense.model';

export interface CreateExpenseRequest {
  userId: number;
  categoryId: number;
  amount: number;
  description: string | null;
  expenseDate: string;
}

export interface UpdateExpenseRequest {
  categoryId: number;
  amount: number;
  description: string | null;
  expenseDate: string;
}

@Injectable({ providedIn: 'root' })
export class ExpenseService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/expenses`;

  getFiltered(filter: ExpenseFilter): Observable<Expense[]> {
    let params = new HttpParams();
    if (filter.userId) params = params.set('userId', filter.userId);
    if (filter.categoryId) params = params.set('categoryId', filter.categoryId);
    if (filter.fromDate) params = params.set('fromDate', filter.fromDate);
    if (filter.toDate) params = params.set('toDate', filter.toDate);
    if (filter.search) params = params.set('search', filter.search);

    return this.http.get<Expense[]>(this.baseUrl, { params });
  }

  getById(id: number): Observable<Expense> {
    return this.http.get<Expense>(`${this.baseUrl}/${id}`);
  }

  create(dto: CreateExpenseRequest): Observable<Expense> {
    return this.http.post<Expense>(this.baseUrl, dto);
  }

  update(id: number, dto: UpdateExpenseRequest): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}