import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function SplashScreen() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    // cycle texts every 2 seconds
    const timer = setInterval(() => {
      setStep((prev) => (prev + 1) % 3); // Changed back to 3 steps
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const advertisingTexts = ["Your Money Management Partner", "loading"];

  // inline style for moving gradient background
  const gradientStyle = {
    backgroundImage: "linear-gradient(90deg, black, #1e3a8a, black)", // black-blue-black
    backgroundSize: "200% 200%",
    animation: "gradient-x 6s ease infinite",
  };

  return (
    <div
      className="h-screen w-screen flex flex-col items-center justify-center text-white"
      style={gradientStyle}
    >
      {/* inject keyframes for gradient animation */}
      <style>
        {`
        @keyframes gradient-x {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes dots {
          0%, 20% { content: "."; }
          40% { content: ".."; }
          60%, 100% { content: "..."; }
        }
        
        .loading-dots::after {
          content: "...";
          animation: dots 1.5s steps(1, end) infinite;
        }
        
        @keyframes typing {
          from { width: 0 }
          to { width: 100% }
        }
        
        @keyframes blink-caret {
          from, to { border-color: transparent }
          50% { border-color: white }
        }
        
        .typing-animation {
          overflow: hidden;
          border-right: 2px solid white;
          white-space: nowrap;
          margin: 0 auto;
          animation: 
            typing 2s steps(50, end),
            blink-caret 0.75s step-end infinite;
        }
      `}
      </style>

      {/* Main MyGajanji text - always visible */}
      <motion.h1
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="text-6xl md:text-8xl font-extrabold text-center text-transparent bg-clip-text mb-6"
        style={{
          backgroundImage: "linear-gradient(to right, #3b82f6, #ef4444)",
        }}
      >
        MyGajanji
      </motion.h1>

      {/* Secondary advertising text with typing animation */}
      {advertisingTexts.map(
        (text, i) =>
          step === i && (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center justify-center"
            >
              {text === "loading" ? (
                <div className="text-2xl md:text-4xl font-bold">
                  <span className="loading-dots"></span>
                </div>
              ) : (
                <h2 className="text-2xl md:text-4xl font-semibold text-center typing-animation">
                  {text}
                </h2>
              )}
            </motion.div>
          )
      )}
    </div>
  );
}