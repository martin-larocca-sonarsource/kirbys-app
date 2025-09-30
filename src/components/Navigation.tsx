import React from 'react';
import { Home, DollarSign, CreditCard, TrendingUp } from 'lucide-react';
import './Navigation.css';

interface NavigationProps {
  activeTab: 'dashboard' | 'income' | 'expenses' | 'budget';
  onTabChange: (tab: 'dashboard' | 'income' | 'expenses' | 'budget') => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'income', label: 'Income', icon: DollarSign },
    { id: 'expenses', label: 'Expenses', icon: CreditCard },
    { id: 'budget', label: 'Budget', icon: TrendingUp }
  ] as const;

  return (
    <nav className="navigation">
      <div className="navigation-container">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            className={`navigation-tab ${activeTab === id ? 'active' : ''}`}
            onClick={() => onTabChange(id)}
            type="button"
          >
            <Icon className="navigation-icon" />
            <span className="navigation-label">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;
