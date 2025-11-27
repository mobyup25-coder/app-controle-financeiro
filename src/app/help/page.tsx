'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Search, Book, CreditCard, PieChart, Settings, TrendingUp, HelpCircle } from 'lucide-react';
import Navbar from '@/components/custom/Navbar';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQItem[] = [
  {
    category: 'Começando',
    question: 'Como criar minha primeira transação?',
    answer: 'No dashboard principal, use o formulário "Adicionar Transação" à esquerda. Escolha o tipo (receita ou despesa), preencha o valor, categoria, forma de pagamento e descrição. Clique em "Adicionar" e pronto!'
  },
  {
    category: 'Começando',
    question: 'O que é o perfil financeiro?',
    answer: 'O perfil financeiro é onde você configura seu salário mensal, despesas fixas (aluguel, contas, etc.) e renda variável. Isso permite que o OptiGrana calcule automaticamente seu saldo disponível e forneça insights personalizados.'
  },
  {
    category: 'Recursos',
    question: 'Como funcionam os relatórios?',
    answer: 'Os relatórios oferecem análises visuais das suas finanças com gráficos interativos. Você pode filtrar por período (semana, mês, ano) e exportar os dados. Acesse através do botão "Relatórios" no topo da página.'
  },
  {
    category: 'Recursos',
    question: 'O que é o relatório semanal?',
    answer: 'Todo segunda-feira, o OptiGrana gera automaticamente um relatório semanal com suas transações, gastos por categoria e sugestões de economia. Você também pode acessá-lo manualmente a qualquer momento.'
  },
  {
    category: 'Recursos',
    question: 'Como editar minha renda variável?',
    answer: 'No card "Renda Total" do dashboard, clique no ícone de edição ao lado de "Renda Variável". Digite o novo valor e clique em "Salvar". Isso é útil para freelancers ou quem tem renda extra.'
  },
  {
    category: 'Categorias',
    question: 'Quais categorias estão disponíveis?',
    answer: 'Oferecemos categorias como: Alimentação, Transporte, Moradia, Saúde, Educação, Lazer, Compras, Investimentos e Outros. Cada categoria tem um ícone e cor específicos para facilitar a visualização.'
  },
  {
    category: 'Categorias',
    question: 'Posso criar categorias personalizadas?',
    answer: 'Atualmente, trabalhamos com categorias pré-definidas para manter a consistência dos relatórios. Porém, você pode usar a categoria "Outros" para gastos que não se encaixam nas demais.'
  },
  {
    category: 'Dados',
    question: 'Meus dados estão seguros?',
    answer: 'Sim! Todos os dados são armazenados localmente no seu navegador e, se você usar autenticação, são criptografados no Supabase. Nunca compartilhamos suas informações financeiras com terceiros.'
  },
  {
    category: 'Dados',
    question: 'Como exportar meus dados?',
    answer: 'Na página de Relatórios, clique no botão "Exportar" no canto superior direito. Seus dados serão baixados em formato JSON, que você pode abrir em qualquer editor de texto ou planilha.'
  },
  {
    category: 'Sugestões',
    question: 'Como funcionam as sugestões de economia?',
    answer: 'O OptiGrana analisa seus gastos e compara com suas metas financeiras. Com base nisso, oferece sugestões personalizadas como reduzir gastos em categorias específicas ou aumentar sua taxa de economia.'
  },
  {
    category: 'Sugestões',
    question: 'O que é a taxa de economia ideal?',
    answer: 'Recomendamos economizar pelo menos 20% da sua renda mensal. O OptiGrana calcula automaticamente sua taxa atual e mostra se você está atingindo essa meta, oferecendo dicas para melhorar.'
  },
  {
    category: 'Técnico',
    question: 'O app funciona offline?',
    answer: 'Sim! Como os dados são armazenados localmente, você pode usar o OptiGrana mesmo sem conexão com a internet. Apenas a autenticação e sincronização requerem internet.'
  },
  {
    category: 'Técnico',
    question: 'Posso usar em múltiplos dispositivos?',
    answer: 'Com autenticação ativada, seus dados são sincronizados automaticamente entre dispositivos. Sem autenticação, os dados ficam apenas no dispositivo local.'
  },
];

const categories = ['Todos', 'Começando', 'Recursos', 'Categorias', 'Dados', 'Sugestões', 'Técnico'];

export default function HelpPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todos' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />
      
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            📚 Central de Ajuda
          </h1>
          <p className="text-gray-600 text-lg">
            Encontre respostas para suas dúvidas sobre o OptiGrana
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por palavra-chave..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-lg transition-all"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full font-semibold transition-all ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-xl transition-all cursor-pointer">
            <Book className="w-10 h-10 text-blue-600 mb-3" />
            <h3 className="font-bold text-gray-800 mb-2">Guia Rápido</h3>
            <p className="text-sm text-gray-600">
              Aprenda o básico em 5 minutos
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-xl transition-all cursor-pointer">
            <TrendingUp className="w-10 h-10 text-green-600 mb-3" />
            <h3 className="font-bold text-gray-800 mb-2">Dicas de Economia</h3>
            <p className="text-sm text-gray-600">
              Maximize suas economias
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-xl transition-all cursor-pointer">
            <Settings className="w-10 h-10 text-purple-600 mb-3" />
            <h3 className="font-bold text-gray-800 mb-2">Configurações</h3>
            <p className="text-sm text-gray-600">
              Personalize sua experiência
            </p>
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <HelpCircle className="w-7 h-7 text-blue-600" />
            Perguntas Frequentes
          </h2>

          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                Nenhuma pergunta encontrada. Tente outro termo de busca.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFaqs.map((faq, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg overflow-hidden hover:border-blue-300 transition-all"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-all"
                  >
                    <div className="flex-1">
                      <span className="inline-block px-3 py-1 bg-blue-100 text-blue-600 text-xs font-semibold rounded-full mb-2">
                        {faq.category}
                      </span>
                      <h3 className="font-semibold text-gray-800">{faq.question}</h3>
                    </div>
                    {openIndex === index ? (
                      <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0 ml-4" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0 ml-4" />
                    )}
                  </button>
                  
                  {openIndex === index && (
                    <div className="px-5 pb-5 text-gray-600 bg-gray-50">
                      <p className="leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Contact Support */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center shadow-xl">
          <h3 className="text-2xl font-bold mb-3">Ainda tem dúvidas?</h3>
          <p className="mb-6 opacity-90">
            Nossa equipe está pronta para ajudar você
          </p>
          <a
            href="/feedback"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:shadow-xl transition-all"
          >
            Enviar Mensagem
          </a>
        </div>
      </div>
    </div>
  );
}
