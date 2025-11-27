'use client';

import { useState, useEffect } from 'react';
import { X, TrendingDown, TrendingUp, Calendar, AlertCircle, CheckCircle } from 'lucide-react';
import { Expense } from '@/lib/types';

type WeeklyReportProps = {
  onClose: () => void;
};

export default function WeeklyReport({ onClose }: WeeklyReportProps) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [weekStart, setWeekStart] = useState<Date>(new Date());
  const [weekEnd, setWeekEnd] = useState<Date>(new Date());

  useEffect(() => {
    // Carregar despesas do localStorage
    const stored = localStorage.getItem('finance-app-expenses');
    const allExpenses: Expense[] = stored ? JSON.parse(stored) : [];

    // Calcular início e fim da semana (segunda a domingo)
    const today = new Date();
    const dayOfWeek = today.getDay();
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Ajustar para segunda-feira
    
    const monday = new Date(today);
    monday.setDate(today.getDate() + diff);
    monday.setHours(0, 0, 0, 0);
    
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);

    setWeekStart(monday);
    setWeekEnd(sunday);

    // Filtrar despesas da semana
    const weekExpenses = allExpenses.filter(exp => {
      const expDate = new Date(exp.date);
      return expDate >= monday && expDate <= sunday;
    });

    setExpenses(weekExpenses);
  }, []);

  const receitas = expenses.filter(exp => exp.type === 'receita');
  const despesas = expenses.filter(exp => exp.type === 'despesa');

  const totalReceitas = receitas.reduce((sum, exp) => sum + exp.amount, 0);
  const totalDespesas = despesas.reduce((sum, exp) => sum + exp.amount, 0);
  const saldo = totalReceitas - totalDespesas;

  // Agrupar despesas por categoria
  const despesasPorCategoria = despesas.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {} as Record<string, number>);

  const categorias = Object.entries(despesasPorCategoria)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Calcular média diária
  const diasDecorridos = Math.ceil((new Date().getTime() - weekStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  const mediaDiaria = totalDespesas / diasDecorridos;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 rounded-t-2xl relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-white/20 p-2 rounded-full transition-all"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-8 h-8 text-white" />
            <div>
              <h2 className="text-2xl font-bold text-white">Relatório Semanal</h2>
              <p className="text-white/80 text-sm">
                {formatDate(weekStart)} - {formatDate(weekEnd)}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Resumo Geral */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-green-500 to-green-600 p-5 rounded-xl text-white">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5" />
                <h3 className="font-semibold">Receitas</h3>
              </div>
              <p className="text-3xl font-bold">R$ {totalReceitas.toFixed(2)}</p>
              <p className="text-sm opacity-80 mt-1">{receitas.length} transações</p>
            </div>

            <div className="bg-gradient-to-br from-red-500 to-red-600 p-5 rounded-xl text-white">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="w-5 h-5" />
                <h3 className="font-semibold">Despesas</h3>
              </div>
              <p className="text-3xl font-bold">R$ {totalDespesas.toFixed(2)}</p>
              <p className="text-sm opacity-80 mt-1">{despesas.length} transações</p>
            </div>

            <div className={`bg-gradient-to-br ${saldo >= 0 ? 'from-blue-500 to-blue-600' : 'from-orange-500 to-orange-600'} p-5 rounded-xl text-white`}>
              <div className="flex items-center gap-2 mb-2">
                {saldo >= 0 ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                <h3 className="font-semibold">Saldo</h3>
              </div>
              <p className="text-3xl font-bold">R$ {saldo.toFixed(2)}</p>
              <p className="text-sm opacity-80 mt-1">{saldo >= 0 ? 'Positivo' : 'Atenção!'}</p>
            </div>
          </div>

          {/* Média Diária */}
          <div className="bg-blue-50 p-5 rounded-xl">
            <h3 className="font-semibold text-gray-800 mb-3">📊 Análise de Gastos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Média de gastos por dia</p>
                <p className="text-2xl font-bold text-blue-600">R$ {mediaDiaria.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Dias analisados</p>
                <p className="text-2xl font-bold text-blue-600">{diasDecorridos} dias</p>
              </div>
            </div>
          </div>

          {/* Top 5 Categorias */}
          <div className="bg-purple-50 p-5 rounded-xl">
            <h3 className="font-semibold text-gray-800 mb-4">🏆 Top 5 Categorias de Gastos</h3>
            {categorias.length > 0 ? (
              <div className="space-y-3">
                {categorias.map(([categoria, valor], index) => {
                  const percentual = (valor / totalDespesas) * 100;
                  return (
                    <div key={categoria}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-700 capitalize flex items-center gap-2">
                          <span className="bg-purple-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">
                            {index + 1}
                          </span>
                          {categoria}
                        </span>
                        <span className="text-sm font-bold text-gray-800">R$ {valor.toFixed(2)}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all"
                          style={{ width: `${percentual}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{percentual.toFixed(1)}% do total</p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">Nenhuma despesa registrada esta semana</p>
            )}
          </div>

          {/* Insights */}
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-5 rounded-xl border-2 border-yellow-200">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              💡 Insights da Semana
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              {saldo < 0 && (
                <li className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                  <span>Suas despesas superaram suas receitas esta semana. Considere revisar seus gastos.</span>
                </li>
              )}
              {mediaDiaria > 100 && (
                <li className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                  <span>Sua média diária de gastos está em R$ {mediaDiaria.toFixed(2)}. Tente reduzir gastos desnecessários.</span>
                </li>
              )}
              {categorias.length > 0 && (
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Sua categoria com mais gastos foi <strong className="capitalize">{categorias[0][0]}</strong> (R$ {categorias[0][1].toFixed(2)}). Avalie se há oportunidades de economia.</span>
                </li>
              )}
              {despesas.length === 0 && (
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>Você ainda não registrou despesas esta semana. Continue acompanhando suas finanças!</span>
                </li>
              )}
            </ul>
          </div>

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-5 rounded-xl text-white text-center">
            <h3 className="font-bold text-lg mb-2">🎯 Continue no Controle!</h3>
            <p className="text-sm opacity-90">
              Registre todas as suas transações para ter uma visão completa das suas finanças.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
