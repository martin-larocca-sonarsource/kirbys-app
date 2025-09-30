import { Income, Expense, BudgetAnalysis, BudgetRecommendation, ExpenseCategory, Frequency } from '../types';

export const calculateMonthlyAmount = (amount: number, frequency: Frequency): number => {
  switch (frequency) {
    case 'weekly':
      return amount * 4.33; // Average weeks per month
    case 'bi-weekly':
      return amount * 2.17; // Average bi-weekly periods per month
    case 'monthly':
      return amount;
    case 'yearly':
      return amount / 12;
    default:
      return amount;
  }
};

export const calculateTotalMonthlyIncome = (incomes: Income[]): number => {
  return incomes.reduce((total, income) => {
    return total + calculateMonthlyAmount(income.amount, income.frequency);
  }, 0);
};

export const calculateTotalMonthlyExpenses = (expenses: Expense[]): number => {
  const currentMonth = new Date();
  const currentYear = currentMonth.getFullYear();
  const currentMonthNum = currentMonth.getMonth();

  return expenses.reduce((total, expense) => {
    const expenseDate = new Date(expense.date);
    const isCurrentMonth = expenseDate.getFullYear() === currentYear && 
                          expenseDate.getMonth() === currentMonthNum;
    
    if (isCurrentMonth) {
      return total + expense.amount;
    }
    
    // Handle recurring expenses
    if (expense.isRecurring && expense.frequency) {
      return total + calculateMonthlyAmount(expense.amount, expense.frequency);
    }
    
    return total;
  }, 0);
};

export const calculateBudgetAnalysis = (
  incomes: Income[],
  expenses: Expense[]
): BudgetAnalysis => {
  const totalIncome = calculateTotalMonthlyIncome(incomes);
  const totalExpenses = calculateTotalMonthlyExpenses(expenses);
  const netIncome = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? (netIncome / totalIncome) * 100 : 0;

  // 50/30/20 rule implementation
  const needsPercentage = 50;
  const wantsPercentage = 30;
  const savingsPercentage = 20;

  const needsAmount = (totalIncome * needsPercentage) / 100;
  const wantsAmount = (totalIncome * wantsPercentage) / 100;
  const savingsAmount = (totalIncome * savingsPercentage) / 100;

  // Calculate actual spending by category
  const categorySpending = calculateCategorySpending(expenses);
  
  const recommendations: BudgetRecommendation[] = [
    {
      category: 'housing',
      recommendedAmount: needsAmount * 0.3, // 30% of needs for housing
      actualAmount: categorySpending.housing,
      percentage: 15,
      status: getBudgetStatus(categorySpending.housing, needsAmount * 0.3)
    },
    {
      category: 'utilities',
      recommendedAmount: needsAmount * 0.2, // 20% of needs for utilities
      actualAmount: categorySpending.utilities,
      percentage: 10,
      status: getBudgetStatus(categorySpending.utilities, needsAmount * 0.2)
    },
    {
      category: 'food',
      recommendedAmount: needsAmount * 0.3, // 30% of needs for food
      actualAmount: categorySpending.food,
      percentage: 15,
      status: getBudgetStatus(categorySpending.food, needsAmount * 0.3)
    },
    {
      category: 'transportation',
      recommendedAmount: needsAmount * 0.2, // 20% of needs for transportation
      actualAmount: categorySpending.transportation,
      percentage: 10,
      status: getBudgetStatus(categorySpending.transportation, needsAmount * 0.2)
    },
    {
      category: 'entertainment',
      recommendedAmount: wantsAmount * 0.4, // 40% of wants for entertainment
      actualAmount: categorySpending.entertainment,
      percentage: 12,
      status: getBudgetStatus(categorySpending.entertainment, wantsAmount * 0.4)
    },
    {
      category: 'shopping',
      recommendedAmount: wantsAmount * 0.6, // 60% of wants for shopping
      actualAmount: categorySpending.shopping,
      percentage: 18,
      status: getBudgetStatus(categorySpending.shopping, wantsAmount * 0.6)
    },
    {
      category: 'savings',
      recommendedAmount: savingsAmount,
      actualAmount: categorySpending.savings,
      percentage: 20,
      status: getBudgetStatus(categorySpending.savings, savingsAmount)
    }
  ];

  return {
    totalIncome,
    totalExpenses,
    netIncome,
    savingsRate,
    recommendations,
    needsPercentage,
    wantsPercentage,
    savingsPercentage
  };
};

const calculateCategorySpending = (expenses: Expense[]): Record<ExpenseCategory, number> => {
  const currentMonth = new Date();
  const currentYear = currentMonth.getFullYear();
  const currentMonthNum = currentMonth.getMonth();

  const categoryTotals: Record<ExpenseCategory, number> = {
    housing: 0,
    utilities: 0,
    food: 0,
    transportation: 0,
    healthcare: 0,
    entertainment: 0,
    shopping: 0,
    education: 0,
    savings: 0,
    debt: 0,
    other: 0
  };

  expenses.forEach(expense => {
    const expenseDate = new Date(expense.date);
    const isCurrentMonth = expenseDate.getFullYear() === currentYear && 
                          expenseDate.getMonth() === currentMonthNum;
    
    if (isCurrentMonth || (expense.isRecurring && expense.frequency)) {
      const amount = expense.isRecurring && expense.frequency 
        ? calculateMonthlyAmount(expense.amount, expense.frequency)
        : expense.amount;
      
      categoryTotals[expense.category] += amount;
    }
  });

  return categoryTotals;
};

const getBudgetStatus = (actual: number, recommended: number): 'over' | 'under' | 'on-track' => {
  const tolerance = recommended * 0.1; // 10% tolerance
  if (actual > recommended + tolerance) return 'over';
  if (actual < recommended - tolerance) return 'under';
  return 'on-track';
};
