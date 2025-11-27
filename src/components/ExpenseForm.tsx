'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus } from 'lucide-react';
import { Expense } from '@/lib/types';
import { addExpense } from '@/lib/storage';

const expenseSchema = z.object({
  description: z.string().min(1, 'Descrição é obrigatória'),
  amount: z.number().min(0.01, 'Valor deve ser maior que zero'),
  category: z.enum(['alimentacao', 'transporte', 'moradia', 'saude', 'educacao', 'lazer', 'investimento', 'outros']),
  type: z.enum(['receita', 'despesa']),
  paymentMethod: z.enum(['dinheiro', 'debito', 'credito', 'pix', 'transferencia']),
  notes: z.string().optional(),
});

type ExpenseFormData = z.infer<typeof expenseSchema>;

interface ExpenseFormProps {
  onExpenseAdded: () => void;
}

export default function ExpenseForm({ onExpenseAdded }: ExpenseFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      type: 'despesa',
      category: 'outros',
      paymentMethod: 'pix',
    },
  });

  const transactionType = watch('type');

  const onSubmit = (data: ExpenseFormData) => {
    setIsSubmitting(true);
    const expense: Expense = {
      id: Date.now().toString(),
      ...data,
      date: new Date().toISOString(),
    };
    addExpense(expense);
    reset({
      type: 'despesa',
      category: 'outros',
      paymentMethod: 'pix',
    });
    onExpenseAdded();
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-800">
        <Plus className="w-6 h-6 text-blue-600" />
        Nova Transação
      </h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700">Tipo de Transação</label>
          <select {...register('type')} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="despesa">💸 Despesa</option>
            <option value="receita">💰 Receita</option>
          </select>
          {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700">Descrição</label>
          <input
            {...register('description')}
            type="text"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ex: Supermercado, Salário, Aluguel..."
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700">Valor (R$)</label>
          <input
            {...register('amount', { valueAsNumber: true })}
            type="number"
            step="0.01"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0.00"
          />
          {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700">Categoria</label>
          <select {...register('category')} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="alimentacao">🍔 Alimentação</option>
            <option value="transporte">🚗 Transporte</option>
            <option value="moradia">🏠 Moradia</option>
            <option value="saude">💊 Saúde</option>
            <option value="educacao">📚 Educação</option>
            <option value="lazer">🎮 Lazer</option>
            <option value="investimento">📈 Investimento</option>
            <option value="outros">📦 Outros</option>
          </select>
          {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700">Forma de Pagamento</label>
          <select {...register('paymentMethod')} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="pix">📱 PIX</option>
            <option value="dinheiro">💵 Dinheiro</option>
            <option value="debito">💳 Débito</option>
            <option value="credito">💳 Crédito</option>
            <option value="transferencia">🏦 Transferência</option>
          </select>
          {errors.paymentMethod && <p className="text-red-500 text-sm mt-1">{errors.paymentMethod.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700">Observações (opcional)</label>
          <textarea
            {...register('notes')}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={3}
            placeholder="Adicione detalhes sobre esta transação..."
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 ${
            transactionType === 'receita'
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-blue-600 hover:bg-blue-700'
          } disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg`}
        >
          {isSubmitting ? 'Salvando...' : transactionType === 'receita' ? '✅ Adicionar Receita' : '➕ Adicionar Despesa'}
        </button>
      </div>
    </form>
  );
}
