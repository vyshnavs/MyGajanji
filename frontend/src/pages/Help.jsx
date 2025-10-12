import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FAQList from '../components/FAQList';
import api from "../api/connection";

const Help = () => {
  const [faqs, setFaqs] = useState([]);
  const [filteredFaqs, setFilteredFaqs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();

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

  const goHome = () => navigate('/');

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 relative overflow-hidden py-8 px-4 sm:px-6 lg:px-8 transition-all duration-500">
      {/* Blue-Black Animated Background */}
      <div className="absolute inset-0 -z-10">
        {/* Main Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-gray-900 to-black"></div>
        
        {/* Animated Orbs */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -right-20 w-80 h-80 bg-blue-800/25 rounded-full blur-3xl animate-bounce" style={{ animationDuration: '8s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-cyan-600/15 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '12s' }}></div>
        <div className="absolute top-3/4 right-1/4 w-64 h-64 bg-indigo-700/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '15s' }}></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
            animation: 'gridMove 25s linear infinite'
          }}></div>
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0">
          {[...Array(25)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1.5 h-1.5 bg-blue-400/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `floatParticle ${20 + Math.random() * 25}s infinite linear`,
                animationDelay: `${Math.random() * 10}s`
              }}
            ></div>
          ))}
        </div>

        {/* Wave Effect */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-blue-800/30 to-transparent"></div>
        
        {/* Shimmer Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/5 to-transparent animate-shimmer"></div>
      </div>

      <style jsx>{`
        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(60px, 60px); }
        }
        @keyframes floatParticle {
          0%, 100% { transform: translate(0, 0) rotate(0deg); opacity: 0.3; }
          25% { transform: translate(15px, -15px) rotate(90deg); opacity: 0.6; }
          50% { transform: translate(0, -30px) rotate(180deg); opacity: 0.8; }
          75% { transform: translate(-15px, -15px) rotate(270deg); opacity: 0.6; }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 8s ease-in-out infinite;
        }
      `}</style>

      <div className="max-w-4xl mx-auto relative">
        {/* Home Button */}
        <button
          onClick={goHome}
          className="absolute -left-4 top-0 z-20 flex items-center gap-2 px-4 py-3 rounded-2xl bg-gray-800/80 hover:bg-gray-700/80 backdrop-blur-sm border border-gray-700 hover:border-gray-600 transform hover:-translate-y-0.5 transition-all duration-300 group"
        >
          <svg className="w-5 h-5 group-hover:text-blue-400 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          <span className="text-sm font-medium group-hover:text-blue-300 transition-colors hidden sm:block">
            Home
          </span>
        </button>

        {/* Header */}
        <div className={`text-center mb-12 transform transition-all duration-700 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'} pl-16 sm:pl-0`}>
          <div className="relative inline-block">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-lg animate-pulse-slow"></div>
            <h1 className="relative text-4xl font-bold bg-gradient-to-r from-blue-300 via-cyan-300 to-indigo-300 bg-clip-text text-transparent mb-4">
              Help & Support
            </h1>
          </div>
          <p className="text-lg text-blue-100/80 mt-4 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            Find answers to common questions and get support
          </p>
        </div>

        {/* Search Bar */}
        <div className={`mb-8 transform transition-all duration-700 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`} style={{ transitionDelay: '300ms' }}>
          <div className="relative max-w-2xl mx-auto group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-indigo-500 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search FAQs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-12 pr-4 text-white bg-gray-800/70 backdrop-blur-xl border border-blue-500/30 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:bg-gray-800/90 transition-all duration-300 placeholder-blue-200/60 shadow-2xl shadow-blue-500/10"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-cyan-400 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
              <div className="w-16 h-16 border-4 border-blue-800/50 rounded-full animate-spin"></div>
              <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-cyan-400 rounded-full animate-spin"></div>
              <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-r-blue-400 rounded-full animate-spin" style={{ animationDuration: '2s' }}></div>
            </div>
            <span className="ml-4 text-cyan-200 font-medium">Loading FAQs...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className={`mb-6 transform transition-all duration-500 ${error ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
            <div className="bg-gradient-to-r from-red-900/40 to-orange-900/30 backdrop-blur-xl border border-red-500/30 rounded-xl p-6 shadow-2xl shadow-red-500/10">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center">
                    <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-red-100">Unable to Load FAQs</h3>
                  <p className="text-red-200/80 mt-1">{error}</p>
                </div>
              </div>
              <button
                onClick={fetchFAQs}
                className="mt-4 px-6 py-2 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 font-medium shadow-lg hover:shadow-red-500/25 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* FAQ Section */}
        {!loading && !error && (
          <div className={`mb-12 transform transition-all duration-700 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`} style={{ transitionDelay: '500ms' }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-300 via-cyan-300 to-indigo-300 bg-clip-text text-transparent">
                Frequently Asked Questions
              </h2>
              <span className="text-sm font-medium text-cyan-200 bg-blue-900/40 backdrop-blur-sm px-3 py-1.5 rounded-full border border-cyan-500/30 shadow-lg shadow-cyan-500/10">
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
                  <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-lg"></div>
                  <div className="relative w-20 h-20 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center shadow-2xl shadow-blue-500/20">
                    <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  No FAQs found
                </h3>
                <p className="text-blue-200/70">
                  {searchQuery ? 'Try adjusting your search terms' : 'No FAQs available at the moment'}
                </p>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="mt-4 px-4 py-2 text-cyan-400 hover:text-cyan-300 transition-colors duration-300"
                  >
                    Clear search
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Contact Support Section */}
        <div className={`transform transition-all duration-700 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`} style={{ transitionDelay: '700ms' }}>
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-indigo-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-blue-500/20 hover:border-cyan-400/30 transition-all duration-500 group-hover:shadow-cyan-500/10">
              <div className="text-center mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-cyan-500/20">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
                  Still need help?
                </h2>
                <p className="text-blue-100/80 mt-2 max-w-md mx-auto">
                  Can't find what you're looking for? Our support team is here to help you get back on track.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
                <button className="px-8 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 font-semibold shadow-2xl hover:shadow-cyan-500/25 flex items-center justify-center gap-3 group">
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364" />
                  </svg>
                  Contact Support
                </button>
                <button className="px-8 py-3 border border-cyan-400/50 text-cyan-300 hover:bg-cyan-900/20 hover:border-cyan-300/70 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 font-semibold flex items-center justify-center gap-3 group">
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Send Email
                </button>
              </div>
              <div className="text-center mt-6">
                <p className="text-blue-200/60 text-sm">
                  Typically replies within 2 hours
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-12">
          <p className="text-blue-300/50 text-sm">
            Need immediate assistance? Call us at <span className="text-cyan-300 font-semibold">1-800-HELP-NOW</span>
          </p>
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
            opacity: 0.2;
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