'use client';

import { useState } from 'react';
import { UserPlus, DollarSign, Mail, Phone, CreditCard, Trash2, Plus } from 'lucide-react';
import { UserProfile, FixedExpense, Category } from '@/lib/types';
import { saveUserProfile } from '@/lib/storage';

type OnboardingFormProps = {
  onComplete: () => void;
};

export default function OnboardingForm({ onComplete }: OnboardingFormProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    email: '',
    cpf: '',
    phone: '',
    monthlySalary: 0,
    variableIncome: 0,
    fixedExpenses: [],
    onboardingCompleted: false,
  });

  const [newFixedExpense, setNewFixedExpense] = useState({
    description: '',
    amount: 0,
    category: 'outros' as Category,
  });

  const handleAddFixedExpense = () => {
    if (newFixedExpense.description && newFixedExpense.amount > 0) {
      const expense: FixedExpense = {
        id: Date.now().toString(),
        ...newFixedExpense,
      };
      setFormData({
        ...formData,
        fixedExpenses: [...(formData.fixedExpenses || []), expense],
      });
      setNewFixedExpense({ description: '', amount: 0, category: 'outros' });
    }
  };

  const handleRemoveFixedExpense = (id: string) => {
    setFormData({
      ...formData,
      fixedExpenses: formData.fixedExpenses?.filter(exp => exp.id !== id) || [],
    });
  };

  const handleSubmit = () => {
    const profile: UserProfile = {
      email: formData.email || '',
      cpf: formData.cpf || '',
      phone: formData.phone || '',
      monthlySalary: formData.monthlySalary || 0,
      variableIncome: formData.variableIncome,
      fixedExpenses: formData.fixedExpenses || [],
      onboardingCompleted: true,
    };
    saveUserProfile(profile);
    onComplete();
  };

  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const formatPhone = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-8 sm:p-12">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <UserPlus className="w-12 h-12 text-blue-600" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Bem-vindo ao Banco Digital
            </h1>
          </div>
          <p className="text-gray-600">Vamos configurar sua conta em {step === 1 ? '3' : step === 2 ? '2' : '1'} etapas</p>
        </div>

        {/* Progress Bar */}
        <div className="flex gap-2 mb-8">
          <div className={`h-2 flex-1 rounded-full ${step >= 1 ? 'bg-blue-600' : 'bg-gray-200'}`} />
          <div className={`h-2 flex-1 rounded-full ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`} />
          <div className={`h-2 flex-1 rounded-full ${step >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`} />
        </div>

        {/* Step 1: Dados Pessoais */}
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">📋 Dados Pessoais</h2>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                E-mail
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                placeholder="seu@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                CPF
              </label>
              <input
                type="text"
                value={formData.cpf}
                onChange={(e) => setFormData({ ...formData, cpf: formatCPF(e.target.value) })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                placeholder="000.000.000-00"
                maxLength={14}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Telefone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: formatPhone(e.target.value) })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                placeholder="(00) 00000-0000"
                maxLength={15}
                required
              />
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!formData.email || !formData.cpf || !formData.phone}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Próxima Etapa →
            </button>
          </div>
        )}

        {/* Step 2: Dados Financeiros */}
        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">💰 Dados Financeiros</h2>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Salário Mensal
              </label>
              <input
                type="number"
                value={formData.monthlySalary || ''}
                onChange={(e) => setFormData({ ...formData, monthlySalary: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                placeholder="0.00"
                step="0.01"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Renda Variável (Opcional)
              </label>
              <input
                type="number"
                value={formData.variableIncome || ''}
                onChange={(e) => setFormData({ ...formData, variableIncome: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                placeholder="0.00"
                step="0.01"
              />
              <p className="text-xs text-gray-500 mt-1">Comissões, freelances, bônus, etc.</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-300 transition-all"
              >
                ← Voltar
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!formData.monthlySalary || formData.monthlySalary <= 0}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Próxima Etapa →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Despesas Fixas */}
        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">📌 Despesas Fixas Mensais</h2>
            
            <div className="bg-blue-50 p-4 rounded-xl mb-4">
              <p className="text-sm text-blue-800">
                💡 Adicione suas despesas fixas mensais (aluguel, condomínio, internet, etc.). Você poderá editá-las depois.
              </p>
            </div>

            {/* Lista de Despesas Fixas */}
            {formData.fixedExpenses && formData.fixedExpenses.length > 0 && (
              <div className="space-y-2 mb-4">
                {formData.fixedExpenses.map((expense) => (
                  <div key={expense.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                    <div>
                      <p className="font-semibold text-gray-800">{expense.description}</p>
                      <p className="text-sm text-gray-600">R$ {expense.amount.toFixed(2)} - {expense.category}</p>
                    </div>
                    <button
                      onClick={() => handleRemoveFixedExpense(expense.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Adicionar Nova Despesa Fixa */}
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 space-y-3">
              <input
                type="text"
                value={newFixedExpense.description}
                onChange={(e) => setNewFixedExpense({ ...newFixedExpense, description: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                placeholder="Descrição (ex: Aluguel)"
              />
              <div className="flex gap-2">
                <input
                  type="number"
                  value={newFixedExpense.amount || ''}
                  onChange={(e) => setNewFixedExpense({ ...newFixedExpense, amount: parseFloat(e.target.value) || 0 })}
                  className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  placeholder="Valor"
                  step="0.01"
                />
                <select
                  value={newFixedExpense.category}
                  onChange={(e) => setNewFixedExpense({ ...newFixedExpense, category: e.target.value as Category })}
                  className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                >
                  <option value="moradia">Moradia</option>
                  <option value="transporte">Transporte</option>
                  <option value="alimentacao">Alimentação</option>
                  <option value="saude">Saúde</option>
                  <option value="educacao">Educação</option>
                  <option value="lazer">Lazer</option>
                  <option value="outros">Outros</option>
                </select>
              </div>
              <button
                onClick={handleAddFixedExpense}
                disabled={!newFixedExpense.description || newFixedExpense.amount <= 0}
                className="w-full bg-blue-100 text-blue-700 py-2 rounded-lg font-semibold hover:bg-blue-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Adicionar Despesa Fixa
              </button>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setStep(2)}
                className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-300 transition-all"
              >
                ← Voltar
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                Finalizar Cadastro ✓
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
