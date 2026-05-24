import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { 
  Shield, Key, Smartphone, Laptop, Globe,
  CheckCircle, User as UserIcon, Mail, ShieldAlert,
  SmartphoneNfc
} from 'lucide-react';
import { toast } from 'react-toastify';

const SecuritySettingsPage = () => {
  const { user } = useAuthStore();
  
  // Fallback in case user refreshed
  const currentUser = user || {
    first_name: 'Alex',
    last_name: 'Morgan',
    email: 'alex.morgan@syncsphere.com',
    role: 'ADMIN'
  };

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [is2FAEnabled, setIs2FAEnabled] = useState(true);

  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match!');
      return;
    }
    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long.');
      return;
    }
    toast.success('Password updated successfully!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const activeSessions = [
    { id: 1, device: 'MacBook Pro 16"', browser: 'Chrome on macOS', location: 'San Francisco, CA', current: true, time: 'Active now', icon: <Laptop className="w-5 h-5 text-indigo-500" /> },
    { id: 2, device: 'iPhone 14 Pro', browser: 'Safari on iOS', location: 'San Francisco, CA', current: false, time: '2 hours ago', icon: <Smartphone className="w-5 h-5 text-gray-500" /> },
    { id: 3, device: 'Windows PC', browser: 'Firefox on Windows', location: 'New York, NY', current: false, time: 'Yesterday', icon: <Globe className="w-5 h-5 text-gray-500" /> },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0B0F19] text-gray-900 dark:text-white p-6 lg:p-10 font-sans">
      <motion.div 
        className="max-w-5xl mx-auto space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header Section */}
        <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent drop-shadow-sm flex items-center gap-3">
              <Shield className="w-8 h-8 text-indigo-500" />
              Security & Profile
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-2xl">
              Manage your account credentials, view active sessions, and configure two-factor authentication to keep your account secure.
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Profile & 2FA */}
          <div className="lg:col-span-1 space-y-8">
            
            {/* User Profile Card */}
            <motion.div variants={itemVariants} className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-3xl p-6 shadow-xl shadow-gray-200/20 dark:shadow-none relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-20 dark:opacity-40"></div>
              
              <div className="relative pt-6 flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-white dark:bg-[#0B0F19] flex items-center justify-center border-4 border-white dark:border-[#0B0F19] shadow-lg mb-4">
                  <span className="text-3xl font-bold bg-gradient-to-br from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    {currentUser.first_name?.[0]}{currentUser.last_name?.[0]}
                  </span>
                </div>
                
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {currentUser.first_name} {currentUser.last_name}
                </h2>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 mt-2 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  {currentUser.role}
                </div>

                <div className="w-full mt-6 space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-white/5 rounded-xl text-sm">
                    <UserIcon className="w-5 h-5 text-gray-400 shrink-0" />
                    <span className="text-gray-600 dark:text-gray-300 font-medium truncate">
                      {currentUser.first_name} {currentUser.last_name}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-white/5 rounded-xl text-sm">
                    <Mail className="w-5 h-5 text-gray-400 shrink-0" />
                    <span className="text-gray-600 dark:text-gray-300 font-medium truncate">
                      {currentUser.email}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* 2FA Card */}
            <motion.div variants={itemVariants} className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-3xl p-6 shadow-xl shadow-gray-200/20 dark:shadow-none">
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-xl ${is2FAEnabled ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400' : 'bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-gray-400'}`}>
                  <SmartphoneNfc className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Two-Factor Auth</h3>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Extra Security</p>
                </div>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                Add an extra layer of security to your account by requiring a verification code upon login.
              </p>

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#0B0F19] rounded-xl border border-gray-100 dark:border-white/5">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${is2FAEnabled ? 'bg-emerald-500' : 'bg-gray-400'}`}></div>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    {is2FAEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                <button 
                  onClick={() => {
                    setIs2FAEnabled(!is2FAEnabled);
                    toast.success(is2FAEnabled ? '2FA Disabled.' : '2FA Enabled successfully!');
                  }}
                  className={`px-4 py-1.5 text-sm font-semibold rounded-lg transition-colors ${
                    is2FAEnabled 
                      ? 'bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-500/10 dark:hover:bg-red-500/20 dark:text-red-400' 
                      : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20 dark:text-emerald-400'
                  }`}
                >
                  {is2FAEnabled ? 'Disable' : 'Enable'}
                </button>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Password & Sessions */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Change Password */}
            <motion.div variants={itemVariants} className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-3xl p-6 lg:p-8 shadow-xl shadow-gray-200/20 dark:shadow-none">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
                  <Key className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Change Password</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Update your credentials to keep your account secure.</p>
                </div>
              </div>

              <form onSubmit={handlePasswordUpdate} className="space-y-5 max-w-lg">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Current Password</label>
                  <input 
                    type="password" 
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-[#0B0F19] border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                    placeholder="Enter current password"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">New Password</label>
                    <input 
                      type="password" 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-[#0B0F19] border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                      placeholder="At least 8 characters"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Confirm Password</label>
                    <input 
                      type="password" 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-[#0B0F19] border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                      placeholder="Repeat new password"
                    />
                  </div>
                </div>
                <div className="pt-2">
                  <button 
                    type="submit"
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md transition-colors"
                  >
                    Update Password
                  </button>
                </div>
              </form>
            </motion.div>

            {/* Active Sessions */}
            <motion.div variants={itemVariants} className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-3xl p-6 lg:p-8 shadow-xl shadow-gray-200/20 dark:shadow-none">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Active Sessions</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Devices currently logged into your account.</p>
                </div>
                <button className="text-sm font-semibold text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors">
                  Sign out all devices
                </button>
              </div>

              <div className="space-y-4">
                {activeSessions.map((session) => (
                  <div key={session.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 dark:bg-[#0B0F19] rounded-2xl border border-gray-100 dark:border-white/5 gap-4">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white dark:bg-white/5 rounded-xl shadow-sm border border-gray-100 dark:border-white/5">
                        {session.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-gray-900 dark:text-white">{session.device}</p>
                          {session.current && (
                            <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-500/20 px-2 py-0.5 rounded-full">
                              <CheckCircle className="w-3 h-3" /> This Device
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                          {session.browser} • {session.location}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between sm:flex-col sm:items-end sm:justify-center">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{session.time}</p>
                      {!session.current && (
                        <button className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline mt-1">
                          Revoke
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SecuritySettingsPage;
