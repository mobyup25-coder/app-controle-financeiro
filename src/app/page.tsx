'use client';

import { useState, useEffect } from 'react';
import { Wallet, TrendingUp, TrendingDown, DollarSign, PieChart, CreditCard, User, FileText, Edit, Save, X, BarChart3 } from 'lucide-react';
import ExpenseForm from '@/components/ExpenseForm';
import ExpenseList from '@/components/ExpenseList';
import CategoryChart from '@/components/CategoryChart';
import Suggestions from '@/components/Suggestions';
import OnboardingForm from '@/components/OnboardingForm';
import UserProfile from '@/components/UserProfile';
import WeeklyReport from '@/components/WeeklyReport';
import Navbar from '@/components/custom/Navbar';
import { loadExpenses, loadUserProfile, updateUserProfile } from '@/lib/storage';
import { Expense, UserProfile as UserProfileType } from '@/lib/types';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  const [showWeeklyReport, setShowWeeklyReport] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfileType | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const router = useRouter();
  
  // Estados para edição de renda variável
  const [isEditingVariableIncome, setIsEditingVariableIncome] = useState(false);
  const [newVariableIncome, setNewVariableIncome] = useState('');

  useEffect(() => {
    const profile = loadUserProfile();
    if (!profile || !profile.onboardingCompleted) {
      setShowOnboarding(true);
    } else {
      setUserProfile(profile);
      setNewVariableIncome((profile.variableIncome || 0).toString());
    }
    setExpenses(loadExpenses());
    
    // Carregar imagem do perfil
    const savedImage = localStorage.getItem('profile-image');
    if (savedImage) {
      setProfileImage(savedImage);
    }
    
    setIsLoading(false);

    // Verificar se é segunda-feira e mostrar relatório
    checkWeeklyReport();
  }, []);

  const checkWeeklyReport = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const lastReportDate = localStorage.getItem('last-weekly-report');
    
    // Segunda-feira = 1
    if (dayOfWeek === 1) {
      const todayStr = today.toDateString();
      if (lastReportDate !== todayStr) {
        setShowWeeklyReport(true);
        localStorage.setItem('last-weekly-report', todayStr);
      }
    }
  };

  const refreshExpenses = () => {
    setExpenses(loadExpenses());
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    const profile = loadUserProfile();
    setUserProfile(profile);
    if (profile) {
      setNewVariableIncome((profile.variableIncome || 0).toString());
    }
  };

  const handleProfileUpdate = () => {
    const profile = loadUserProfile();
    setUserProfile(profile);
    if (profile) {
      setNewVariableIncome((profile.variableIncome || 0).toString());
    }
    refreshExpenses();
  };

  const handleEditVariableIncome = () => {
    setIsEditingVariableIncome(true);
  };

  const handleSaveVariableIncome = () => {
    const value = parseFloat(newVariableIncome) || 0;
    updateUserProfile({ variableIncome: value });
    const updatedProfile = loadUserProfile();
    setUserProfile(updatedProfile);
    setIsEditingVariableIncome(false);
  };

  const handleCancelEdit = () => {
    setNewVariableIncome((userProfile?.variableIncome || 0).toString());
    setIsEditingVariableIncome(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 flex items-center justify-center">
        <div className="text-white text-2xl font-bold animate-pulse">Carregando...</div>
      </div>
    );
  }

  if (showOnboarding) {
    return <OnboardingForm onComplete={handleOnboardingComplete} />;
  }

  const receitas = expenses.filter(exp => exp.type === 'receita');
  const despesas = expenses.filter(exp => exp.type === 'despesa');

  const totalReceitas = receitas.reduce((sum, exp) => sum + exp.amount, 0);
  const totalDespesas = despesas.reduce((sum, exp) => sum + exp.amount, 0);
  
  // Calcular renda total do usuário (salário + renda variável)
  const rendaTotal = userProfile 
    ? userProfile.monthlySalary + (userProfile.variableIncome || 0)
    : totalReceitas;
  
  // Calcular despesas fixas do usuário
  const despesasFixas = userProfile
    ? userProfile.fixedExpenses.reduce((sum, exp) => sum + exp.amount, 0)
    : 0;
  
  // Saldo real considerando renda do perfil e despesas fixas
  const saldo = rendaTotal - totalDespesas - despesasFixas;

  // Estatísticas por categoria
  const despesasPorCategoria = despesas.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {} as Record<string, number>);

  const categoriaComMaisGastos = Object.entries(despesasPorCategoria).sort((a, b) => b[1] - a[1])[0];

  // Estatísticas por forma de pagamento
  const gastosPorPagamento = expenses.reduce((acc, exp) => {
    acc[exp.paymentMethod] = (acc[exp.paymentMethod] || 0) + exp.amount;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header com ações rápidas */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Dashboard Financeiro</h1>
            <p className="text-gray-600 mt-1">Bem-vindo de volta! Aqui está um resumo das suas finanças.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/reports')}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-xl hover:shadow-xl transition-all shadow-lg"
            >
              <BarChart3 className="w-5 h-5" />
              <span className="hidden sm:inline">Relatórios</span>
            </button>
            <button
              onClick={() => setShowWeeklyReport(true)}
              className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-xl hover:bg-purple-700 transition-all shadow-lg"
            >
              <FileText className="w-5 h-5" />
              <span className="hidden sm:inline">Relatório Semanal</span>
            </button>
            <button
              onClick={() => setShowProfile(true)}
              className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all border-2 border-blue-200"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center overflow-hidden">
                {profileImage ? (
                  <img src={profileImage} alt="Perfil" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-6 h-6 text-white" />
                )}
              </div>
              <span className="font-semibold text-gray-800 hidden sm:inline">Meu Perfil</span>
            </button>
          </div>
        </header>

        {/* Cards de Resumo Principal */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-2xl shadow-xl text-white transform hover:scale-105 transition-all">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold opacity-90">Renda Total</h3>
              <TrendingUp className="w-6 h-6" />
            </div>
            <p className="text-3xl font-bold">R$ {rendaTotal.toFixed(2)}</p>
            <p className="text-sm opacity-80 mt-1">
              {userProfile ? 'Salário + Renda Variável' : `${receitas.length} transações`}
            </p>
            
            {/* Seção de Edição de Renda Variável */}
            {userProfile && (
              <div className="mt-4 pt-4 border-t border-white/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Renda Variável:</span>
                  {!isEditingVariableIncome && (
                    <button
                      onClick={handleEditVariableIncome}
                      className="bg-white/20 hover:bg-white/30 p-1.5 rounded-lg transition-all"
                      title="Editar renda variável"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  )}
                </div>
                
                {isEditingVariableIncome ? (
                  <div className="space-y-2">
                    <input
                      type="number"
                      value={newVariableIncome}
                      onChange={(e) => setNewVariableIncome(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg text-gray-800 font-semibold"
                      placeholder="0.00"
                      step="0.01"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveVariableIncome}
                        className="flex-1 bg-white text-green-600 px-3 py-2 rounded-lg font-semibold hover:bg-green-50 transition-all flex items-center justify-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        Salvar
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="flex-1 bg-white/20 hover:bg-white/30 px-3 py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
                      >
                        <X className="w-4 h-4" />
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-xl font-bold">R$ {(userProfile.variableIncome || 0).toFixed(2)}</p>
                )}
              </div>
            )}
          </div>

          <div className="bg-gradient-to-br from-red-500 to-red-600 p-6 rounded-2xl shadow-xl text-white transform hover:scale-105 transition-all">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold opacity-90">Despesas Totais</h3>
              <TrendingDown className="w-6 h-6" />
            </div>
            <p className="text-3xl font-bold">R$ {(totalDespesas + despesasFixas).toFixed(2)}</p>
            <p className="text-sm opacity-80 mt-1">
              Variáveis: R$ {totalDespesas.toFixed(2)} | Fixas: R$ {despesasFixas.toFixed(2)}
            </p>
          </div>

          <div className={`bg-gradient-to-br ${saldo >= 0 ? 'from-blue-500 to-blue-600' : 'from-orange-500 to-orange-600'} p-6 rounded-2xl shadow-xl text-white transform hover:scale-105 transition-all`}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold opacity-90">Saldo Disponível</h3>
              <DollarSign className="w-6 h-6" />
            </div>
            <p className="text-3xl font-bold">R$ {saldo.toFixed(2)}</p>
            <p className="text-sm opacity-80 mt-1">{saldo >= 0 ? 'Positivo ✅' : 'Atenção! ⚠️'}</p>
          </div>
        </div>

        {/* Cards de Estatísticas Detalhadas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-all">
            <div className="flex items-center gap-3 mb-2">
              <PieChart className="w-5 h-5 text-purple-600" />
              <h4 className="font-semibold text-gray-700">Categoria Top</h4>
            </div>
            {categoriaComMaisGastos ? (
              <>
                <p className="text-xl font-bold text-gray-800 capitalize">{categoriaComMaisGastos[0]}</p>
                <p className="text-sm text-gray-600">R$ {categoriaComMaisGastos[1].toFixed(2)}</p>
              </>
            ) : (
              <p className="text-gray-500">Sem dados</p>
            )}
          </div>

          <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-all">
            <div className="flex items-center gap-3 mb-2">
              <CreditCard className="w-5 h-5 text-indigo-600" />
              <h4 className="font-semibold text-gray-700">Pagamento Mais Usado</h4>
            </div>
            {Object.keys(gastosPorPagamento).length > 0 ? (
              <>
                <p className="text-xl font-bold text-gray-800 capitalize">
                  {Object.entries(gastosPorPagamento).sort((a, b) => b[1] - a[1])[0][0]}
                </p>
                <p className="text-sm text-gray-600">
                  R$ {Object.entries(gastosPorPagamento).sort((a, b) => b[1] - a[1])[0][1].toFixed(2)}
                </p>
              </>
            ) : (
              <p className="text-gray-500">Sem dados</p>
            )}
          </div>

          <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-all">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <h4 className="font-semibold text-gray-700">Média Receitas</h4>
            </div>
            <p className="text-xl font-bold text-gray-800">
              R$ {receitas.length > 0 ? (totalReceitas / receitas.length).toFixed(2) : '0.00'}
            </p>
            <p className="text-sm text-gray-600">Por transação</p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-all">
            <div className="flex items-center gap-3 mb-2">
              <TrendingDown className="w-5 h-5 text-red-600" />
              <h4 className="font-semibold text-gray-700">Média Despesas</h4>
            </div>
            <p className="text-xl font-bold text-gray-800">
              R$ {despesas.length > 0 ? (totalDespesas / despesas.length).toFixed(2) : '0.00'}
            </p>
            <p className="text-sm text-gray-600">Por transação</p>
          </div>
        </div>

        {/* Seção Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-1">
            <ExpenseForm onExpenseAdded={refreshExpenses} />
          </div>
          <div className="lg:col-span-2">
            <CategoryChart expenses={expenses} />
          </div>
        </div>

        {/* Lista de Transações e Sugestões */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
              📊 Histórico de Transações
            </h2>
            <ExpenseList expenses={expenses} onExpenseDeleted={refreshExpenses} />
          </div>
          <Suggestions expenses={expenses} />
        </div>
      </div>

      {/* Modals */}
      {showProfile && (
        <UserProfile 
          onClose={() => {
            setShowProfile(false);
            const savedImage = localStorage.getItem('profile-image');
            if (savedImage) {
              setProfileImage(savedImage);
            }
          }} 
          onUpdate={handleProfileUpdate}
        />
      )}
      {showWeeklyReport && (
        <WeeklyReport onClose={() => setShowWeeklyReport(false)} />
      )}
    </div>
  );
}
