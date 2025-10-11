import React, { useState } from 'react';

const FAQList = ({ faqs }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-4">
      {faqs.map((faq, index) => (
        <div
          key={index}
          className={`bg-cyan-100/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50 transition-all duration-500 overflow-hidden ${
            openIndex === index 
              ? 'shadow-lg scale-[1.02] border-red-200 dark:border-red-800' 
              : 'shadow-md hover:shadow-lg hover:scale-[1.01]'
          }`}
        >
          <button
            onClick={() => toggleFAQ(index)}
            className="w-full px-6 py-4 text-left focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 rounded-xl"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white pr-4">
                {faq.question}
              </h3>
              <div className={`transform transition-transform duration-500 ${
                openIndex === index ? 'rotate-180' : ''
              }`}>
                <svg 
                  className="w-5 h-5 text-red-500 dark:text-red-400 flex-shrink-0" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M19 9l-7 7-7-7" 
                  />
                </svg>
              </div>
            </div>
          </button>
          <div 
            className={`px-6 transition-all duration-500 ${
              openIndex === index 
                ? 'max-h-96 opacity-100 pb-4' 
                : 'max-h-0 opacity-0'
            }`}
          >
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FAQList;