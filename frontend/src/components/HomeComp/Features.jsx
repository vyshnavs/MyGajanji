// components/Features.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Activity, BarChart2, BellRing, Cloud } from 'lucide-react';


const features = [
  {
    title: "Expense Tracking in Real-Time",
    icon: <Activity size={32} className="text-blue-400" />,
  },
  {
    title: "Budget Planning with AI Insights",
    icon: <BarChart2 size={32} className="text-blue-400" />,
  },
  {
    title: "Automatic Bill Reminders",
    icon: <BellRing size={32} className="text-blue-400" />,
  },
  {
    title: "Secure Cloud Backup",
    icon: <Cloud size={32} className="text-blue-400" />,
  },
];

const Features = () => {
  return (
    <section
      id="features"
      className="py-20 px-8 md:px-20 bg-gradient-to-b from-gray-900 to-black text-white"
    >
      <motion.h2
        className="text-4xl font-bold text-center text-blue-400 mb-14"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        Features That Empower You
      </motion.h2>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className="flex items-start gap-4 p-6 rounded-xl border border-blue-700 bg-gradient-to-br from-gray-800 via-gray-900 to-black shadow-xl hover:scale-[1.02] transition-transform duration-300"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
          >
            <div className="p-3 bg-blue-900/40 rounded-full border border-blue-600">
              {feature.icon}
            </div>
            <div>
              <h3 className="text-xl font-semibold text-blue-300">
                {feature.title}
              </h3>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Features;

