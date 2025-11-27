export type Expense = {
  id: string;
  description: string;
  amount: number;
  category: 'alimentacao' | 'transporte' | 'moradia' | 'saude' | 'educacao' | 'lazer' | 'investimento' | 'outros';
  type: 'receita' | 'despesa';
  paymentMethod: 'dinheiro' | 'debito' | 'credito' | 'pix' | 'transferencia';
  date: string; // ISO string
  notes?: string;
};

export type Category = 'alimentacao' | 'transporte' | 'moradia' | 'saude' | 'educacao' | 'lazer' | 'investimento' | 'outros';
export type TransactionType = 'receita' | 'despesa';
export type PaymentMethod = 'dinheiro' | 'debito' | 'credito' | 'pix' | 'transferencia';

export type FixedExpense = {
  id: string;
  description: string;
  amount: number;
  category: Category;
};

export type UserProfile = {
  name?: string;
  email: string;
  cpf: string;
  phone: string;
  monthlySalary: number;
  variableIncome?: number;
  fixedExpenses: FixedExpense[];
  onboardingCompleted: boolean;
  profileImage?: string;
};
