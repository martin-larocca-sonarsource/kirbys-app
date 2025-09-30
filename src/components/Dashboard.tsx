import React from 'react';
import { FinancialData } from '../types';
import { calculateTotalMonthlyIncome, calculateTotalMonthlyExpenses } from '../utils/calculations';
import SummaryCards from './SummaryCards';
import MonthlyTrendChart from './MonthlyTrendChart';
import CategoryBreakdownChart from './CategoryBreakdownChart';
import './Dashboard.css';

interface DashboardProps {
  financialData: FinancialData;
}

const Dashboard: React.FC<DashboardProps> = ({ financialData }) => {
  const totalIncome = calculateTotalMonthlyIncome(financialData.incomes);
  const totalExpenses = calculateTotalMonthlyExpenses(financialData.expenses);
  const netIncome = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? (netIncome / totalIncome) * 100 : 0;

  // Calculate category breakdown
  const categoryBreakdown = calculateCategoryBreakdown(financialData.expenses);

  // Calculate monthly trend (last 6 months)
  const monthlyTrend = calculateMonthlyTrend(financialData.incomes, financialData.expenses);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Financial Overview</h2>
        <p>Track your financial health and spending patterns</p>
      </div>

      <SummaryCards
        totalIncome={totalIncome}
        totalExpenses={totalExpenses}
        netIncome={netIncome}
        savingsRate={savingsRate}
      />

      <div className="dashboard-charts">
        <div className="chart-container">
          <h3>Monthly Trend</h3>
          <MonthlyTrendChart data={monthlyTrend} />
        </div>

        <div className="chart-container">
          <h3>Spending by Category</h3>
          <CategoryBreakdownChart data={categoryBreakdown} />
        </div>
      </div>
    </div>
  );
};

const calculateCategoryBreakdown = (expenses: FinancialData['expenses']) => {
  const currentMonth = new Date();
  const currentYear = currentMonth.getFullYear();
  const currentMonthNum = currentMonth.getMonth();

  const categoryTotals: Record<string, number> = {};

  expenses.forEach(expense => {
    const expenseDate = new Date(expense.date);
    const isCurrentMonth = expenseDate.getFullYear() === currentYear && 
                          expenseDate.getMonth() === currentMonthNum;
    
    if (isCurrentMonth || (expense.isRecurring && expense.frequency)) {
      if (!categoryTotals[expense.category]) {
        categoryTotals[expense.category] = 0;
      }
      categoryTotals[expense.category] += expense.amount;
    }
  });

  const total = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0);

  return Object.entries(categoryTotals).map(([category, amount]) => ({
    category,
    amount,
    percentage: total > 0 ? (amount / total) * 100 : 0
  }));
};

const calculateMonthlyTrend = (incomes: FinancialData['incomes'], expenses: FinancialData['expenses']) => {
  const months = [];
  const currentDate = new Date();
  
  for (let i = 5; i >= 0; i--) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    const monthName = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    
    // Calculate income for this month
    const monthIncome = incomes.reduce((total, income) => {
      return total + calculateMonthlyAmount(income.amount, income.frequency);
    }, 0);
    
    // Calculate expenses for this month
    const monthExpenses = expenses.reduce((total, expense) => {
      const expenseDate = new Date(expense.date);
      const isSameMonth = expenseDate.getFullYear() === date.getFullYear() && 
                         expenseDate.getMonth() === date.getMonth();
      
      if (isSameMonth) {
        return total + expense.amount;
      }
      
      if (expense.isRecurring && expense.frequency) {
        return total + calculateMonthlyAmount(expense.amount, expense.frequency);
      }
      
      return total;
    }, 0);
    
    months.push({
      month: monthName,
      income: monthIncome,
      expenses: monthExpenses
    });
  }
  
  return months;
};

const calculateMonthlyAmount = (amount: number, frequency: string): number => {
  switch (frequency) {
    case 'weekly':
      return amount * 4.33;
    case 'bi-weekly':
      return amount * 2.17;
    case 'monthly':
      return amount;
    case 'yearly':
      return amount / 12;
    default:
      return amount;
  }
};

export default Dashboard;
