import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BellIcon, InboxIcon, PhoneIcon, UserIcon, BriefcaseIcon, CurrencyDollarIcon } from "@heroicons/react/24/outline";
import api from "../api/connection";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
        setFormData(res.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async (updatedData) => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.put("/profile", updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(res.data);
      setFormData(res.data);
      setEditMode(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleCancel = () => {
    setFormData(profile);
    setEditMode(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === "checkbox" ? checked : value 
    }));
  };

  const handleToggle = async (field) => {
    try {
      const token = localStorage.getItem("token");
      const updatedData = { ...profile, [field]: !profile[field] };
      const res = await api.put("/profile", updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(res.data);
      setFormData(res.data);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSave(formData);
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-gray-400">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          Loading Profile...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 -left-10 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -right-10 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl animate-bounce" style={{ animationDuration: '8s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-green-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '12s' }}></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: '50px 50px',
            }}
          ></div>
        </div>
      </div>

      {/* Home Button */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-4 left-4 z-20 flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-800/80 hover:bg-gray-700/80 backdrop-blur-sm border border-gray-700 hover:border-gray-600 transition-all duration-300 group"
      >
        <svg className="w-4 h-4 group-hover:text-blue-400 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
        <span className="text-sm font-medium group-hover:text-blue-300 transition-colors">
          Home
        </span>
      </button>

      {/* Main Content Container */}
      <div className="w-full max-w-4xl bg-gray-800/60 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50">
        {/* Header */}
        <div className="text-center p-6 border-b border-gray-700/50">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Profile Settings
          </h1>
          <p className="text-gray-400 mt-1 text-sm">Manage your personal information and preferences</p>
        </div>

        <div className="p-6">
          {!editMode ? (
            // View Mode - Optimized Layout
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Profile Card - Left Side */}
              <div className="lg:w-1/3">
                <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700/50 h-full">
                  <div className="text-center">
                    <div className="relative inline-block mb-4">
                      <img
                        src={profile.picture || "/default-avatar.png"}
                        alt="Profile"
                        className="w-24 h-24 rounded-full border-4 border-blue-500/50 shadow-lg mx-auto hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-900"></div>
                    </div>
                    <h2 className="text-lg font-bold text-white mb-1 truncate">{profile.name}</h2>
                    <p className="text-gray-400 text-sm mb-6 truncate">{profile.email}</p>
                    
                    <button
                      onClick={() => setEditMode(true)}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 py-2.5 rounded-lg font-semibold transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 text-sm"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit Profile
                    </button>
                  </div>
                </div>
              </div>

              {/* Information Grid - Right Side */}
              <div className="lg:w-2/3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700/50 h-full">
                      <h3 className="text-md font-semibold text-blue-400 mb-3 flex items-center gap-2">
                        <UserIcon className="w-4 h-4" />
                        Personal Info
                      </h3>
                      <div className="space-y-3">
                        <InfoBox 
                          icon={<PhoneIcon className="w-4 h-4" />}
                          label="Phone"
                          value={profile.phone}
                          color="blue"
                        />
                        <InfoBox 
                          icon={<UserIcon className="w-4 h-4" />}
                          label="Gender"
                          value={profile.gender}
                          color="blue"
                        />
                        <InfoBox 
                          icon={<BriefcaseIcon className="w-4 h-4" />}
                          label="Job"
                          value={profile.job}
                          color="blue"
                        />
                        <InfoBox 
                          icon={<CurrencyDollarIcon className="w-4 h-4" />}
                          label="Currency"
                          value={profile.currency}
                          color="blue"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Preferences & Stats */}
                  <div className="space-y-4">
                    {/* Preferences */}
                    <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700/50">
                      <h3 className="text-md font-semibold text-purple-400 mb-3 flex items-center gap-2">
                        <BellIcon className="w-4 h-4" />
                        Preferences
                      </h3>
                      <div className="space-y-3">
                        <ToggleBox 
                          icon={<BellIcon className="w-4 h-4" />}
                          label="Notifications"
                          description="App notifications"
                          enabled={profile.notifications}
                          onToggle={() => handleToggle('notifications')}
                          color="yellow"
                        />
                        <ToggleBox 
                          icon={<InboxIcon className="w-4 h-4" />}
                          label="Mailing List"
                          description="Email updates"
                          enabled={profile.mailing}
                          onToggle={() => handleToggle('mailing')}
                          color="pink"
                        />
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-xl p-4 border border-blue-500/30">
                      <h3 className="text-md font-semibold text-white mb-3">Profile Stats</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-300">Basic Info</span>
                          <span className="text-green-400">Complete</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-1.5">
                          <div className="bg-green-500 h-1.5 rounded-full w-full"></div>
                        </div>
                        
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-300">Contact</span>
                          <span className={profile.phone ? "text-blue-400" : "text-yellow-400"}>
                            {profile.phone ? 'Complete' : 'Pending'}
                          </span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-1.5">
                          <div 
                            className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                            style={{ width: profile.phone ? '100%' : '50%' }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Edit Mode - Compact Form
            <div className="max-w-2xl mx-auto">
              <div className="bg-gray-900/50 rounded-xl p-6 border border-blue-500/30">
                <h2 className="text-xl font-bold text-blue-400 mb-4 text-center">Edit Profile</h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      label="Full Name"
                      name="name"
                      value={formData.name || ''}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      type="text"
                    />
                    
                    <FormField
                      label="Email"
                      name="email"
                      value={formData.email || ''}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      type="email"
                    />
                    
                    <FormField
                      label="Phone"
                      name="phone"
                      value={formData.phone || ''}
                      onChange={handleChange}
                      placeholder="Enter your phone"
                      type="tel"
                    />

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Gender</label>
                      <select
                        name="gender"
                        value={formData.gender || ''}
                        onChange={handleChange}
                        className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all duration-300 text-sm"
                      >
                        <option value="">Select gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <FormField
                      label="Job Title"
                      name="job"
                      value={formData.job || ''}
                      onChange={handleChange}
                      placeholder="Enter your job"
                      type="text"
                    />
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Currency</label>
                      <select
                        name="currency"
                        value={formData.currency || ''}
                        onChange={handleChange}
                        className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all duration-300 text-sm"
                      >
                        <option value="">Select currency</option>
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                      </select>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 justify-center pt-4 border-t border-gray-700/50">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="px-6 py-2.5 rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-semibold transition-all duration-300 hover:scale-105 text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold transition-all duration-300 hover:scale-105 text-sm"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Reusable Components
const InfoBox = ({ icon, label, value, color = "blue" }) => {
  const colorClasses = {
    blue: "text-blue-400",
    green: "text-green-400",
    yellow: "text-yellow-400",
    purple: "text-purple-400",
    pink: "text-pink-400"
  };

  return (
    <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 transition-all duration-200">
      <div className={`${colorClasses[color]} flex-shrink-0`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-white font-medium text-sm truncate">{value || "Not set"}</p>
      </div>
    </div>
  );
};

const ToggleBox = ({ icon, label, description, enabled, onToggle, color = "blue" }) => {
  const colorClasses = {
    blue: "text-blue-400",
    green: "text-green-400",
    yellow: "text-yellow-400",
    purple: "text-purple-400",
    pink: "text-pink-400"
  };

  return (
    <div className="flex items-center justify-between p-2 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 transition-all duration-200">
      <div className="flex items-center gap-2 flex-1">
        <div className={`${colorClasses[color]} flex-shrink-0`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white font-medium text-sm">{label}</p>
          <p className="text-xs text-gray-400 truncate">{description}</p>
        </div>
      </div>
      <button
        onClick={onToggle}
        className={`w-10 h-5 rounded-full flex items-center px-0.5 transition-colors duration-300 flex-shrink-0 ${
          enabled ? "bg-green-500" : "bg-gray-600"
        }`}
      >
        <span
          className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform duration-300 ${
            enabled ? "translate-x-5" : "translate-x-0"
          }`}
        ></span>
      </button>
    </div>
  );
};

const FormField = ({ label, name, value, onChange, placeholder, type = "text" }) => (
  <div>
    <label className="block text-sm font-medium text-gray-300 mb-1">
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all duration-300 text-sm"
    />
  </div>
);

export default Profile;