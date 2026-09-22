export interface CategoryBreakdown {
  categoryId: number;
  categoryName: string;
  total: number;
  percentage: number;
}

export interface MonthlyReport {
  year: number;
  month: number;
  totalExpense: number;
  categories: CategoryBreakdown[];
}

export interface CategorySummary {
  totalExpense: number;
  categories: CategoryBreakdown[];
}