import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MonthlyReport, CategorySummary } from '../../shared/models/report.model';
import { ExpenseFilter } from '../../shared/models/expense.model';

@Injectable({ providedIn: 'root' })
export class ReportService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/reports`;

  getMonthly(userId: number, year: number, month: number): Observable<MonthlyReport> {
    const params = new HttpParams().set('userId', userId).set('year', year).set('month', month);
    return this.http.get<MonthlyReport>(`${this.baseUrl}/monthly`, { params });
  }

  getCategorySummary(filter: ExpenseFilter): Observable<CategorySummary> {
    let params = new HttpParams();
    if (filter.userId) params = params.set('userId', filter.userId);
    if (filter.categoryId) params = params.set('categoryId', filter.categoryId);
    if (filter.fromDate) params = params.set('fromDate', filter.fromDate);
    if (filter.toDate) params = params.set('toDate', filter.toDate);
    if (filter.search) params = params.set('search', filter.search);

    return this.http.get<CategorySummary>(`${this.baseUrl}/category-summary`, { params });
  }
}