'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Expense } from '@/lib/types';

interface CategoryChartProps {
  expenses: Expense[];
}

const COLORS = ['#0088FE', '#00C49F'];

export default function CategoryChart({ expenses }: CategoryChartProps) {
  const recorrenteTotal = expenses
    .filter(exp => exp.category === 'recorrente')
    .reduce((sum, exp) => sum + exp.amount, 0);

  const imprevistoTotal = expenses
    .filter(exp => exp.category === 'imprevisto')
    .reduce((sum, exp) => sum + exp.amount, 0);

  const data = [
    { name: 'Recorrente', value: recorrenteTotal },
    { name: 'Imprevisto', value: imprevistoTotal },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Distribuição de Gastos</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `R$ ${Number(value).toFixed(2)}`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}