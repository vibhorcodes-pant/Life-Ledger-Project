import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Edit2, Download, Upload, RefreshCw, AlertTriangle, Calendar, Clock, Dumbbell, Flame, Target, Star } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import Modal from '../components/Modal';
import Button from '../components/Button';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { useApi } from '../hooks/useApi';
import api from '../services/api';
import { formatDate } from '../utils/helpers';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
};

export default function Profile() {
  const { data: profile, loading, refetch } = useApi('/profile');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', college: '', course: '', year: 1
  });

  const handleOpenModal = () => {
    if (profile) {
      setFormData({
        name: profile.name,
        email: profile.email,
        college: profile.college,
        course: profile.course,
        year: profile.year
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put('/profile', formData);
      setIsModalOpen(false);
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  const handleExport = () => {
    alert('Exporting data...');
  };

  const handleImport = () => {
    alert('Importing data...');
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all your data? This action cannot be undone.')) {
      alert('Data reset initiated.');
    }
  };

  if (loading) return <LoadingSkeleton type="card" count={4} />;

  const userInitials = profile?.name ? profile.name.charAt(0).toUpperCase() : 'U';

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">
      <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-gray-200/50 dark:border-white/10 rounded-2xl p-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl"></div>
        
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-5xl font-bold text-white shadow-xl shrink-0">
          {userInitials}
        </div>
        
        <div className="text-center md:text-left flex-1 space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{profile?.name || 'User Name'}</h1>
          <p className="text-gray-500 dark:text-gray-400">{profile?.email || 'user@example.com'}</p>
          <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-2">
            <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-full text-sm font-medium">
              {profile?.college || 'University'}
            </span>
            <span className="px-3 py-1 bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-full text-sm font-medium">
              {profile?.course || 'Course'}
            </span>
            <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full text-sm font-medium">
              Year {profile?.year || 1}
            </span>
          </div>
        </div>

        <Button onClick={handleOpenModal} icon={Edit2} variant="secondary">
          Edit Profile
        </Button>
      </div>

      <div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Account Stats</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-gray-200/50 dark:border-white/10 rounded-2xl p-4 flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl"><Calendar size={24} /></div>
            <div>
              <div className="text-sm text-gray-500">Member Since</div>
              <div className="font-bold text-gray-900 dark:text-white">{profile?.created_at ? formatDate(profile.created_at) : 'Today'}</div>
            </div>
          </div>
          <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-gray-200/50 dark:border-white/10 rounded-2xl p-4 flex items-center gap-4">
            <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-xl"><Clock size={24} /></div>
            <div>
              <div className="text-sm text-gray-500">Study Hours</div>
              <div className="font-bold text-gray-900 dark:text-white">124 hrs</div>
            </div>
          </div>
          <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-gray-200/50 dark:border-white/10 rounded-2xl p-4 flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl"><Dumbbell size={24} /></div>
            <div>
              <div className="text-sm text-gray-500">Workouts</div>
              <div className="font-bold text-gray-900 dark:text-white">48</div>
            </div>
          </div>
          <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-gray-200/50 dark:border-white/10 rounded-2xl p-4 flex items-center gap-4">
            <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl"><Flame size={24} /></div>
            <div>
              <div className="text-sm text-gray-500">Best Streak</div>
              <div className="font-bold text-gray-900 dark:text-white">14 Days</div>
            </div>
          </div>
          <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-gray-200/50 dark:border-white/10 rounded-2xl p-4 flex items-center gap-4">
            <div className="p-3 bg-purple-500/10 text-purple-500 rounded-xl"><Target size={24} /></div>
            <div>
              <div className="text-sm text-gray-500">Goals Met</div>
              <div className="font-bold text-gray-900 dark:text-white">12</div>
            </div>
          </div>
          <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-gray-200/50 dark:border-white/10 rounded-2xl p-4 flex items-center gap-4">
            <div className="p-3 bg-pink-500/10 text-pink-500 rounded-xl"><Star size={24} /></div>
            <div>
              <div className="text-sm text-gray-500">Life Entries</div>
              <div className="font-bold text-gray-900 dark:text-white">342</div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Data & Privacy</h3>
        <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-gray-200/50 dark:border-white/10 rounded-2xl overflow-hidden divide-y divide-gray-200/50 dark:divide-white/10">
          <div className="p-4 flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900 dark:text-white">Export Data</div>
              <div className="text-sm text-gray-500">Download all your data as JSON</div>
            </div>
            <Button variant="secondary" icon={Download} onClick={handleExport}>Export</Button>
          </div>
          <div className="p-4 flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900 dark:text-white">Import Data</div>
              <div className="text-sm text-gray-500">Restore your data from a JSON file</div>
            </div>
            <Button variant="secondary" icon={Upload} onClick={handleImport}>Import</Button>
          </div>
          <div className="p-4 flex items-center justify-between">
            <div>
              <div className="font-medium text-rose-600 dark:text-rose-500">Reset Account</div>
              <div className="text-sm text-gray-500">Permanently delete all your data</div>
            </div>
            <Button variant="danger" icon={AlertTriangle} onClick={handleReset}>Reset Data</Button>
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Edit Profile">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
            <input 
              type="text" 
              required 
              value={formData.name} 
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-4 py-2 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
            <input 
              type="email" 
              value={formData.email} 
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-4 py-2 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">College/University</label>
            <input 
              type="text" 
              value={formData.college} 
              onChange={(e) => setFormData({...formData, college: e.target.value})}
              className="w-full px-4 py-2 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:text-white"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Course</label>
              <input 
                type="text" 
                value={formData.course} 
                onChange={(e) => setFormData({...formData, course: e.target.value})}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Year</label>
              <select 
                value={formData.year} 
                onChange={(e) => setFormData({...formData, year: parseInt(e.target.value)})}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:text-white"
              >
                {[1,2,3,4,5].map(y => (
                  <option key={y} value={y}>Year {y}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
}
