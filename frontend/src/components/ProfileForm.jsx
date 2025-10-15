import React, { useState } from "react";

const ProfileForm = ({ profile, onSave, onCancel }) => {
  const [formData, setFormData] = useState({ ...profile });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-800/70 p-6 rounded-2xl backdrop-blur-md border border-blue-800/30 space-y-4"
    >
      <h2 className="text-2xl font-bold text-center text-blue-400 mb-4">
        Edit Profile
      </h2>

      <input
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Name"
        className="w-full p-2 rounded-md text-black"
      />
      <input
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
        className="w-full p-2 rounded-md text-black"
      />
      <input
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        placeholder="Phone"
        className="w-full p-2 rounded-md text-black"
      />
      <input
        name="gender"
        value={formData.gender}
        onChange={handleChange}
        placeholder="Gender"
        className="w-full p-2 rounded-md text-black"
      />
      <input
        name="job"
        value={formData.job}
        onChange={handleChange}
        placeholder="Job"
        className="w-full p-2 rounded-md text-black"
      />
      <input
        name="currency"
        value={formData.currency}
        onChange={handleChange}
        placeholder="Currency"
        className="w-full p-2 rounded-md text-black"
      />

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          name="notifications"
          checked={formData.notifications}
          onChange={handleChange}
        />
        Notifications
      </label>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          name="mailing"
          checked={formData.mailing}
          onChange={handleChange}
        />
        Mailing
      </label>

      <div className="flex gap-4 justify-center mt-4">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-600 rounded-lg font-semibold hover:bg-gray-700 transition"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ProfileForm;
