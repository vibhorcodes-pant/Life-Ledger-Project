import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Sun, Moon, Bell, Download, Upload, RefreshCw, Globe, Heart, Monitor } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { useApi } from '../hooks/useApi';
import api from '../services/api';
import { useTheme } from '../context/ThemeContext';
import { clsx } from '../utils/helpers';
import Button from '../components/Button';
import Modal from '../components/Modal';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
};

const Toggle = ({ checked, onChange, icon: Icon }) => (
  <button
    type="button"
    onClick={onChange}
    className={clsx(
      "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
      checked ? "bg-indigo-500" : "bg-gray-200 dark:bg-gray-700"
    )}
  >
    <motion.span
      layout
      className={clsx(
        "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out flex items-center justify-center",
        checked ? "translate-x-5" : "translate-x-0"
      )}
    >
      {Icon && <Icon size={12} className={checked ? "text-indigo-500" : "text-gray-400"} />}
    </motion.span>
  </button>
);

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const { data: settingsData, loading, refetch } = useApi('/settings');
  
  const [settings, setSettings] = useState({
    theme: 'dark',
    currency: 'INR',
    weekStart: 'monday',
    notifications: true,
    reducedMotion: false
  });
  
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  useEffect(() => {
    if (settingsData) {
      setSettings({
        ...settingsData,
        notifications: !!settingsData.notifications,
        reducedMotion: !!settingsData.reducedMotion
      });
    }
  }, [settingsData]);

  const updateSetting = async (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    
    // Special handling for theme
    if (key === 'theme' && value !== theme) {
      toggleTheme();
    }
    
    try {
      await api.put('/settings', { [key]: value });
    } catch (err) {
      console.error('Failed to save setting', err);
    }
  };

  const handleExportData = async () => {
    try {
      // Simulate data export
      const data = { version: "1.0.0", exportDate: new Date().toISOString() };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `life-ledger-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export failed', err);
      alert('Failed to export data');
    }
  };

  const handleImportData = () => {
    alert('Import functionality coming soon!');
  };

  const handleResetConfirm = () => {
    alert('Reset functionality not fully implemented on server.');
    setIsResetModalOpen(false);
  };

  if (loading && !settingsData) return <LoadingSkeleton type="list" count={5} />;

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-6 max-w-4xl mx-auto">
      <PageHeader 
        title="Settings" 
        subtitle="Customize your Life Ledger experience." 
      />

      <div className="space-y-6">
        <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-gray-200/50 dark:border-white/10 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200/50 dark:border-white/10">
            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Monitor size={18} /> Appearance
            </h3>
          </div>
          <div className="divide-y divide-gray-200/50 dark:divide-white/10">
            <div className="px-6 py-4 flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900 dark:text-white">Theme</div>
                <div className="text-sm text-gray-500">Choose between light and dark mode</div>
              </div>
              <Toggle 
                checked={theme === 'dark'} 
                onChange={() => updateSetting('theme', theme === 'dark' ? 'light' : 'dark')} 
                icon={theme === 'dark' ? Moon : Sun} 
              />
            </div>
            <div className="px-6 py-4 flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900 dark:text-white">Reduced Motion</div>
                <div className="text-sm text-gray-500">Reduce animations for better performance</div>
              </div>
              <Toggle 
                checked={settings.reducedMotion} 
                onChange={() => updateSetting('reducedMotion', !settings.reducedMotion)} 
              />
            </div>
          </div>
        </div>

        <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-gray-200/50 dark:border-white/10 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200/50 dark:border-white/10">
            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <SettingsIcon size={18} /> Preferences
            </h3>
          </div>
          <div className="divide-y divide-gray-200/50 dark:divide-white/10">
            <div className="px-6 py-4 flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900 dark:text-white">Currency</div>
                <div className="text-sm text-gray-500">Used for finance tracking</div>
              </div>
              <select 
                value={settings.currency}
                onChange={(e) => updateSetting('currency', e.target.value)}
                className="px-3 py-1.5 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:text-white text-sm"
              >
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>
            <div className="px-6 py-4 flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900 dark:text-white">Week Start</div>
                <div className="text-sm text-gray-500">First day of the week in calendars</div>
              </div>
              <select 
                value={settings.weekStart}
                onChange={(e) => updateSetting('weekStart', e.target.value)}
                className="px-3 py-1.5 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:text-white text-sm"
              >
                <option value="monday">Monday</option>
                <option value="sunday">Sunday</option>
              </select>
            </div>
            <div className="px-6 py-4 flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900 dark:text-white">Notifications</div>
                <div className="text-sm text-gray-500">Receive reminders for goals and habits</div>
              </div>
              <Toggle 
                checked={settings.notifications} 
                onChange={() => updateSetting('notifications', !settings.notifications)} 
                icon={Bell}
              />
            </div>
          </div>
        </div>

        <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-gray-200/50 dark:border-white/10 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200/50 dark:border-white/10">
            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Globe size={18} /> Data Management
            </h3>
          </div>
          <div className="divide-y divide-gray-200/50 dark:divide-white/10">
            <div className="px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="font-medium text-gray-900 dark:text-white">Export Data</div>
                <div className="text-sm text-gray-500">Export all your data as JSON</div>
              </div>
              <Button variant="secondary" icon={Download} onClick={handleExportData}>Export</Button>
            </div>
            <div className="px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="font-medium text-gray-900 dark:text-white">Import Data</div>
                <div className="text-sm text-gray-500">Import data from a JSON file</div>
              </div>
              <Button variant="secondary" icon={Upload} onClick={handleImportData}>Import</Button>
            </div>
            <div className="px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="font-medium text-rose-600 dark:text-rose-500">Reset Account</div>
                <div className="text-sm text-gray-500">Permanently delete all your data</div>
              </div>
              <Button variant="danger" icon={RefreshCw} onClick={() => setIsResetModalOpen(true)}>Reset Data</Button>
            </div>
          </div>
        </div>

        <div className="text-center py-8">
          <div className="flex items-center justify-center gap-2 text-gray-500 dark:text-gray-400 mb-2">
            Built with <Heart size={16} className="text-rose-500 fill-rose-500" /> for students
          </div>
          <div className="text-sm text-gray-400 dark:text-gray-500">
            Life Ledger v1.0.0 • Open Source
          </div>
        </div>
      </div>

      <Modal isOpen={isResetModalOpen} onClose={() => setIsResetModalOpen(false)} title="Reset Data">
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            Are you sure you want to delete all your data? This includes all habits, study sessions, workouts, expenses, moods, and goals. 
          </p>
          <div className="p-4 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 rounded-xl text-rose-600 dark:text-rose-400 font-medium text-sm">
            Warning: This action cannot be undone.
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="ghost" onClick={() => setIsResetModalOpen(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleResetConfirm}>Yes, Reset All Data</Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}
