import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ExpenseService } from '../../../core/services/expense.service';
import { CategoryService, Category } from '../../../core/services/category.service';

@Component({
  selector: 'app-expense-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './expense-form.html',
  styleUrl: './expense-form.scss'
})
export class ExpenseForm implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private expenseService = inject(ExpenseService);
  private categoryService = inject(CategoryService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  categories = signal<Category[]>([]);
  isEditMode = signal(false);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  expenseId: number | null = null;

  form = this.fb.group({
    categoryId: [null as number | null, Validators.required],
    amount: [null as number | null, [Validators.required, Validators.min(0.01)]],
    description: [''],
    expenseDate: [new Date().toISOString().substring(0, 10), Validators.required]
  });

  ngOnInit(): void {
    this.categoryService.getAll().subscribe(cats => this.categories.set(cats));

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.expenseId = Number(idParam);
      this.isEditMode.set(true);
      this.expenseService.getById(this.expenseId).subscribe(exp => {
        this.form.patchValue({
          categoryId: exp.categoryId,
          amount: exp.amount,
          description: exp.description ?? '',
          expenseDate: exp.expenseDate.substring(0, 10)
        });
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const { categoryId, amount, description, expenseDate } = this.form.getRawValue();
    this.isLoading.set(true);
    this.errorMessage.set(null);

    if (this.isEditMode() && this.expenseId) {
      this.expenseService.update(this.expenseId, {
        categoryId: categoryId!, amount: amount!, description, expenseDate: expenseDate!
      }).subscribe({
        next: () => this.router.navigate(['/expenses']),
        error: () => { this.isLoading.set(false); this.errorMessage.set('Failed to update expense.'); }
      });
    } else {
      const userId = this.authService.getUserId();
      if (!userId) return;

      this.expenseService.create({
        userId, categoryId: categoryId!, amount: amount!, description, expenseDate: expenseDate!
      }).subscribe({
        next: () => this.router.navigate(['/expenses']),
        error: () => { this.isLoading.set(false); this.errorMessage.set('Failed to create expense.'); }
      });
    }
  }
}