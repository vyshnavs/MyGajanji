// components/BuiltWith.jsx
import React from 'react';
import { motion } from 'framer-motion';

const technologies = ['React', 'Tailwind CSS', 'Framer Motion', 'Node.js', 'MongoDB'];

const BuiltWith = () => {
  return (
    <section id="built" className="py-20 px-8 md:px-20 bg-black text-white">
      <motion.h2
        className="text-4xl font-bold text-center text-blue-400 mb-10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        Built With Modern Tech
      </motion.h2>
      <div className="flex flex-wrap justify-center gap-6">
        {technologies.map((tech, index) => (
          <motion.div
            key={index}
            className="bg-gray-800 text-blue-300 px-6 py-3 rounded-full text-lg font-medium border border-blue-700"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: index * 0.1 }}
          >
            {tech}
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default BuiltWith;
