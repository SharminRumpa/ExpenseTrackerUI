import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

// export const routes: Routes = [
//   { path: '', redirectTo: 'login', pathMatch: 'full' },
//   { path: 'login', loadComponent: () => import('./features/auth/login/login').then(m => m.LoginComponent) },
//   { path: 'register', loadComponent: () => import('./features/auth/register/register').then(m => m.RegisterComponent) },
//   // Add this once Dashboard exists:
//   // { path: 'dashboard', loadComponent: () => ..., canActivate: [authGuard] },
//   { path: 'expenses', loadComponent: () => import('./features/expenses/expense-list/expense-list').then(m => m.ExpenseList) },
//   { path: 'expenses/new', loadComponent: () => import('./features/expenses/expense-form/expense-form').then(m => m.ExpenseForm) },
//   { path: 'expenses/:id/edit', loadComponent: () => import('./features/expenses/expense-form/expense-form').then(m => m.ExpenseForm) },
//   { path: 'reports', loadComponent: () => import('./features/reports/reports').then(m => m.Reports) },
// ];

export const routes: Routes = [

{
  path: '',
  loadComponent: () => import('./shared/components/layout/layout').then(m => m.Layout),
  canActivate: [authGuard],   // ← guards ALL children below at once
  children: [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'dashboard', loadComponent: () => import('./features/dashboard/dashboard').then(m => m.Dashboard) },
    { path: 'expenses', loadComponent: () => import('./features/expenses/expense-list/expense-list').then(m => m.ExpenseList) },
    { path: 'expenses/new', loadComponent: () => import('./features/expenses/expense-form/expense-form').then(m => m.ExpenseForm) },
    { path: 'expenses/:id/edit', loadComponent: () => import('./features/expenses/expense-form/expense-form').then(m => m.ExpenseForm) },
    { path: 'reports', loadComponent: () => import('./features/reports/reports').then(m => m.Reports) },
  ]
}
]
