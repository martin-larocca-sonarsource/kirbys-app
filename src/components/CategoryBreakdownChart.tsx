import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import './CategoryBreakdownChart.css';

interface CategoryData {
  category: string;
  amount: number;
  percentage: number;
}

interface CategoryBreakdownChartProps {
  data: CategoryData[];
}

const COLORS = [
  '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', 
  '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43',
  '#10ac84', '#ee5a24', '#0abde3', '#c44569', '#f8b500'
];

const CategoryBreakdownChart: React.FC<CategoryBreakdownChartProps> = ({ data }) => {
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="chart-tooltip">
          <p className="tooltip-label">{data.category}</p>
          <p className="tooltip-item">
            Amount: {formatCurrency(data.amount)}
          </p>
          <p className="tooltip-item">
            Percentage: {data.percentage.toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="category-breakdown-chart">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ category, percentage }) => `${category}: ${percentage.toFixed(1)}%`}
            outerRadius={90}
            innerRadius={30}
            fill="#8884d8"
            dataKey="amount"
            animationBegin={0}
            animationDuration={1500}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CategoryBreakdownChart;
