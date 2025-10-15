import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BellIcon, InboxIcon, PhoneIcon, UserIcon, BriefcaseIcon, CurrencyDollarIcon } from "@heroicons/react/24/outline";
import api from "../api/connection";
import ProfileForm from "../components/ProfileForm";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
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
      setEditMode(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  if (!profile)
    return (
      <div className="text-center text-gray-400 mt-20 animate-pulse text-lg">
        Loading Profile...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-6 relative overflow-hidden text-white">
      {/* Animated glowing background */}
      <div className="absolute w-[600px] h-[600px] bg-red-600 opacity-20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute w-[500px] h-[500px] bg-blue-700 opacity-10 rounded-full blur-3xl animate-ping"></div>

      {/* Home Button */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 px-4 py-2 bg-gradient-to-r from-blue-600 to-red-500 rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
      >
        🏠 Home
      </button>

      {/* Profile Card */}
      <div className="bg-gray-800/90 backdrop-blur-md border border-red-500/40 shadow-[0_0_30px_rgba(255,0,0,0.3)] rounded-2xl w-full max-w-4xl p-8 flex gap-8 transition-all duration-500 animate-fade-in-up">
        {!editMode ? (
          <>
            {/* Left Section: Image, Name, Email */}
            <div className="flex flex-col items-center w-1/3">
              <img
                src={profile.picture || "/default-avatar.png"}
                alt="Profile"
                className="w-40 h-40 rounded-full border-4 border-red-500 shadow-lg mb-4 hover:scale-105 transition-transform duration-300"
              />
              <h2 className="text-2xl font-bold text-red-500 mb-2">{profile.name}</h2>
              <p className="text-gray-400 text-center">{profile.email}</p>
            </div>

            {/* Right Section: Info Boxes */}
            <div className="flex-1 grid grid-cols-2 gap-4">
              <div className="bg-gray-900/80 p-4 rounded-lg border border-red-500/40 hover:shadow-lg transition-all duration-300 flex items-center gap-2">
                <PhoneIcon className="w-6 h-6 text-red-500" />
                <div>
                  <strong>Phone:</strong>
                  <p>{profile.phone || "—"}</p>
                </div>
              </div>

              <div className="bg-gray-900/80 p-4 rounded-lg border border-red-500/40 hover:shadow-lg transition-all duration-300 flex items-center gap-2">
                <UserIcon className="w-6 h-6 text-red-500" />
                <div>
                  <strong>Gender:</strong>
                  <p>{profile.gender || "—"}</p>
                </div>
              </div>

              <div className="bg-gray-900/80 p-4 rounded-lg border border-red-500/40 hover:shadow-lg transition-all duration-300 flex items-center gap-2">
                <BriefcaseIcon className="w-6 h-6 text-red-500" />
                <div>
                  <strong>Job:</strong>
                  <p>{profile.job || "—"}</p>
                </div>
              </div>

              <div className="bg-gray-900/80 p-4 rounded-lg border border-red-500/40 hover:shadow-lg transition-all duration-300 flex items-center gap-2">
                <CurrencyDollarIcon className="w-6 h-6 text-red-500" />
                <div>
                  <strong>Currency:</strong>
                  <p>{profile.currency || "—"}</p>
                </div>
              </div>

              {/* Notifications Box */}
              <div className="bg-gray-900/80 p-4 rounded-lg border border-red-500/40 hover:shadow-lg transition-all duration-300 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BellIcon className="w-6 h-6 text-yellow-400" />
                  <strong>Notifications</strong>
                </div>
                <span
                  className={`w-10 h-5 rounded-full flex items-center px-1 cursor-pointer transition-colors duration-300 ${
                    profile.notifications ? "bg-green-500" : "bg-gray-500"
                  }`}
                >
                  <span
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                      profile.notifications ? "translate-x-5" : "translate-x-0"
                    }`}
                  ></span>
                </span>
              </div>

              {/* Mailing Box */}
              <div className="bg-gray-900/80 p-4 rounded-lg border border-red-500/40 hover:shadow-lg transition-all duration-300 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <InboxIcon className="w-6 h-6 text-pink-400" />
                  <strong>Mailing</strong>
                </div>
                <span
                  className={`w-10 h-5 rounded-full flex items-center px-1 cursor-pointer transition-colors duration-300 ${
                    profile.mailing ? "bg-green-500" : "bg-gray-500"
                  }`}
                >
                  <span
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                      profile.mailing ? "translate-x-5" : "translate-x-0"
                    }`}
                  ></span>
                </span>
              </div>
            </div>

            {/* Edit Button */}
            <button
              onClick={() => setEditMode(true)}
              className="absolute bottom-6 right-6 w-48 bg-gradient-to-r from-red-600 to-blue-600 py-3 rounded-lg font-semibold hover:scale-105 hover:shadow-[0_0_25px_rgba(255,0,0,0.4)] transition-all duration-300"
            >
              ✏️ Edit Profile
            </button>
          </>
        ) : (
          <ProfileForm
            profile={profile}
            onSave={handleSave}
            onCancel={() => setEditMode(false)}
          />
        )}
      </div>
    </div>
  );
};

export default Profile;
