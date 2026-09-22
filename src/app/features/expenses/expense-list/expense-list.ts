import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { ExpenseService } from '../../../core/services/expense.service';
import { CategoryService, Category } from '../../../core/services/category.service';
import { Expense, ExpenseFilter } from '../../../shared/models/expense.model';

@Component({
  selector: 'app-expense-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './expense-list.html',
  styleUrl: './expense-list.scss'
})
export class ExpenseList implements OnInit {
  private authService = inject(AuthService);
  private expenseService = inject(ExpenseService);
  private categoryService = inject(CategoryService);

  expenses = signal<Expense[]>([]);
  categories = signal<Category[]>([]);
  isLoading = signal(true);
  deletingId = signal<number | null>(null);

  filter: ExpenseFilter = {};

  ngOnInit(): void {
    this.categoryService.getAll().subscribe(cats => this.categories.set(cats));
    this.loadExpenses();
  }

  loadExpenses(): void {
    const userId = this.authService.getUserId();
    if (!userId) return;

    this.isLoading.set(true);
    this.expenseService.getFiltered({ ...this.filter, userId }).subscribe(expenses => {
      this.expenses.set(expenses);
      this.isLoading.set(false);
    });
  }

  onFilterChange(): void {
    this.loadExpenses();
  }

  clearFilters(): void {
    this.filter = {};
    this.loadExpenses();
  }

  confirmDelete(id: number): void {
    this.deletingId.set(id);
  }

  cancelDelete(): void {
    this.deletingId.set(null);
  }

  deleteExpense(id: number): void {
    this.expenseService.delete(id).subscribe(() => {
      this.deletingId.set(null);
      this.loadExpenses();
    });
  }
}