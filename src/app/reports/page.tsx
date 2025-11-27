'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/custom/Navbar';
import FinancialReports from '@/components/FinancialReports';
import { loadExpenses, loadUserProfile } from '@/lib/storage';
import { Expense, UserProfile } from '@/lib/types';

export default function ReportsPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const profile = loadUserProfile();
    setUserProfile(profile);
    setExpenses(loadExpenses());
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-gray-800 text-2xl font-bold">Carregando relatórios...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 py-8">
        <FinancialReports expenses={expenses} userProfile={userProfile} />
      </div>
    </div>
  );
}
