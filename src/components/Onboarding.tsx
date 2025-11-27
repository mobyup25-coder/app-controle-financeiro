'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { UserCheck, DollarSign, Target } from 'lucide-react';
import { UserProfile } from '@/lib/types';
import { saveUserProfile, setOnboardingCompleted } from '@/lib/storage';

const onboardingSchema = z.object({
  monthlyIncome: z.number().min(1, 'Renda mensal deve ser maior que zero'),
  commonCategories: z.array(z.string()).min(1, 'Selecione pelo menos uma categoria'),
  savingsGoal: z.number().optional(),
});

type OnboardingFormData = z.infer<typeof onboardingSchema>;

interface OnboardingProps {
  onCompleted: () => void;
}

const categoryOptions = [
  'Alimentação',
  'Transporte',
  'Moradia',
  'Saúde',
  'Educação',
  'Lazer',
  'Vestuário',
  'Outros',
];

export default function Onboarding({ onCompleted }: OnboardingProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      commonCategories: [],
    },
  });

  const toggleCategory = (category: string) => {
    const newSelected = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category];
    setSelectedCategories(newSelected);
    setValue('commonCategories', newSelected);
  };

  const onSubmit = (data: OnboardingFormData) => {
    const profile: UserProfile = {
      monthlyIncome: data.monthlyIncome,
      commonCategories: data.commonCategories,
      savingsGoal: data.savingsGoal,
    };
    saveUserProfile(profile);
    setOnboardingCompleted();
    onCompleted();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <UserCheck className="w-16 h-16 text-blue-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800">Bem-vindo ao Controle Financeiro</h1>
          <p className="text-gray-600 mt-2">Vamos configurar seu perfil para uma experiência personalizada</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Renda Mensal (R$)
            </label>
            <input
              {...register('monthlyIncome', { valueAsNumber: true })}
              type="number"
              step="0.01"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: 3000.00"
            />
            {errors.monthlyIncome && <p className="text-red-500 text-sm mt-1">{errors.monthlyIncome.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Categorias de Gastos Comuns</label>
            <div className="grid grid-cols-2 gap-2">
              {categoryOptions.map(category => (
                <button
                  key={category}
                  type="button"
                  onClick={() => toggleCategory(category)}
                  className={`p-2 text-sm border rounded-md transition-colors ${
                    selectedCategories.includes(category)
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
            {errors.commonCategories && <p className="text-red-500 text-sm mt-1">{errors.commonCategories.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <Target className="w-4 h-4" />
              Meta de Poupança Mensal (Opcional - R$)
            </label>
            <input
              {...register('savingsGoal', { valueAsNumber: true })}
              type="number"
              step="0.01"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: 500.00"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 px-4 rounded-md hover:bg-blue-600 transition-colors font-medium"
          >
            Começar a Controlar
          </button>
        </form>
      </div>
    </div>
  );
}