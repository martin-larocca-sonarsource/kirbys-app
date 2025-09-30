import React, { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Expense, ExpenseCategory, Frequency } from '../types';
import './ExpenseTracking.css';

interface ExpenseTrackingProps {
  expenses: Expense[];
  onAdd: (expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdate: (id: string, expense: Partial<Expense>) => void;
  onDelete: (id: string) => void;
}

const ExpenseTracking: React.FC<ExpenseTrackingProps> = ({ expenses, onAdd, onUpdate, onDelete }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: 'other' as ExpenseCategory,
    isRecurring: false,
    frequency: 'monthly' as Frequency,
    date: new Date().toISOString().split('T')[0]
  });

  const categories: { value: ExpenseCategory; label: string }[] = [
    { value: 'housing', label: 'Housing' },
    { value: 'utilities', label: 'Utilities' },
    { value: 'food', label: 'Food' },
    { value: 'transportation', label: 'Transportation' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'shopping', label: 'Shopping' },
    { value: 'education', label: 'Education' },
    { value: 'savings', label: 'Savings' },
    { value: 'debt', label: 'Debt' },
    { value: 'other', label: 'Other' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(formData.amount);
    
    if (!formData.description.trim() || isNaN(amount) || amount <= 0) {
      return;
    }

    const expenseData = {
      description: formData.description,
      amount,
      category: formData.category,
      isRecurring: formData.isRecurring,
      frequency: formData.isRecurring ? formData.frequency : undefined,
      date: new Date(formData.date)
    };

    if (editingId) {
      onUpdate(editingId, expenseData);
      setEditingId(null);
    } else {
      onAdd(expenseData);
    }

    setFormData({
      description: '',
      amount: '',
      category: 'other',
      isRecurring: false,
      frequency: 'monthly',
      date: new Date().toISOString().split('T')[0]
    });
    setShowForm(false);
  };

  const handleEdit = (expense: Expense) => {
    setFormData({
      description: expense.description,
      amount: expense.amount.toString(),
      category: expense.category,
      isRecurring: expense.isRecurring,
      frequency: expense.frequency || 'monthly',
      date: expense.date.toISOString().split('T')[0]
    });
    setEditingId(expense.id);
    setShowForm(true);
  };

  const handleCancel = () => {
    setFormData({
      description: '',
      amount: '',
      category: 'other',
      isRecurring: false,
      frequency: 'monthly',
      date: new Date().toISOString().split('T')[0]
    });
    setShowForm(false);
    setEditingId(null);
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="expense-tracking">
      <div className="expense-header">
        <h2>Expense Tracking</h2>
        <button 
          className="add-button"
          onClick={() => setShowForm(true)}
          type="button"
        >
          <Plus className="icon" />
          Add Expense
        </button>
      </div>

      {showForm && (
        <div className="expense-form-container">
          <form onSubmit={handleSubmit} className="expense-form">
            <h3>{editingId ? 'Edit Expense' : 'Add New Expense'}</h3>
            
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <input
                id="description"
                type="text"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="e.g., Groceries, Rent, Gas"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="amount">Amount</label>
              <input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                placeholder="0.00"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as ExpenseCategory }))}
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="date">Date</label>
              <input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                required
              />
            </div>

            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.isRecurring}
                  onChange={(e) => setFormData(prev => ({ ...prev, isRecurring: e.target.checked }))}
                />
                <span>Recurring expense</span>
              </label>
            </div>

            {formData.isRecurring && (
              <div className="form-group">
                <label htmlFor="frequency">Frequency</label>
                <select
                  id="frequency"
                  value={formData.frequency}
                  onChange={(e) => setFormData(prev => ({ ...prev, frequency: e.target.value as Frequency }))}
                >
                  <option value="weekly">Weekly</option>
                  <option value="bi-weekly">Bi-weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
            )}

            <div className="form-actions">
              <button type="submit" className="submit-button">
                {editingId ? 'Update' : 'Add'} Expense
              </button>
              <button type="button" onClick={handleCancel} className="cancel-button">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="expense-list">
        {expenses.length === 0 ? (
          <div className="empty-state">
            <p>No expenses added yet.</p>
            <p>Click "Add Expense" to get started.</p>
          </div>
        ) : (
          expenses.map((expense) => (
            <div key={expense.id} className="expense-item">
              <div className="expense-details">
                <h4>{expense.description}</h4>
                <p className="expense-amount">{formatCurrency(expense.amount)}</p>
                <p className="expense-category">{expense.category}</p>
                <p className="expense-date">{formatDate(expense.date)}</p>
                {expense.isRecurring && (
                  <span className="recurring-badge">Recurring ({expense.frequency})</span>
                )}
              </div>
              <div className="expense-actions">
                <button
                  onClick={() => handleEdit(expense)}
                  className="edit-button"
                  type="button"
                >
                  <Edit className="icon" />
                </button>
                <button
                  onClick={() => onDelete(expense.id)}
                  className="delete-button"
                  type="button"
                >
                  <Trash2 className="icon" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ExpenseTracking;
