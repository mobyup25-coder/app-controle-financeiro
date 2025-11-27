'use client';

import { useState } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Calendar, Download } from 'lucide-react';
import { Expense, UserProfile } from '@/lib/types';

interface FinancialReportsProps {
  expenses: Expense[];
  userProfile: UserProfile | null;
}

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#ef4444', '#06b6d4', '#6366f1'];

export default function FinancialReports({ expenses, userProfile }: FinancialReportsProps) {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');

  // Filtrar despesas por período
  const getFilteredExpenses = () => {
    const now = new Date();
    const filtered = expenses.filter(exp => {
      const expDate = new Date(exp.date);
      const diffTime = now.getTime() - expDate.getTime();
      const diffDays = diffTime / (1000 * 3600 * 24);

      switch (timeRange) {
        case 'week':
          return diffDays <= 7;
        case 'month':
          return diffDays <= 30;
        case 'year':
          return diffDays <= 365;
        default:
          return true;
      }
    });
    return filtered;
  };

  const filteredExpenses = getFilteredExpenses();
  const despesas = filteredExpenses.filter(exp => exp.type === 'despesa');
  const receitas = filteredExpenses.filter(exp => exp.type === 'receita');

  // Dados para gráfico de despesas por categoria
  const despesasPorCategoria = despesas.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {} as Record<string, number>);

  const categoryData = Object.entries(despesasPorCategoria).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value: parseFloat(value.toFixed(2))
  }));

  // Dados para gráfico de evolução temporal
  const getEvolutionData = () => {
    const dataMap = new Map<string, { receitas: number; despesas: number }>();

    filteredExpenses.forEach(exp => {
      const date = new Date(exp.date);
      let key: string;

      if (timeRange === 'week') {
        key = date.toLocaleDateString('pt-BR', { weekday: 'short' });
      } else if (timeRange === 'month') {
        key = `${date.getDate()}/${date.getMonth() + 1}`;
      } else {
        key = date.toLocaleDateString('pt-BR', { month: 'short' });
      }

      if (!dataMap.has(key)) {
        dataMap.set(key, { receitas: 0, despesas: 0 });
      }

      const current = dataMap.get(key)!;
      if (exp.type === 'receita') {
        current.receitas += exp.amount;
      } else {
        current.despesas += exp.amount;
      }
    });

    return Array.from(dataMap.entries()).map(([name, data]) => ({
      name,
      Receitas: parseFloat(data.receitas.toFixed(2)),
      Despesas: parseFloat(data.despesas.toFixed(2))
    }));
  };

  const evolutionData = getEvolutionData();

  // Dados para gráfico de formas de pagamento
  const paymentMethodData = despesas.reduce((acc, exp) => {
    const method = exp.paymentMethod;
    acc[method] = (acc[method] || 0) + exp.amount;
    return acc;
  }, {} as Record<string, number>);

  const paymentData = Object.entries(paymentMethodData).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value: parseFloat(value.toFixed(2))
  }));

  // Cálculos de métricas
  const totalReceitas = receitas.reduce((sum, exp) => sum + exp.amount, 0);
  const totalDespesas = despesas.reduce((sum, exp) => sum + exp.amount, 0);
  const despesasFixas = userProfile?.fixedExpenses.reduce((sum, exp) => sum + exp.amount, 0) || 0;
  const rendaTotal = userProfile ? userProfile.monthlySalary + (userProfile.variableIncome || 0) : totalReceitas;
  const saldo = rendaTotal - totalDespesas - despesasFixas;
  const taxaEconomia = rendaTotal > 0 ? ((saldo / rendaTotal) * 100) : 0;

  // Função para exportar relatório
  const exportReport = () => {
    const reportData = {
      periodo: timeRange === 'week' ? 'Última Semana' : timeRange === 'month' ? 'Último Mês' : 'Último Ano',
      dataGeracao: new Date().toLocaleDateString('pt-BR'),
      resumo: {
        rendaTotal: rendaTotal.toFixed(2),
        totalDespesas: (totalDespesas + despesasFixas).toFixed(2),
        saldo: saldo.toFixed(2),
        taxaEconomia: taxaEconomia.toFixed(2) + '%'
      },
      despesasPorCategoria: categoryData,
      evolucaoTemporal: evolutionData,
      formasPagamento: paymentData
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio-financeiro-${timeRange}-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header com filtros */}
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              📊 Relatórios Financeiros
            </h2>
            <p className="text-gray-600 text-sm mt-1">Análise detalhada das suas finanças</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setTimeRange('week')}
                className={`px-4 py-2 rounded-md transition-all ${
                  timeRange === 'week' 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                Semana
              </button>
              <button
                onClick={() => setTimeRange('month')}
                className={`px-4 py-2 rounded-md transition-all ${
                  timeRange === 'month' 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                Mês
              </button>
              <button
                onClick={() => setTimeRange('year')}
                className={`px-4 py-2 rounded-md transition-all ${
                  timeRange === 'year' 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                Ano
              </button>
            </div>
            
            <button
              onClick={exportReport}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all shadow-md"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Exportar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Cards de Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl shadow-lg text-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold opacity-90">Renda Total</h3>
            <TrendingUp className="w-5 h-5" />
          </div>
          <p className="text-2xl font-bold">R$ {rendaTotal.toFixed(2)}</p>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 p-6 rounded-xl shadow-lg text-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold opacity-90">Despesas</h3>
            <TrendingDown className="w-5 h-5" />
          </div>
          <p className="text-2xl font-bold">R$ {(totalDespesas + despesasFixas).toFixed(2)}</p>
        </div>

        <div className={`bg-gradient-to-br ${saldo >= 0 ? 'from-green-500 to-green-600' : 'from-orange-500 to-orange-600'} p-6 rounded-xl shadow-lg text-white`}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold opacity-90">Saldo</h3>
            <DollarSign className="w-5 h-5" />
          </div>
          <p className="text-2xl font-bold">R$ {saldo.toFixed(2)}</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl shadow-lg text-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold opacity-90">Taxa de Economia</h3>
            <Calendar className="w-5 h-5" />
          </div>
          <p className="text-2xl font-bold">{taxaEconomia.toFixed(1)}%</p>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Evolução Temporal */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Evolução Temporal</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={evolutionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                formatter={(value: number) => `R$ ${value.toFixed(2)}`}
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
              />
              <Legend />
              <Line type="monotone" dataKey="Receitas" stroke="#10b981" strokeWidth={2} />
              <Line type="monotone" dataKey="Despesas" stroke="#ef4444" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de Despesas por Categoria */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Despesas por Categoria</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => `R$ ${value.toFixed(2)}`}
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de Formas de Pagamento */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Formas de Pagamento</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={paymentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                formatter={(value: number) => `R$ ${value.toFixed(2)}`}
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
              />
              <Bar dataKey="value" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Comparativo Receitas vs Despesas */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Comparativo Geral</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={[
              { name: 'Receitas', valor: totalReceitas },
              { name: 'Despesas Variáveis', valor: totalDespesas },
              { name: 'Despesas Fixas', valor: despesasFixas },
              { name: 'Saldo', valor: Math.max(0, saldo) }
            ]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                formatter={(value: number) => `R$ ${value.toFixed(2)}`}
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
              />
              <Bar dataKey="valor" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Insights e Recomendações */}
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-2xl shadow-lg border border-purple-200">
        <h3 className="text-xl font-bold text-gray-800 mb-4">💡 Insights Financeiros</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <h4 className="font-semibold text-gray-700 mb-2">📈 Análise de Economia</h4>
            <p className="text-sm text-gray-600">
              {taxaEconomia >= 20 
                ? '✅ Excelente! Você está economizando mais de 20% da sua renda.'
                : taxaEconomia >= 10
                ? '👍 Bom trabalho! Continue assim para atingir a meta de 20%.'
                : taxaEconomia >= 0
                ? '⚠️ Atenção! Tente aumentar sua taxa de economia para pelo menos 10%.'
                : '🚨 Alerta! Suas despesas estão maiores que sua renda.'}
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm">
            <h4 className="font-semibold text-gray-700 mb-2">🎯 Categoria Prioritária</h4>
            <p className="text-sm text-gray-600">
              {categoryData.length > 0
                ? `Foque em reduzir gastos em "${categoryData[0].name}" (R$ ${categoryData[0].value.toFixed(2)})`
                : 'Adicione despesas para ver análises detalhadas.'}
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm">
            <h4 className="font-semibold text-gray-700 mb-2">💳 Forma de Pagamento</h4>
            <p className="text-sm text-gray-600">
              {paymentData.length > 0
                ? `Você usa mais "${paymentData[0].name}" (R$ ${paymentData[0].value.toFixed(2)})`
                : 'Registre transações para ver padrões de pagamento.'}
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm">
            <h4 className="font-semibold text-gray-700 mb-2">📊 Meta de Economia</h4>
            <p className="text-sm text-gray-600">
              {saldo >= 0
                ? `Continue economizando! Meta mensal: R$ ${(rendaTotal * 0.2).toFixed(2)}`
                : 'Revise seus gastos para equilibrar o orçamento.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
