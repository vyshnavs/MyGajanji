import React from "react";
import TransactionForm from "../components/TransactionForm";
import { useNavigate } from "react-router-dom";

// Page wrapper for Add Transaction. Provides layout, header and a nice slide-up animation for the form.
export default function AddTransaction() {
  const navigate = useNavigate();

  const goHome = () => navigate("/");

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center p-4 relative">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 -left-10 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -right-10 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl animate-bounce" style={{ animationDuration: '8s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-green-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '12s' }}></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
            animation: 'gridMove 20s linear infinite'
          }}></div>
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white/5 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${15 + Math.random() * 20}s infinite linear`,
                animationDelay: `${Math.random() * 5}s`
              }}
            ></div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
        @keyframes float {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(10px, -10px) rotate(90deg); }
          50% { transform: translate(0, -20px) rotate(180deg); }
          75% { transform: translate(-10px, -10px) rotate(270deg); }
        }
      `}</style>

      {/* Home Button */}
      <button
        onClick={goHome}
        className="absolute top-6 left-6 z-20 flex items-center gap-2 px-4 py-3 rounded-2xl bg-gray-800/80 hover:bg-gray-700/80 backdrop-blur-sm border border-gray-700 hover:border-gray-600 transform hover:-translate-y-0.5 transition-all duration-300 group"
      >
        <svg className="w-5 h-5 group-hover:text-blue-400 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
        <span className="text-sm font-medium group-hover:text-blue-300 transition-colors hidden sm:block">
          Home
        </span>
      </button>

      <div className="w-full max-w-3xl bg-gray-800/60 backdrop-blur-sm rounded-2xl shadow-2xl p-6 transform transition-transform duration-500 ease-out translate-y-6 animate-slideup border border-gray-700/50">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
              Add Transaction
            </h1>
            <p className="text-sm text-gray-400 mt-2">Record income or expense to keep your finances up to date.</p>
          </div>
        </header>

        {/* TransactionForm is the controlled form component. It will handle the submit and redirect on success. */}
        <TransactionForm onSuccess={() => navigate("/category")}/>
      </div>
    </div>
  );
}