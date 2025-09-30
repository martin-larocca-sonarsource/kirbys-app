export type Frequency = 'weekly' | 'bi-weekly' | 'monthly' | 'yearly';

export interface Income {
  id: string;
  source: string;
  amount: number;
  frequency: Frequency;
  createdAt: Date;
  updatedAt: Date;
}

export type ExpenseCategory = 
  | 'housing'
  | 'utilities'
  | 'food'
  | 'transportation'
  | 'healthcare'
  | 'entertainment'
  | 'shopping'
  | 'education'
  | 'savings'
  | 'debt'
  | 'other';

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: ExpenseCategory;
  isRecurring: boolean;
  frequency?: Frequency;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface BudgetRecommendation {
  category: ExpenseCategory;
  recommendedAmount: number;
  actualAmount: number;
  percentage: number;
  status: 'over' | 'under' | 'on-track';
}

export interface BudgetAnalysis {
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
  savingsRate: number;
  recommendations: BudgetRecommendation[];
  needsPercentage: number;
  wantsPercentage: number;
  savingsPercentage: number;
}

export interface FinancialData {
  incomes: Income[];
  expenses: Expense[];
  budgetAnalysis: BudgetAnalysis;
}

export interface DashboardSummary {
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
  savingsRate: number;
  monthlyTrend: {
    month: string;
    income: number;
    expenses: number;
  }[];
  categoryBreakdown: {
    category: ExpenseCategory;
    amount: number;
    percentage: number;
  }[];
}
