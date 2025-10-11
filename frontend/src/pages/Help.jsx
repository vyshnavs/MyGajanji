import React, { useState, useEffect } from 'react';
import FAQList from '../components/FAQList';
import api from "../api/connection";

const Help = () => {
  const [faqs, setFaqs] = useState([]);
  const [filteredFaqs, setFilteredFaqs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchFAQs();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredFaqs(faqs);
    } else {
      const filtered = faqs.filter(faq => 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredFaqs(filtered);
    }
  }, [searchQuery, faqs]);

  const fetchFAQs = async () => {
    try {
      setLoading(true);
      const response = await api.get("/help");
      console.log('FAQs response:', response);
      if (!response) {
        throw new Error('Failed to fetch FAQs');
      }
      const data = response.data;
      setFaqs(data);
      setFilteredFaqs(data);
    } catch (err) {
      setError('Failed to load FAQs. Please try again later.');
      console.error('Error fetching FAQs:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900/20 py-8 px-4 sm:px-6 lg:px-8 transition-all duration-500">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className={`text-center mb-12 transform transition-all duration-700 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="relative inline-block">
            <div className="absolute -inset-4 bg-red-500/10 dark:bg-red-500/20 rounded-full blur-lg animate-pulse-slow"></div>
            <h1 className="relative text-4xl font-bold bg-gradient-to-r from-gray-900 to-blue-700 dark:from-white dark:to-blue-300 bg-clip-text text-transparent mb-4">
              Help & Support
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 mt-4 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            Find answers to common questions and get support
          </p>
        </div>

        {/* Search Bar */}
        <div className={`mb-8 transform transition-all duration-700 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`} style={{ transitionDelay: '300ms' }}>
          <div className="relative max-w-2xl mx-auto group">
            <div className="absolute -inset-1 bg-gradient-to-r from-red-500 to-blue-500 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search FAQs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-12 pr-4 text-gray-900 dark:text-white bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 rounded-lg focus:ring-2 focus:ring-red-500 focus:bg-white dark:focus:bg-gray-800 transition-all duration-300 placeholder-gray-500 dark:placeholder-gray-400 shadow-lg"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-red-500 dark:text-red-400 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12 animate-fade-in">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-red-200 dark:border-red-900 rounded-full animate-spin"></div>
              <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-red-500 dark:border-t-red-400 rounded-full animate-spin"></div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className={`mb-6 transform transition-all duration-500 ${error ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
            <div className="bg-red-50/80 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-red-800 dark:text-red-200">{error}</p>
                </div>
              </div>
              <button
                onClick={fetchFAQs}
                className="mt-3 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 font-medium shadow-lg hover:shadow-red-500/25"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* FAQ Section */}
        {!loading && !error && (
          <div className={`mb-12 transform transition-all duration-700 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`} style={{ transitionDelay: '500ms' }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white bg-gradient-to-r from-gray-900 to-blue-700 dark:from-white dark:to-blue-300 bg-clip-text text-transparent">
                Frequently Asked Questions
              </h2>
              <span className="text-sm text-gray-500 dark:text-gray-400 bg-white/50 dark:bg-gray-800/50 px-3 py-1 rounded-full border border-gray-200 dark:border-gray-700">
                {filteredFaqs.length} {filteredFaqs.length === 1 ? 'question' : 'questions'}
              </span>
            </div>
            
            {filteredFaqs.length > 0 ? (
              <div className="space-y-4">
                <FAQList faqs={filteredFaqs} />
              </div>
            ) : (
              <div className="text-center py-12 animate-fade-in-up">
                <div className="relative inline-block mb-4">
                  <div className="absolute -inset-4 bg-red-500/10 dark:bg-red-500/20 rounded-full blur-lg"></div>
                  <svg className="relative h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No FAQs found
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {searchQuery ? 'Try adjusting your search terms' : 'No FAQs available at the moment'}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Contact Support Section */}
        <div className={`transform transition-all duration-700 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`} style={{ transitionDelay: '700ms' }}>
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-red-500 to-blue-500 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-500">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 bg-gradient-to-r from-gray-900 to-blue-700 dark:from-white dark:to-blue-300 bg-clip-text text-transparent">
                Still need help?
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Can't find what you're looking for? Our support team is here to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 font-medium shadow-lg hover:shadow-red-500/25 flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364" />
                  </svg>
                  Contact Support
                </button>
                <button className="px-6 py-3 border border-blue-300 dark:border-blue-600 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 font-medium flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Send Email
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom styles for animations */}
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.25;
          }
          50% {
            opacity: 0.4;
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s infinite;
        }
      `}</style>
    </div>
  );
};

export default Help;