import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './MonthlyTrendChart.css';

interface MonthlyTrendData {
  month: string;
  income: number;
  expenses: number;
}

interface MonthlyTrendChartProps {
  data: MonthlyTrendData[];
}

const MonthlyTrendChart: React.FC<MonthlyTrendChartProps> = ({ data }) => {
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="chart-tooltip">
          <p className="tooltip-label">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="tooltip-item" style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="monthly-trend-chart">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <defs>
            <linearGradient id="incomeGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            <linearGradient id="expenseGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.3)" />
          <XAxis 
            dataKey="month" 
            stroke="#6b7280"
            fontSize={12}
            tick={{ fill: '#6b7280' }}
          />
          <YAxis 
            stroke="#6b7280"
            fontSize={12}
            tickFormatter={formatCurrency}
            tick={{ fill: '#6b7280' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="income"
            stroke="url(#incomeGradient)"
            strokeWidth={4}
            dot={{ fill: '#10b981', strokeWidth: 3, r: 6 }}
            name="Income"
            strokeDasharray="0"
            animationDuration={2000}
          />
          <Line
            type="monotone"
            dataKey="expenses"
            stroke="url(#expenseGradient)"
            strokeWidth={4}
            dot={{ fill: '#f59e0b', strokeWidth: 3, r: 6 }}
            name="Expenses"
            strokeDasharray="0"
            animationDuration={2000}
            animationBegin={500}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyTrendChart;
