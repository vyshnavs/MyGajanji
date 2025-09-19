// components/Home.jsx
import React from 'react';
import Navbar from '../components/navBars/HomeNav';
import HeroSection from '../components/HomeComp/Hero';
import Features from '../components/HomeComp/Features';
import BuiltWith from '../components/HomeComp/BuildWith';
import Footer from '../components/HomeComp/Footer';

const HomePage = () => {
  return (
    <div className="bg-gradient-to-br from-gray-900 via-dark-900 to-black text-white relative overflow-hidden">
      <Navbar />
      <HeroSection />
      <Features />
      <BuiltWith />
      <Footer />

      {/* Background Animated Circles */}
      <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-blue-700 opacity-30 blur-3xl rounded-full animate-pulse"></div>
      <div className="absolute bottom-[-150px] right-[-150px] w-[400px] h-[400px] bg-blue-500 opacity-20 blur-2xl rounded-full animate-pulse"></div>
    </div>
  );
};

export default HomePage;