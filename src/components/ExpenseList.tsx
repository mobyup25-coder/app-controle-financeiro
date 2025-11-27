'use client';

import { useState } from 'react';
import { Trash2, Edit2, Check, X } from 'lucide-react';
import { Expense } from '@/lib/types';
import { deleteExpense, updateExpense } from '@/lib/storage';

interface ExpenseListProps {
  expenses: Expense[];
  onExpenseDeleted: () => void;
}

export default function ExpenseList({ expenses, onExpenseDeleted }: ExpenseListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Expense>>({});

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta transação?')) {
      deleteExpense(id);
      onExpenseDeleted();
    }
  };

  const startEdit = (expense: Expense) => {
    setEditingId(expense.id);
    setEditForm({
      description: expense.description,
      amount: expense.amount,
      category: expense.category,
      type: expense.type,
      paymentMethod: expense.paymentMethod,
      notes: expense.notes,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = (id: string) => {
    if (editForm.description && editForm.amount && editForm.amount > 0) {
      updateExpense(id, editForm);
      setEditingId(null);
      setEditForm({});
      onExpenseDeleted();
    }
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      alimentacao: '🍔',
      transporte: '🚗',
      moradia: '🏠',
      saude: '💊',
      educacao: '📚',
      lazer: '🎮',
      investimento: '📈',
      outros: '📦',
    };
    return icons[category] || '📦';
  };

  const getPaymentIcon = (method: string) => {
    const icons: Record<string, string> = {
      pix: '📱',
      dinheiro: '💵',
      debito: '💳',
      credito: '💳',
      transferencia: '🏦',
    };
    return icons[method] || '💳';
  };

  const receitas = expenses.filter(exp => exp.type === 'receita');
  const despesas = expenses.filter(exp => exp.type === 'despesa');

  const renderExpenseItem = (expense: Expense) => {
    const isEditing = editingId === expense.id;

    if (isEditing) {
      return (
        <div key={expense.id} className="bg-blue-50 p-4 rounded-lg border-2 border-blue-300">
          <div className="space-y-3">
            <input
              type="text"
              value={editForm.description || ''}
              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Descrição"
            />
            <input
              type="number"
              step="0.01"
              value={editForm.amount || ''}
              onChange={(e) => setEditForm({ ...editForm, amount: parseFloat(e.target.value) })}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Valor"
            />
            <select
              value={editForm.category || ''}
              onChange={(e) => setEditForm({ ...editForm, category: e.target.value as any })}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="alimentacao">🍔 Alimentação</option>
              <option value="transporte">🚗 Transporte</option>
              <option value="moradia">🏠 Moradia</option>
              <option value="saude">💊 Saúde</option>
              <option value="educacao">📚 Educação</option>
              <option value="lazer">🎮 Lazer</option>
              <option value="investimento">📈 Investimento</option>
              <option value="outros">📦 Outros</option>
            </select>
            <select
              value={editForm.paymentMethod || ''}
              onChange={(e) => setEditForm({ ...editForm, paymentMethod: e.target.value as any })}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="pix">📱 PIX</option>
              <option value="dinheiro">💵 Dinheiro</option>
              <option value="debito">💳 Débito</option>
              <option value="credito">💳 Crédito</option>
              <option value="transferencia">🏦 Transferência</option>
            </select>
            <textarea
              value={editForm.notes || ''}
              onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md resize-none"
              rows={2}
              placeholder="Observações"
            />
            <div className="flex gap-2">
              <button
                onClick={() => saveEdit(expense.id)}
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" /> Salvar
              </button>
              <button
                onClick={cancelEdit}
                className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 flex items-center justify-center gap-2"
              >
                <X className="w-4 h-4" /> Cancelar
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div
        key={expense.id}
        className={`p-4 rounded-lg border-l-4 ${
          expense.type === 'receita' ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'
        } hover:shadow-md transition-shadow`}
      >
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">{getCategoryIcon(expense.category)}</span>
              <h4 className="font-semibold text-gray-800">{expense.description}</h4>
            </div>
            <p className={`text-2xl font-bold mb-2 ${expense.type === 'receita' ? 'text-green-700' : 'text-red-700'}`}>
              {expense.type === 'receita' ? '+' : '-'} R$ {expense.amount.toFixed(2)}
            </p>
            <div className="flex flex-wrap gap-2 text-sm text-gray-600">
              <span className="bg-white px-2 py-1 rounded-md border border-gray-200">
                {getPaymentIcon(expense.paymentMethod)} {expense.paymentMethod.toUpperCase()}
              </span>
              <span className="bg-white px-2 py-1 rounded-md border border-gray-200">
                📅 {new Date(expense.date).toLocaleDateString('pt-BR')}
              </span>
            </div>
            {expense.notes && (
              <p className="mt-2 text-sm text-gray-600 italic bg-white p-2 rounded-md border border-gray-200">
                💬 {expense.notes}
              </p>
            )}
          </div>
          <div className="flex gap-2 ml-4">
            <button
              onClick={() => startEdit(expense)}
              className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-100 rounded-md transition-colors"
              title="Editar"
            >
              <Edit2 className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleDelete(expense.id)}
              className="text-red-600 hover:text-red-800 p-2 hover:bg-red-100 rounded-md transition-colors"
              title="Excluir"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold mb-4 text-green-700 flex items-center gap-2">
          💰 Receitas ({receitas.length})
        </h3>
        <div className="space-y-3">
          {receitas.map(renderExpenseItem)}
          {receitas.length === 0 && (
            <p className="text-gray-500 text-center py-8 bg-gray-50 rounded-lg">
              Nenhuma receita registrada ainda.
            </p>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold mb-4 text-red-700 flex items-center gap-2">
          💸 Despesas ({despesas.length})
        </h3>
        <div className="space-y-3">
          {despesas.map(renderExpenseItem)}
          {despesas.length === 0 && (
            <p className="text-gray-500 text-center py-8 bg-gray-50 rounded-lg">
              Nenhuma despesa registrada ainda.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
