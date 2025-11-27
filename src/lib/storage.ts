import { Expense, UserProfile } from './types';

const STORAGE_KEY = 'finance-app-expenses';
const PROFILE_KEY = 'finance-app-profile';

export const loadExpenses = (): Expense[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveExpenses = (expenses: Expense[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
};

export const addExpense = (expense: Expense) => {
  const expenses = loadExpenses();
  expenses.push(expense);
  saveExpenses(expenses);
};

export const deleteExpense = (id: string) => {
  const expenses = loadExpenses().filter(exp => exp.id !== id);
  saveExpenses(expenses);
};

export const updateExpense = (id: string, updates: Partial<Expense>) => {
  const expenses = loadExpenses();
  const index = expenses.findIndex(exp => exp.id === id);
  if (index !== -1) {
    expenses[index] = { ...expenses[index], ...updates };
    saveExpenses(expenses);
  }
};

// User Profile Functions
export const loadUserProfile = (): UserProfile | null => {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(PROFILE_KEY);
  return stored ? JSON.parse(stored) : null;
};

export const saveUserProfile = (profile: UserProfile) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
};

export const updateUserProfile = (updates: Partial<UserProfile>) => {
  const profile = loadUserProfile();
  if (profile) {
    const updatedProfile = { ...profile, ...updates };
    saveUserProfile(updatedProfile);
  }
};

export const deleteFixedExpense = (id: string) => {
  const profile = loadUserProfile();
  if (profile) {
    profile.fixedExpenses = profile.fixedExpenses.filter(exp => exp.id !== id);
    saveUserProfile(profile);
  }
};

export const addFixedExpense = (expense: any) => {
  const profile = loadUserProfile();
  if (profile) {
    profile.fixedExpenses.push(expense);
    saveUserProfile(profile);
  }
};
