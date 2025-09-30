import React from 'react';
import { TrendingUp, TrendingDown, CheckCircle, AlertCircle } from 'lucide-react';
import { BudgetAnalysis as BudgetAnalysisType } from '../types';
import './BudgetAnalysis.css';

interface BudgetAnalysisProps {
  budgetAnalysis: BudgetAnalysisType;
}

const BudgetAnalysis: React.FC<BudgetAnalysisProps> = ({ budgetAnalysis }) => {
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatPercentage = (value: number): string => {
    return `${value.toFixed(1)}%`;
  };

  const getStatusIcon = (status: 'over' | 'under' | 'on-track') => {
    switch (status) {
      case 'over':
        return <TrendingUp className="status-icon over" />;
      case 'under':
        return <TrendingDown className="status-icon under" />;
      case 'on-track':
        return <CheckCircle className="status-icon on-track" />;
      default:
        return <AlertCircle className="status-icon" />;
    }
  };

  const getStatusText = (status: 'over' | 'under' | 'on-track') => {
    switch (status) {
      case 'over':
        return 'Over Budget';
      case 'under':
        return 'Under Budget';
      case 'on-track':
        return 'On Track';
      default:
        return 'Unknown';
    }
  };

  const getCategoryLabel = (category: string): string => {
    const labels: Record<string, string> = {
      housing: 'Housing',
      utilities: 'Utilities',
      food: 'Food',
      transportation: 'Transportation',
      healthcare: 'Healthcare',
      entertainment: 'Entertainment',
      shopping: 'Shopping',
      education: 'Education',
      savings: 'Savings',
      debt: 'Debt',
      other: 'Other'
    };
    return labels[category] || category;
  };

  return (
    <div className="budget-analysis">
      <div className="budget-header">
        <h2>Budget Analysis</h2>
        <p>Based on the 50/30/20 rule: 50% needs, 30% wants, 20% savings</p>
      </div>

      <div className="budget-summary">
        <div className="summary-card">
          <h3>Total Income</h3>
          <div className="summary-value">{formatCurrency(budgetAnalysis.totalIncome)}</div>
        </div>
        <div className="summary-card">
          <h3>Total Expenses</h3>
          <div className="summary-value">{formatCurrency(budgetAnalysis.totalExpenses)}</div>
        </div>
        <div className="summary-card">
          <h3>Net Income</h3>
          <div className={`summary-value ${budgetAnalysis.netIncome >= 0 ? 'positive' : 'negative'}`}>
            {formatCurrency(budgetAnalysis.netIncome)}
          </div>
        </div>
        <div className="summary-card">
          <h3>Savings Rate</h3>
          <div className="summary-value">{formatPercentage(budgetAnalysis.savingsRate)}</div>
        </div>
      </div>

      <div className="budget-recommendations">
        <h3>Budget Recommendations</h3>
        <div className="recommendations-grid">
          {budgetAnalysis.recommendations.map((recommendation) => (
            <div key={recommendation.category} className="recommendation-card">
              <div className="recommendation-header">
                <h4>{getCategoryLabel(recommendation.category)}</h4>
                {getStatusIcon(recommendation.status)}
              </div>
              
              <div className="recommendation-details">
                <div className="amount-comparison">
                  <div className="amount-item">
                    <span className="label">Recommended:</span>
                    <span className="value">{formatCurrency(recommendation.recommendedAmount)}</span>
                  </div>
                  <div className="amount-item">
                    <span className="label">Actual:</span>
                    <span className="value">{formatCurrency(recommendation.actualAmount)}</span>
                  </div>
                  <div className="amount-item">
                    <span className="label">Percentage:</span>
                    <span className="value">{formatPercentage(recommendation.percentage)}</span>
                  </div>
                </div>
                
                <div className="status-indicator">
                  <span className={`status-text ${recommendation.status}`}>
                    {getStatusText(recommendation.status)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="budget-rules">
        <h3>Budget Rules</h3>
        <div className="rules-grid">
          <div className="rule-card needs">
            <h4>Needs (50%)</h4>
            <p>Essential expenses: housing, utilities, food, transportation</p>
            <div className="rule-amount">
              {formatCurrency((budgetAnalysis.totalIncome * budgetAnalysis.needsPercentage) / 100)}
            </div>
          </div>
          <div className="rule-card wants">
            <h4>Wants (30%)</h4>
            <p>Discretionary spending: entertainment, shopping, dining out</p>
            <div className="rule-amount">
              {formatCurrency((budgetAnalysis.totalIncome * budgetAnalysis.wantsPercentage) / 100)}
            </div>
          </div>
          <div className="rule-card savings">
            <h4>Savings (20%)</h4>
            <p>Emergency fund, retirement, investments</p>
            <div className="rule-amount">
              {formatCurrency((budgetAnalysis.totalIncome * budgetAnalysis.savingsPercentage) / 100)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetAnalysis;
