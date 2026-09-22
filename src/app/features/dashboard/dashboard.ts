import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { ReportService } from '../../core/services/report.service';
import { ExpenseService } from '../../core/services/expense.service';
import { MonthlyReport } from '../../shared/models/report.model';
import { Expense } from '../../shared/models/expense.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {
  private authService = inject(AuthService);
  private reportService = inject(ReportService);
  private expenseService = inject(ExpenseService);

  report = signal<MonthlyReport | null>(null);
  recentExpenses = signal<Expense[]>([]);
  totalCount = signal<number>(0);
  isLoading = signal(true);

  ngOnInit(): void {
    const userId = this.authService.getUserId();
    if (!userId) return;

    const now = new Date();

    this.reportService.getMonthly(userId, now.getFullYear(), now.getMonth() + 1)
      .subscribe(report => {
        this.report.set(report);
        this.isLoading.set(false);
      });

    this.expenseService.getFiltered({ userId })
      .subscribe(expenses => {
        this.totalCount.set(expenses.length);
        this.recentExpenses.set(expenses.slice(0, 5));
      });
  }

  maxCategoryTotal(): number {
    const categories = this.report()?.categories ?? [];
    return categories.length ? Math.max(...categories.map(c => c.total)) : 0;
  }
}