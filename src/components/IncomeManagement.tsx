import React, { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Income, Frequency } from '../types';
import './IncomeManagement.css';

interface IncomeManagementProps {
  incomes: Income[];
  onAdd: (income: Omit<Income, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdate: (id: string, income: Partial<Income>) => void;
  onDelete: (id: string) => void;
}

const IncomeManagement: React.FC<IncomeManagementProps> = ({ incomes, onAdd, onUpdate, onDelete }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    source: '',
    amount: '',
    frequency: 'monthly' as Frequency
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(formData.amount);
    
    if (!formData.source.trim() || isNaN(amount) || amount <= 0) {
      return;
    }

    if (editingId) {
      onUpdate(editingId, {
        source: formData.source,
        amount,
        frequency: formData.frequency
      });
      setEditingId(null);
    } else {
      onAdd({
        source: formData.source,
        amount,
        frequency: formData.frequency
      });
    }

    setFormData({ source: '', amount: '', frequency: 'monthly' });
    setShowForm(false);
  };

  const handleEdit = (income: Income) => {
    setFormData({
      source: income.source,
      amount: income.amount.toString(),
      frequency: income.frequency
    });
    setEditingId(income.id);
    setShowForm(true);
  };

  const handleCancel = () => {
    setFormData({ source: '', amount: '', frequency: 'monthly' });
    setShowForm(false);
    setEditingId(null);
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="income-management">
      <div className="income-header">
        <h2>Income Management</h2>
        <button 
          className="add-button"
          onClick={() => setShowForm(true)}
          type="button"
        >
          <Plus className="icon" />
          Add Income
        </button>
      </div>

      {showForm && (
        <div className="income-form-container">
          <form onSubmit={handleSubmit} className="income-form">
            <h3>{editingId ? 'Edit Income' : 'Add New Income'}</h3>
            
            <div className="form-group">
              <label htmlFor="source">Income Source</label>
              <input
                id="source"
                type="text"
                value={formData.source}
                onChange={(e) => setFormData(prev => ({ ...prev, source: e.target.value }))}
                placeholder="e.g., Salary, Freelance, Investment"
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

            <div className="form-actions">
              <button type="submit" className="submit-button">
                {editingId ? 'Update' : 'Add'} Income
              </button>
              <button type="button" onClick={handleCancel} className="cancel-button">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="income-list">
        {incomes.length === 0 ? (
          <div className="empty-state">
            <p>No income sources added yet.</p>
            <p>Click "Add Income" to get started.</p>
          </div>
        ) : (
          incomes.map((income) => (
            <div key={income.id} className="income-item">
              <div className="income-details">
                <h4>{income.source}</h4>
                <p className="income-amount">{formatCurrency(income.amount)}</p>
                <p className="income-frequency">{income.frequency}</p>
              </div>
              <div className="income-actions">
                <button
                  onClick={() => handleEdit(income)}
                  className="edit-button"
                  type="button"
                >
                  <Edit className="icon" />
                </button>
                <button
                  onClick={() => onDelete(income.id)}
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

export default IncomeManagement;
