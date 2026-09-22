export interface Expense {
  id: number;
  userId: number;
  categoryId: number;
  categoryName: string;
  amount: number;
  description: string | null;
  expenseDate: string;
  createdAt: string;
}

export interface ExpenseFilter {
  userId?: number;
  categoryId?: number;
  fromDate?: string;
  toDate?: string;
  search?: string;
}