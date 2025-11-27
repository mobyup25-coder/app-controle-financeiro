'use client';

import { Lightbulb, TrendingUp } from 'lucide-react';
import { Expense } from '@/lib/types';

interface SuggestionsProps {
  expenses: Expense[];
}

export default function Suggestions({ expenses }: SuggestionsProps) {
  const imprevisto = expenses.filter(exp => exp.category === 'imprevisto');
  const highExpenses = imprevisto.filter(exp => exp.amount > 100);

  const totalImprevisto = imprevisto.reduce((sum, exp) => sum + exp.amount, 0);
  const potentialSavings = highExpenses.reduce((sum, exp) => sum + exp.amount, 0) * 0.5; // 50% de economia

  const estimatedDividend = potentialSavings * 0.05 / 12; // 5% ao ano, mensal

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-yellow-500" />
          Sugestões de Cortes
        </h3>
        {highExpenses.length > 0 ? (
          <div className="space-y-2">
            {highExpenses.map(expense => (
              <p key={expense.id} className="text-sm">
                Considere reduzir o gasto com "{expense.description}" (R$ {expense.amount.toFixed(2)}).
              </p>
            ))}
            <p className="text-sm font-medium text-green-600">
              Potencial economia: R$ {potentialSavings.toFixed(2)} por mês.
            </p>
          </div>
        ) : (
          <p className="text-sm text-gray-500">Seus gastos imprevistos estão controlados!</p>
        )}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-500" />
          Recomendações de Investimentos
        </h3>
        <p className="text-sm mb-2">
          Com a economia potencial de R$ {potentialSavings.toFixed(2)} por mês, você poderia investir em fundos de dividendos.
        </p>
        <p className="text-sm">
          Estimativa de dividendos mensais (5% ao ano): R$ {estimatedDividend.toFixed(2)}.
        </p>
        <p className="text-xs text-gray-500 mt-2">
          *Estimativa simplificada. Consulte um especialista financeiro.
        </p>
      </div>
    </div>
  );
}