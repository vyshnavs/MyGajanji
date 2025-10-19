import React, { useState, useEffect } from "react";
import { Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SanjayImg from "../assets/sanjayimg.jpg";
import VyshnavImg from "../assets/vyshnavimg.png";
import SandraImg from "../assets/sandraimg.jpg";
import GouriImg from "../assets/gouripriyaimg.jpg";

export default function AboutPage() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const teamMembers = [
    {
      id: 1,
      name: "Vyshnav S",
      role: "Electrical Engineering student",
      image: VyshnavImg,
    },
    {
      id: 2,
      name: "Sanjay P S",
      role: "Mechanical Engineering student",
      image: SanjayImg,
    },
    {
      id: 3,
      name: "Sandra",
      role: "Civil Engineering student",
      image: SandraImg,
    },
    {
      id: 4,
      name: "Gouri Priya",
      role: "Production Engineering student",
      image: GouriImg,
    },
  ];

  // Auto-rotate carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % teamMembers.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [teamMembers.length]);

  const navigate = useNavigate();

  const goHome = () => navigate("/");

  const getVisibleMembers = () => {
    const members = [];
    for (let i = -1; i <= 1; i++) {
      const idx = (currentIndex + i + teamMembers.length) % teamMembers.length;
      members.push({ ...teamMembers[idx], offset: i });
    }
    return members;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
      {/* Home Button */}
      <button
        onClick={goHome}
        className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 bg-white text-slate-900 rounded-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
      >
        <Home size={20} />
        <span className="font-semibold">Home</span>
      </button>

      {/* Header */}
      <div className="pt-24 pb-16 text-center px-4">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
          About Our Platform
        </h1>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          Revolutionizing personal finance management with intelligent,
          user-friendly tools
        </p>
      </div>

      {/* Mission & Vision Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 md:gap-12">
          {/* Mission Box */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-red-500 to-red-400 rounded-xl blur-lg opacity-0 group-hover:opacity-75 transition-opacity duration-500 animate-pulse"></div>
            <div className="relative bg-slate-800 p-8 rounded-xl border border-slate-700 hover:border-red-500 transition-all duration-500">
              <div className="absolute top-0 right-0 w-1 h-12 bg-gradient-to-b from-red-500 to-transparent rounded-bl-lg"></div>
              <h2 className="text-3xl font-bold text-red-400 mb-4">
                Our Mission
              </h2>
              <p className="text-gray-300 leading-relaxed">
                To empower individuals with cutting-edge financial management
                tools that simplify budgeting, expense tracking, and wealth
                building. We believe everyone deserves access to intelligent,
                intuitive technology that helps them take control of their
                financial future.
              </p>
            </div>
          </div>

          {/* Vision Box */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-red-500 to-red-400 rounded-xl blur-lg opacity-0 group-hover:opacity-75 transition-opacity duration-500 animate-pulse"></div>
            <div className="relative bg-slate-800 p-8 rounded-xl border border-slate-700 hover:border-red-500 transition-all duration-500">
              <div className="absolute top-0 right-0 w-1 h-12 bg-gradient-to-b from-red-500 to-transparent rounded-bl-lg"></div>
              <h2 className="text-3xl font-bold text-red-400 mb-4">
                Our Vision
              </h2>
              <p className="text-gray-300 leading-relaxed">
                To create a world where financial literacy and management are
                accessible, engaging, and effortless for everyone. We envision a
                future where technology bridges the gap between financial goals
                and achievements, enabling better decisions and lasting
                prosperity.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Carousel Section */}
      <div className="max-w-7xl mx-auto px-4 md:px-20 py-16 overflow-hidden">
        <h2 className="text-4xl font-bold text-white text-center mb-16">
          Meet Our Team
        </h2>

        <div className="relative flex items-center justify-center min-h-96">
          {/* Carousel Container */}
          <div className="w-full flex items-center justify-center">
            <div
              className="relative w-full h-80 flex items-center justify-center"
              style={{ perspective: "1200px" }}
            >
              {getVisibleMembers().map((member) => {
                const offset = member.offset;
                const angle = offset * 100;
                const radius = 280;

                return (
                  <div
                    key={member.id}
                    className={`absolute transition-all duration-500 ease-out ${
                      offset === 0 ? "z-30" : "z-10"
                    }`}
                    style={{
                      transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                      perspective: "1000px",
                      opacity: offset === 0 ? 1 : 0.3,
                    }}
                  >
                    <div className="flex flex-col items-center">
                      <div
                        className="relative w-64 h-64 rounded-2xl overflow-hidden shadow-2xl border-4 border-red-500"
                        style={{ backfaceVisibility: "hidden" }}
                      >
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-full h-full object-cover filter grayscale"
                        />
                      </div>

                      {offset === 0 && (
                        <div className="mt-6 text-center transition-opacity duration-500">
                          <h3 className="text-2xl font-bold text-white mb-1">
                            {member.name}
                          </h3>
                          <p className="text-red-400 font-medium">
                            {member.role}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="max-w-6xl mx-auto px-4 py-16 mb-16">
        <h2 className="text-4xl font-bold text-white text-center mb-12">
          Our Core Values
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              title: "Innovation",
              desc: "Constantly pushing boundaries to deliver cutting-edge solutions",
            },
            {
              title: "Integrity",
              desc: "Building trust through transparency and ethical practices",
            },
            {
              title: "Empowerment",
              desc: "Enabling users to achieve their financial goals",
            },
          ].map((value, idx) => (
            <div key={idx} className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-400 rounded-lg opacity-0 group-hover:opacity-50 transition-opacity duration-500 blur-md"></div>
              <div className="relative bg-slate-800 p-6 rounded-lg border border-slate-700 hover:border-red-500 transition-all duration-500">
                <h3 className="text-xl font-bold text-red-400 mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-300">{value.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 py-8 text-center text-gray-400">
        <p>&copy; 2025 Personal Money Management API. All rights reserved.</p>
      </footer>
    </div>
  );
}
