import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, AlertCircle, Shield } from 'lucide-react';
import Sidebar from '../components/Sidebar';

const InputField = ({ label, name, value, onChange, type = 'text', placeholder, danger }) => (
  <div>
    <label className="block text-sm font-medium text-slate-400 mb-2">{label}</label>
    <input
      type={type}
      name={name}
      value={value || ''}
      onChange={onChange}
      className={`w-full bg-slate-900 border rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none transition-all ${
        danger
          ? 'border-rose-500/30 focus:border-rose-500/60 focus:shadow-[0_0_15px_rgba(244,63,94,0.1)]'
          : 'border-slate-700/50 focus:border-blue-500/50 focus:shadow-[0_0_15px_rgba(59,130,246,0.1)]'
      }`}
      placeholder={placeholder}
    />
  </div>
);

const SelectField = ({ label, name, value, onChange, options }) => (
  <div>
    <label className="block text-sm font-medium text-slate-400 mb-2">{label}</label>
    <select
      name={name}
      value={value || ''}
      onChange={onChange}
      className="w-full bg-slate-900 border border-slate-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 focus:shadow-[0_0_15px_rgba(59,130,246,0.1)] transition-all appearance-none"
    >
      <option value="">Select...</option>
      {options.map(opt => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  </div>
);

const AllergySelector = ({ label, name, value, onChange }) => {
  const commonAllergies = ['Peanuts', 'Tree Nuts', 'Dairy', 'Eggs', 'Wheat', 'Soy', 'Fish', 'Shellfish'];
  const currentStr = value || '';
  
  const selectedList = currentStr.split(',').map(s => s.trim().toLowerCase());

  const toggleAllergy = (allergy) => {
    let list = currentStr.split(',').map(s => s.trim()).filter(Boolean);
    const lowerAllergy = allergy.toLowerCase();
    
    if (selectedList.includes(lowerAllergy)) {
      list = list.filter(item => item.toLowerCase() !== lowerAllergy);
    } else {
      list.push(allergy);
    }
    onChange({ target: { name, value: list.join(', ') } });
  };

  return (
    <div>
      <label className="block text-sm font-medium text-slate-400 mb-3">{label}</label>
      <div className="flex flex-wrap gap-2 mb-3">
        {commonAllergies.map(allergy => {
          const isSelected = selectedList.includes(allergy.toLowerCase());
          return (
            <button
              key={allergy}
              type="button"
              onClick={() => toggleAllergy(allergy)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${
                isSelected
                  ? 'bg-blue-500/20 border-blue-500/50 text-blue-300'
                  : 'bg-slate-900 border-slate-700/50 text-slate-400 hover:border-slate-600 hover:text-slate-300'
              }`}
            >
              {isSelected && <span className="mr-1">✓</span>}
              {allergy}
            </button>
          );
        })}
      </div>
      <input
        type="text"
        name={name}
        value={value || ''}
        onChange={onChange}
        className="w-full bg-slate-900 border border-slate-700/50 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:shadow-[0_0_15px_rgba(59,130,246,0.1)] transition-all"
        placeholder="Type other allergies (comma separated)"
      />
    </div>
  );
};

const NutritionProfile = () => {
  const [profile, setProfile] = useState({
    age: '', sex: '', height: '', weight: '',
    activity_level: '', diet_preference: '',
    food_allergies: '', vegetarian_type: '',
    foods_liked: '', foods_disliked: ''
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch(`http://${window.location.hostname}:8000/api/profile/nutrition`)
      .then(res => { if (res.ok) return res.json(); return {}; })
      .then(data => setProfile(prev => ({ ...prev, ...data })))
      .catch(err => console.error("Error fetching profile:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage('');
    
    try {
      const res = await fetch(`http://${window.location.hostname}:8000/api/profile/nutrition`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      });
      if (res.ok) {
        setMessage('Profile saved successfully!');
      } else {
        setMessage('Failed to save profile.');
      }
    } catch (err) {
      console.error(err);
      setMessage('An error occurred.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 font-inter text-slate-300">
      <Sidebar />
      <main className="flex-1 ml-72 p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold font-outfit text-white mb-2">Nutrition & Lifestyle Profile</h1>
            <p className="text-slate-500">Provide details to generate a personalized and safe wellness plan.</p>
          </motion.header>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-2xl p-8 mb-8"
          >
            {/* Safety Notice */}
            <div className="flex items-start space-x-3 mb-8 p-4 bg-blue-500/5 border border-blue-500/15 rounded-xl">
              <Shield className="w-6 h-6 text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-300/80">
                <p className="font-semibold mb-1 text-blue-300">Important Safety Notice</p>
                <p>Ensure you list all food allergies accurately. This AI-generated plan is for general wellness purposes only and does not substitute professional medical advice.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Info */}
              <div>
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <InputField label="Age" name="age" value={profile.age} onChange={handleChange} type="number" placeholder="e.g. 35" />
                  <SelectField label="Sex" name="sex" value={profile.sex} onChange={handleChange} options={['Male', 'Female', 'Other']} />
                  <InputField label="Height (cm/in)" name="height" value={profile.height} onChange={handleChange} placeholder="e.g. 175cm" />
                  <InputField label="Weight (kg/lbs)" name="weight" value={profile.weight} onChange={handleChange} placeholder="e.g. 70kg" />
                </div>
              </div>

              {/* Dietary */}
              <div className="pt-2 border-t border-slate-800/50">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Dietary Preferences</h3>
                <div className="space-y-5">
                  <AllergySelector label="Food Allergies" name="food_allergies" value={profile.food_allergies} onChange={handleChange} />
                  <SelectField label="Diet Preference" name="vegetarian_type" value={profile.vegetarian_type} onChange={handleChange} options={['Vegetarian', 'Non-Vegetarian', 'Vegan', 'Eggetarian', 'Custom']} />
                  <SelectField label="Activity Level" name="activity_level" value={profile.activity_level} onChange={handleChange} options={['Sedentary', 'Lightly Active', 'Moderately Active', 'Very Active']} />
                </div>
              </div>

              {/* Save */}
              <div className="flex items-center justify-between pt-6 border-t border-slate-800/50">
                {message && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-emerald-400 text-sm font-medium"
                  >
                    ✓ {message}
                  </motion.span>
                )}
                {!message && <span />}
                <motion.button
                  type="submit"
                  disabled={isSaving}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white px-7 py-3 rounded-xl font-medium transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50"
                >
                  <Save className="w-5 h-5 mr-2" />
                  {isSaving ? 'Saving...' : 'Save Profile'}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default NutritionProfile;
