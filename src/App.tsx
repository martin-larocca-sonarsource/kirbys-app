import React, { useState, useEffect } from 'react';
import { FinancialData } from './types';
import { loadFromLocalStorage, saveToLocalStorage } from './utils/storage';
import { calculateBudgetAnalysis } from './utils/calculations';
import Dashboard from './components/Dashboard';
import IncomeManagement from './components/IncomeManagement';
import ExpenseTracking from './components/ExpenseTracking';
import BudgetAnalysis from './components/BudgetAnalysis';
import Navigation from './components/Navigation';
import './styles/App.css';

type Tab = 'dashboard' | 'income' | 'expenses' | 'budget';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [financialData, setFinancialData] = useState<FinancialData>({
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
  });

  useEffect(() => {
    const loadedData = loadFromLocalStorage();
    const updatedBudgetAnalysis = calculateBudgetAnalysis(loadedData.incomes, loadedData.expenses);
    setFinancialData({
      ...loadedData,
      budgetAnalysis: updatedBudgetAnalysis
    });
  }, []);

  useEffect(() => {
    const updatedBudgetAnalysis = calculateBudgetAnalysis(financialData.incomes, financialData.expenses);
    const updatedData = {
      ...financialData,
      budgetAnalysis: updatedBudgetAnalysis
    };
    setFinancialData(updatedData);
    saveToLocalStorage(updatedData);
  }, [financialData.incomes, financialData.expenses]);

  const handleIncomeAdd = (income: Omit<FinancialData['incomes'][0], 'id' | 'createdAt' | 'updatedAt'>) => {
    const newIncome = {
      ...income,
      id: `income-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setFinancialData(prev => ({
      ...prev,
      incomes: [...prev.incomes, newIncome]
    }));
  };

  const handleIncomeUpdate = (id: string, updatedIncome: Partial<FinancialData['incomes'][0]>) => {
    setFinancialData(prev => ({
      ...prev,
      incomes: prev.incomes.map(income => 
        income.id === id 
          ? { ...income, ...updatedIncome, updatedAt: new Date() }
          : income
      )
    }));
  };

  const handleIncomeDelete = (id: string) => {
    setFinancialData(prev => ({
      ...prev,
      incomes: prev.incomes.filter(income => income.id !== id)
    }));
  };

  const handleExpenseAdd = (expense: Omit<FinancialData['expenses'][0], 'id' | 'createdAt' | 'updatedAt'>) => {
    const newExpense = {
      ...expense,
      id: `expense-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setFinancialData(prev => ({
      ...prev,
      expenses: [...prev.expenses, newExpense]
    }));
  };

  const handleExpenseUpdate = (id: string, updatedExpense: Partial<FinancialData['expenses'][0]>) => {
    setFinancialData(prev => ({
      ...prev,
      expenses: prev.expenses.map(expense => 
        expense.id === id 
          ? { ...expense, ...updatedExpense, updatedAt: new Date() }
          : expense
      )
    }));
  };

  const handleExpenseDelete = (id: string) => {
    setFinancialData(prev => ({
      ...prev,
      expenses: prev.expenses.filter(expense => expense.id !== id)
    }));
  };

  const renderActiveTab = (): React.ReactNode => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard financialData={financialData} />;
      case 'income':
        return (
          <IncomeManagement
            incomes={financialData.incomes}
            onAdd={handleIncomeAdd}
            onUpdate={handleIncomeUpdate}
            onDelete={handleIncomeDelete}
          />
        );
      case 'expenses':
        return (
          <ExpenseTracking
            expenses={financialData.expenses}
            onAdd={handleExpenseAdd}
            onUpdate={handleExpenseUpdate}
            onDelete={handleExpenseDelete}
          />
        );
      case 'budget':
        return <BudgetAnalysis budgetAnalysis={financialData.budgetAnalysis} />;
      default:
        return <Dashboard financialData={financialData} />;
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">Kirby's Budget App</h1>
        <p className="app-subtitle">Your Personal Budget Companion</p>
      </header>
      
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="app-main">
        {renderActiveTab()}
      </main>
    </div>
  );
};

export default App;
