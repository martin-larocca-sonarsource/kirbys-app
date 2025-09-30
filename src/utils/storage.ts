import { FinancialData, Income, Expense } from '../types';

const STORAGE_KEY = 'heartlines-financial-data';

export const saveToLocalStorage = (data: FinancialData): void => {
  try {
    const serializedData = JSON.stringify({
      ...data,
      incomes: data.incomes.map(income => ({
        ...income,
        createdAt: income.createdAt.toISOString(),
        updatedAt: income.updatedAt.toISOString()
      })),
      expenses: data.expenses.map(expense => ({
        ...expense,
        date: expense.date.toISOString(),
        createdAt: expense.createdAt.toISOString(),
        updatedAt: expense.updatedAt.toISOString()
      }))
    });
    localStorage.setItem(STORAGE_KEY, serializedData);
  } catch (error) {
    console.error('Failed to save data to localStorage:', error);
  }
};

export const loadFromLocalStorage = (): FinancialData => {
  try {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    if (!serializedData) {
      return {
        incomes: [],
        expenses: [],
        budgetAnalysis: {
          totalIncome: 0,
          totalExpenses: 0,
          netIncome: 0,
          savingsRate: 0,
          recommendations: [],
          needsPercentage: 50,
          wantsPercentage: 30,
          savingsPercentage: 20
        }
      };
    }

    const data = JSON.parse(serializedData);
    return {
      ...data,
      incomes: data.incomes.map((income: any) => ({
        ...income,
        createdAt: new Date(income.createdAt),
        updatedAt: new Date(income.updatedAt)
      })),
      expenses: data.expenses.map((expense: any) => ({
        ...expense,
        date: new Date(expense.date),
        createdAt: new Date(expense.createdAt),
        updatedAt: new Date(expense.updatedAt)
      }))
    };
  } catch (error) {
    console.error('Failed to load data from localStorage:', error);
    return {
      incomes: [],
      expenses: [],
      budgetAnalysis: {
        totalIncome: 0,
        totalExpenses: 0,
        netIncome: 0,
        savingsRate: 0,
        recommendations: [],
        needsPercentage: 50,
        wantsPercentage: 30,
        savingsPercentage: 20
      }
    };
  }
};

export const exportToCSV = (data: FinancialData): string => {
  const headers = [
    'Type',
    'Description',
    'Amount',
    'Category',
    'Frequency',
    'Is Recurring',
    'Date',
    'Created At'
  ];

  const rows: string[] = [];

  // Add income data
  data.incomes.forEach(income => {
    rows.push([
      'Income',
      income.source,
      income.amount.toString(),
      '',
      income.frequency,
      'false',
      income.createdAt.toISOString().split('T')[0],
      income.createdAt.toISOString()
    ].join(','));
  });

  // Add expense data
  data.expenses.forEach(expense => {
    rows.push([
      'Expense',
      expense.description,
      expense.amount.toString(),
      expense.category,
      expense.frequency || '',
      expense.isRecurring.toString(),
      expense.date.toISOString().split('T')[0],
      expense.createdAt.toISOString()
    ].join(','));
  });

  return [headers.join(','), ...rows].join('\n');
};

export const importFromCSV = (csvContent: string): { incomes: Income[]; expenses: Expense[] } => {
  const lines = csvContent.split('\n');
  const headers = lines[0].split(',');
  const incomes: Income[] = [];
  const expenses: Expense[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');
    if (values.length < headers.length) continue;

    const type = values[0];
    const description = values[1];
    const amount = parseFloat(values[2]);
    const category = values[3];
    const frequency = values[4] as Frequency;
    const isRecurring = values[5] === 'true';
    const date = new Date(values[6]);
    const createdAt = new Date(values[7]);

    if (isNaN(amount) || amount <= 0) continue;

    const id = `${type.toLowerCase()}-${Date.now()}-${i}`;

    if (type === 'Income') {
      incomes.push({
        id,
        source: description,
        amount,
        frequency: frequency || 'monthly',
        createdAt,
        updatedAt: createdAt
      });
    } else if (type === 'Expense') {
      expenses.push({
        id,
        description,
        amount,
        category: category as any,
        isRecurring,
        frequency: frequency || undefined,
        date,
        createdAt,
        updatedAt: createdAt
      });
    }
  }

  return { incomes, expenses };
};
