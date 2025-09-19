// components/Footer.jsx
import React from 'react';
import { motion } from 'framer-motion';
import {
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Mail,
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-t from-gray-900 to-black text-white py-16 px-8 md:px-20">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">

        {/* About Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-xl font-bold text-blue-400 mb-4">About MyGajanji</h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            MyGajanji is your intelligent personal finance companion built to give you complete control over your financial habits. Save smart, spend wisely, and grow confidently.
          </p>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h2 className="text-xl font-bold text-blue-400 mb-4">Contact Us</h2>
          <p className="text-gray-300 text-sm">Email: support@moneywise.com</p>
          <p className="text-gray-300 text-sm">Phone: +91 98765 43210</p>
        </motion.div>

        {/* Social Media Icons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <h2 className="text-xl font-bold text-blue-400 mb-4">Follow Us</h2>
          <div className="flex gap-4">
            <a href="#" className="hover:text-blue-400 transition">
              <Facebook size={24} />
            </a>
            <a href="#" className="hover:text-pink-400 transition">
              <Instagram size={24} />
            </a>
            <a href="#" className="hover:text-sky-400 transition">
              <Twitter size={24} />
            </a>
            <a href="#" className="hover:text-blue-500 transition">
              <Linkedin size={24} />
            </a>
            <a href="mailto:support@moneywise.com" className="hover:text-red-400 transition">
              <Mail size={24} />
            </a>
          </div>
        </motion.div>
      </div>

      {/* Footer Bottom */}
      <motion.div
        className="text-center text-sm text-gray-500 mt-12"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        © {new Date().getFullYear()} MyGajanji. All rights reserved.
      </motion.div>
    </footer>
  );
};

export default Footer;
