// components/HeroSection.jsx
import React from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import chatbotGif from "../../assets/bot.gif";

const HeroSection = () => {
  const navigate = useNavigate();

  const handleBotClick = () => {
    navigate("/chatbot"); // go to chat route
  };

  return (
    <div className="relative min-h-[80vh] flex items-center justify-center px-8 md:px-20 overflow-hidden">
      {/* Animated Background Image */}
      <motion.img
        src="https://as2.ftcdn.net/v2/jpg/09/09/42/95/1000_F_909429531_3ES5WSQxgiHH7LKFf6BPP6RpqmVrqdzN.jpg"
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover opacity-35"
        initial={{ scale: 1 }}
        animate={{ scale: 1.7 }}
        transition={{ duration: 10, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
      />

      {/* Content */}
      <div className="bg-black/60 p-10 rounded-xl max-w-3xl relative z-10">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Take Control of <span className="text-red-400">Your Finances</span>
          </h1>
          <p className="text-white text-lg mb-6">
            Track your spending, save more, and manage budgets seamlessly with{" "}
            <span className="font-semibold text-blue-300">MyGajanji</span>.
          </p>
        </motion.div>
      </div>

      {/* Transparent GIF Chatbot Icon - bottom-right with spacing */}
      <motion.button
        onClick={handleBotClick}
        className="fixed right-6 bottom-6 z-20 flex items-center gap-2 pl-0 pr-0 py-0 bg-transparent border-0"
        initial={{ y: 0 }}
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open chatbot"
      >
        <div className="relative">
          {/* Soft glow only (no white background) */}
          <motion.span
            className="absolute -inset-2 rounded-full bg-rose-500/25 blur-lg"
            initial={{ opacity: 0.4, scale: 0.9 }}
            animate={{ opacity: [0.25, 0.5, 0.25], scale: [0.9, 1.05, 0.9] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* Bot GIF (transparent container) */}
          <div className="relative z-10 h-20 w-20 rounded-full overflow-hidden">
            <img
              src={chatbotGif}
              alt="Chat Bot"
              className="h-full w-full object-contain select-none pointer-events-none"
              draggable="false"
            />
          </div>
        </div>
        <span className="ml-2 text-sm font-semibold text-white drop-shadow">Click me</span>
      </motion.button>
    </div>
  );
};

export default HeroSection;
