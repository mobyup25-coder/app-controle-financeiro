'use client';

import { useState, useRef } from 'react';
import { X, User, Mail, Phone, CreditCard, DollarSign, Camera, Edit2, Save, Plus } from 'lucide-react';
import { loadUserProfile, saveUserProfile, deleteFixedExpense, addFixedExpense } from '@/lib/storage';
import { UserProfile as UserProfileType, FixedExpense } from '@/lib/types';

type UserProfileProps = {
  onClose: () => void;
  onUpdate: () => void;
};

export default function UserProfile({ onClose, onUpdate }: UserProfileProps) {
  const [profile, setProfile] = useState<UserProfileType | null>(loadUserProfile());
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<UserProfileType | null>(profile);
  const [profileImage, setProfileImage] = useState<string | null>(
    typeof window !== 'undefined' ? localStorage.getItem('profile-image') : null
  );
  const [tempImage, setTempImage] = useState<string | null>(null);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [newExpense, setNewExpense] = useState({ description: '', amount: '', category: 'outros' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!profile || !editedProfile) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = reader.result as string;
        
        // Comprimir a imagem antes de salvar
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Redimensionar para no máximo 100x100 (muito menor)
          const maxSize = 100;
          let width = img.width;
          let height = img.height;
          
          if (width > height) {
            if (width > maxSize) {
              height *= maxSize / width;
              width = maxSize;
            }
          } else {
            if (height > maxSize) {
              width *= maxSize / height;
              height = maxSize;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Converter para base64 com qualidade muito reduzida (30%)
          const compressedImage = canvas.toDataURL('image/jpeg', 0.3);
          
          // Armazenar temporariamente até o usuário clicar em salvar
          setTempImage(compressedImage);
        };
        img.src = imageData;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveImage = () => {
    if (tempImage) {
      try {
        localStorage.setItem('profile-image', tempImage);
        setProfileImage(tempImage);
        setTempImage(null);
        alert('Foto de perfil salva com sucesso!');
      } catch (error) {
        alert('Erro ao salvar imagem. Tente uma imagem menor.');
        console.error('Storage error:', error);
      }
    }
  };

  const handleSave = () => {
    if (editedProfile) {
      saveUserProfile(editedProfile);
      setProfile(editedProfile);
      setIsEditing(false);
      onUpdate();
    }
  };

  const handleDeleteFixedExpense = (id: string) => {
    deleteFixedExpense(id);
    const updatedProfile = loadUserProfile();
    if (updatedProfile) {
      setProfile(updatedProfile);
      setEditedProfile(updatedProfile);
      onUpdate();
    }
  };

  const handleAddExpense = () => {
    if (newExpense.description && newExpense.amount) {
      const expense: FixedExpense = {
        id: Date.now().toString(),
        description: newExpense.description,
        amount: parseFloat(newExpense.amount),
        category: newExpense.category as any
      };
      addFixedExpense(expense);
      const updatedProfile = loadUserProfile();
      if (updatedProfile) {
        setProfile(updatedProfile);
        setEditedProfile(updatedProfile);
        onUpdate();
      }
      setNewExpense({ description: '', amount: '', category: 'outros' });
      setShowAddExpense(false);
    }
  };

  const formatCPF = (cpf: string) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const formatPhone = (phone: string) => {
    return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  };

  const totalFixedExpenses = profile.fixedExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const totalIncome = profile.monthlySalary + (profile.variableIncome || 0);
  const availableAfterFixed = totalIncome - totalFixedExpenses;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-t-2xl relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-white/20 p-2 rounded-full transition-all"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center overflow-hidden border-4 border-white shadow-xl">
                {tempImage || profileImage ? (
                  <img src={tempImage || profileImage || ''} alt="Perfil" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-12 h-12 text-white" />
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 bg-white text-blue-600 p-2 rounded-full shadow-lg hover:bg-gray-100 transition-all"
              >
                <Camera className="w-4 h-4" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
            {tempImage && (
              <button
                onClick={handleSaveImage}
                className="mt-3 flex items-center gap-2 bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition-all text-sm font-medium"
              >
                <Save className="w-4 h-4" />
                Salvar Foto
              </button>
            )}
            <h2 className="text-2xl font-bold text-white mt-4">Meu Perfil</h2>
            <p className="text-white/80 text-sm">Gerencie suas informações pessoais</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Action Button */}
          <div className="flex justify-end">
            {isEditing ? (
              <button
                onClick={handleSave}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all"
              >
                <Save className="w-4 h-4" />
                Salvar Alterações
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all"
              >
                <Edit2 className="w-4 h-4" />
                Editar Perfil
              </button>
            )}
          </div>

          {/* Personal Information */}
          <div className="bg-gray-50 p-5 rounded-xl">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Informações Pessoais
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-600 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  E-mail
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={editedProfile.email}
                    onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="font-medium text-gray-800 mt-1">{profile.email}</p>
                )}
              </div>
              <div>
                <label className="text-sm text-gray-600 flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  CPF
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile.cpf}
                    onChange={(e) => setEditedProfile({ ...editedProfile, cpf: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="font-medium text-gray-800 mt-1">{formatCPF(profile.cpf)}</p>
                )}
              </div>
              <div>
                <label className="text-sm text-gray-600 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Telefone
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile.phone}
                    onChange={(e) => setEditedProfile({ ...editedProfile, phone: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="font-medium text-gray-800 mt-1">{formatPhone(profile.phone)}</p>
                )}
              </div>
            </div>
          </div>

          {/* Financial Information */}
          <div className="bg-gradient-to-br from-green-50 to-blue-50 p-5 rounded-xl">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              Informações Financeiras
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-600">Salário Mensal</label>
                {isEditing ? (
                  <input
                    type="number"
                    value={editedProfile.monthlySalary}
                    onChange={(e) => setEditedProfile({ ...editedProfile, monthlySalary: parseFloat(e.target.value) || 0 })}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="font-medium text-gray-800 mt-1">R$ {profile.monthlySalary.toFixed(2)}</p>
                )}
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-sm text-gray-600">Renda Variável</label>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Alterar
                    </button>
                  )}
                </div>
                {isEditing ? (
                  <input
                    type="number"
                    value={editedProfile.variableIncome || 0}
                    onChange={(e) => setEditedProfile({ ...editedProfile, variableIncome: parseFloat(e.target.value) || 0 })}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="font-medium text-gray-800 mt-1">R$ {(profile.variableIncome || 0).toFixed(2)}</p>
                )}
              </div>
              <div className="pt-3 border-t border-gray-300">
                <p className="text-sm text-gray-600">Renda Total Mensal</p>
                <p className="text-2xl font-bold text-green-600">R$ {totalIncome.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Fixed Expenses */}
          <div className="bg-red-50 p-5 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">Despesas Fixas Mensais</h3>
              <button
                onClick={() => setShowAddExpense(!showAddExpense)}
                className="flex items-center gap-1 text-sm bg-red-600 text-white px-3 py-1.5 rounded-lg hover:bg-red-700 transition-all"
              >
                <Plus className="w-4 h-4" />
                Adicionar
              </button>
            </div>

            {showAddExpense && (
              <div className="bg-white p-4 rounded-lg mb-4 space-y-3">
                <input
                  type="text"
                  placeholder="Descrição da despesa"
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
                <input
                  type="number"
                  placeholder="Valor (R$)"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
                <select
                  value={newExpense.category}
                  onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="moradia">Moradia</option>
                  <option value="transporte">Transporte</option>
                  <option value="alimentacao">Alimentação</option>
                  <option value="saude">Saúde</option>
                  <option value="educacao">Educação</option>
                  <option value="outros">Outros</option>
                </select>
                <div className="flex gap-2">
                  <button
                    onClick={handleAddExpense}
                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all"
                  >
                    Salvar Despesa
                  </button>
                  <button
                    onClick={() => {
                      setShowAddExpense(false);
                      setNewExpense({ description: '', amount: '', category: 'outros' });
                    }}
                    className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-all"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}

            {profile.fixedExpenses.length > 0 ? (
              <div className="space-y-2">
                {profile.fixedExpenses.map((expense) => (
                  <div key={expense.id} className="flex items-center justify-between bg-white p-3 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-800">{expense.description}</p>
                      <p className="text-sm text-gray-600 capitalize">{expense.category}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="font-semibold text-red-600">R$ {expense.amount.toFixed(2)}</p>
                      <button
                        onClick={() => handleDeleteFixedExpense(expense.id)}
                        className="text-red-600 hover:bg-red-100 p-2 rounded-lg transition-all"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                <div className="pt-3 border-t border-red-200">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-600">Total Despesas Fixas</p>
                    <p className="text-xl font-bold text-red-600">R$ {totalFixedExpenses.toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-sm text-gray-600">Disponível após despesas fixas</p>
                    <p className={`text-xl font-bold ${availableAfterFixed >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      R$ {availableAfterFixed.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">Nenhuma despesa fixa cadastrada</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
