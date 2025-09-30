import React from 'react';
import { DollarSign, TrendingUp, TrendingDown, Target } from 'lucide-react';
import './SummaryCards.css';

interface SummaryCardsProps {
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
  savingsRate: number;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({
  totalIncome,
  totalExpenses,
  netIncome,
  savingsRate
}) => {
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatPercentage = (value: number): string => {
    return `${value.toFixed(1)}%`;
  };

  return (
    <div className="summary-cards">
      <div className="summary-card">
        <div className="summary-card-header">
          <DollarSign className="summary-card-icon income" />
          <h3>Total Income</h3>
        </div>
        <div className="summary-card-value">{formatCurrency(totalIncome)}</div>
        <div className="summary-card-subtitle">Monthly</div>
      </div>

      <div className="summary-card">
        <div className="summary-card-header">
          <TrendingDown className="summary-card-icon expense" />
          <h3>Total Expenses</h3>
        </div>
        <div className="summary-card-value">{formatCurrency(totalExpenses)}</div>
        <div className="summary-card-subtitle">Monthly</div>
      </div>

      <div className={`summary-card ${netIncome >= 0 ? 'positive' : 'negative'}`}>
        <div className="summary-card-header">
          {netIncome >= 0 ? (
            <TrendingUp className="summary-card-icon positive" />
          ) : (
            <TrendingDown className="summary-card-icon negative" />
          )}
          <h3>Net Income</h3>
        </div>
        <div className="summary-card-value">{formatCurrency(netIncome)}</div>
        <div className="summary-card-subtitle">
          {netIncome >= 0 ? 'Surplus' : 'Deficit'}
        </div>
      </div>

      <div className="summary-card">
        <div className="summary-card-header">
          <Target className="summary-card-icon savings" />
          <h3>Savings Rate</h3>
        </div>
        <div className="summary-card-value">{formatPercentage(savingsRate)}</div>
        <div className="summary-card-subtitle">
          {savingsRate >= 20 ? 'Excellent' : savingsRate >= 10 ? 'Good' : 'Needs Improvement'}
        </div>
      </div>
    </div>
  );
};

export default SummaryCards;
