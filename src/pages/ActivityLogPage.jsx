import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, Shield, LogIn, Edit3, CalendarPlus, 
  Settings, CheckCircle, SmartphoneNfc
} from 'lucide-react';
import Timeline from '../components/shared/Timeline';

const ActivityLogPage = () => {
  const [activeTab, setActiveTab] = useState('All');

  // Mock Activity Data
  const activityData = [
    { 
      id: 1, 
      type: 'Security',
      label: 'Two-Factor Authentication Enabled', 
      subtext: 'You successfully enabled 2FA via Authenticator App.', 
      timestamp: 'Today, 10:23 AM',
      icon: SmartphoneNfc,
      color: 'bg-emerald-500'
    },
    { 
      id: 2, 
      type: 'System',
      label: 'Profile Settings Updated', 
      subtext: 'Changed notification preferences for push and email alerts.', 
      timestamp: 'Today, 09:15 AM',
      icon: Settings,
      color: 'bg-gray-500'
    },
    { 
      id: 3, 
      type: 'Action',
      label: 'Created New Event', 
      subtext: 'Added "Team Sync" to the master calendar.', 
      timestamp: 'Yesterday, 04:30 PM',
      icon: CalendarPlus,
      color: 'bg-indigo-500'
    },
    { 
      id: 4, 
      type: 'Login',
      label: 'New Login Detected', 
      subtext: 'Logged in from MacBook Pro (San Francisco, CA).', 
      timestamp: 'Yesterday, 08:00 AM',
      icon: LogIn,
      color: 'bg-blue-500'
    },
    { 
      id: 5, 
      type: 'Action',
      label: 'Updated Task Status', 
      subtext: 'Moved "Q3 Marketing Deck" to Completed.', 
      timestamp: '2 days ago',
      icon: CheckCircle,
      color: 'bg-purple-500'
    },
    { 
      id: 6, 
      type: 'Security',
      label: 'Password Changed', 
      subtext: 'Successfully updated account password.', 
      timestamp: 'Last Week',
      icon: Shield,
      color: 'bg-amber-500'
    },
  ];

  const filteredData = activeTab === 'All' 
    ? activityData 
    : activityData.filter(item => item.type === activeTab);

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
        className="max-w-4xl mx-auto space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header Section */}
        <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent drop-shadow-sm flex items-center gap-3">
              <Activity className="w-8 h-8 text-indigo-500" />
              My Activity Log
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-2xl">
              A comprehensive timeline of your account interactions, security events, and system activities.
            </p>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div variants={itemVariants} className="flex items-center gap-2 bg-white dark:bg-white/5 p-2 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm overflow-x-auto no-scrollbar">
          {['All', 'Security', 'Login', 'Action', 'System'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 whitespace-nowrap ${
                activeTab === tab 
                  ? 'bg-gray-100 dark:bg-[#111827] text-indigo-600 dark:text-indigo-400 shadow-sm border border-gray-200 dark:border-white/5' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 border border-transparent'
              }`}
            >
              {tab}
            </button>
          ))}
        </motion.div>

        {/* Timeline Container */}
        <motion.div variants={itemVariants} className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-3xl p-8 shadow-xl shadow-gray-200/20 dark:shadow-none min-h-[400px]">
          {filteredData.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <Activity className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-4" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">No activity found</h3>
              <p className="text-gray-500 dark:text-gray-400 mt-2">
                There are no recorded activities matching this filter.
              </p>
            </div>
          ) : (
            <div className="pl-2 pr-6">
              <Timeline items={filteredData} />
            </div>
          )}
        </motion.div>

      </motion.div>

      <style jsx="true">{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default ActivityLogPage;
