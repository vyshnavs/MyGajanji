import React from "react";

const Home = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-4xl font-bold text-blue-700 mb-4">Welcome to MyGajanji</h1>
            <p className="text-lg text-gray-700 mb-8">
                This is your home page. Start exploring!
            </p>
            <button className="px-6 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition">
                Get Started
            </button>
        </div>
    );
};

export default Home;