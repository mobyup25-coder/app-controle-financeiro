'use client';

import { useState } from 'react';
import { Send, CheckCircle } from 'lucide-react';
import Navbar from '@/components/custom/Navbar';

export default function FeedbackPage() {
  const [feedback, setFeedback] = useState('');
  const [category, setCategory] = useState('sugestao');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simular envio (em produção, enviaria para backend/Supabase)
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Salvar no localStorage para demonstração
    const feedbacks = JSON.parse(localStorage.getItem('user-feedbacks') || '[]');
    feedbacks.push({
      id: Date.now(),
      category,
      message: feedback,
      date: new Date().toISOString(),
    });
    localStorage.setItem('user-feedbacks', JSON.stringify(feedbacks));

    setSubmitted(true);
    setIsSubmitting(false);
    setFeedback('');
    
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            💬 Seu Feedback é Importante
          </h1>
          <p className="text-gray-600 text-lg">
            Ajude-nos a melhorar o OptiGrana com suas sugestões e comentários
          </p>
        </div>

        {/* Feedback Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          {submitted ? (
            <div className="text-center py-12">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Feedback Enviado!
              </h3>
              <p className="text-gray-600">
                Obrigado por compartilhar sua opinião conosco.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Categoria */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Categoria
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="sugestao">💡 Sugestão</option>
                  <option value="bug">🐛 Reportar Bug</option>
                  <option value="elogio">⭐ Elogio</option>
                  <option value="duvida">❓ Dúvida</option>
                  <option value="outro">📝 Outro</option>
                </select>
              </div>

              {/* Mensagem */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Sua Mensagem
                </label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Conte-nos o que você pensa..."
                  rows={6}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || !feedback.trim()}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-lg font-semibold hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Enviar Feedback
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 text-center">
            <div className="text-4xl mb-3">💡</div>
            <h3 className="font-bold text-gray-800 mb-2">Sugestões</h3>
            <p className="text-sm text-gray-600">
              Compartilhe ideias para novas funcionalidades
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 text-center">
            <div className="text-4xl mb-3">🐛</div>
            <h3 className="font-bold text-gray-800 mb-2">Bugs</h3>
            <p className="text-sm text-gray-600">
              Reporte problemas técnicos que encontrar
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 text-center">
            <div className="text-4xl mb-3">⭐</div>
            <h3 className="font-bold text-gray-800 mb-2">Elogios</h3>
            <p className="text-sm text-gray-600">
              Conte o que você mais gosta no app
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
