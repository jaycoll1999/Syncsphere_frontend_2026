import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BellRing, Mail, Smartphone, Calendar as CalendarIcon, 
  MessageSquare, ShieldAlert, CheckCircle
} from 'lucide-react';
import ToggleSwitch from '../components/shared/ToggleSwitch';
import { toast } from 'react-toastify';

const NotificationSettingsPage = () => {
  // Global Notification Toggles
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);

  // Event & Calendar Notifications
  const [eventReminders, setEventReminders] = useState(true);
  const [newEvents, setNewEvents] = useState(true);
  const [holidayAlerts, setHolidayAlerts] = useState(false);

  // Messages & Communication
  const [directMessages, setDirectMessages] = useState(true);
  const [mentions, setMentions] = useState(true);
  
  // System & Security
  const [systemUpdates, setSystemUpdates] = useState(true);
  const [securityAlerts, setSecurityAlerts] = useState(true);

  const handleSavePreferences = () => {
    // In a real app, this would be an API call to save preferences to the database.
    toast.success('Notification preferences saved successfully!');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0B0F19] text-gray-900 dark:text-white p-6 lg:p-10 font-sans pb-24">
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
              <BellRing className="w-8 h-8 text-indigo-500" />
              Notification Preferences
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-2xl">
              Control how and when you want to be notified. Customize your alert channels and choose which events trigger a notification.
            </p>
          </div>
          <button 
            onClick={handleSavePreferences}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md transition-colors flex items-center gap-2"
          >
            <CheckCircle className="w-5 h-5" />
            Save Changes
          </button>
        </motion.div>

        {/* Global Channels Card */}
        <motion.div variants={itemVariants} className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-3xl p-6 shadow-xl shadow-gray-200/20 dark:shadow-none">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Delivery Channels</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 bg-gray-50 dark:bg-[#0B0F19] rounded-2xl border border-gray-100 dark:border-white/5 flex flex-col justify-between">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-indigo-100 dark:bg-indigo-500/20 rounded-xl text-indigo-600 dark:text-indigo-400">
                  <Smartphone className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">Push Notifications</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Receive alerts directly on your device screen.</p>
                </div>
              </div>
              <ToggleSwitch 
                checked={pushEnabled} 
                onChange={setPushEnabled} 
                label={pushEnabled ? "Enabled" : "Disabled"}
              />
            </div>

            <div className="p-5 bg-gray-50 dark:bg-[#0B0F19] rounded-2xl border border-gray-100 dark:border-white/5 flex flex-col justify-between">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-emerald-100 dark:bg-emerald-500/20 rounded-xl text-emerald-600 dark:text-emerald-400">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">Email Notifications</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Get important updates delivered to your inbox.</p>
                </div>
              </div>
              <ToggleSwitch 
                checked={emailEnabled} 
                onChange={setEmailEnabled} 
                label={emailEnabled ? "Enabled" : "Disabled"}
              />
            </div>
          </div>
        </motion.div>

        {/* Detailed Preferences Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Calendar & Events */}
          <motion.div variants={itemVariants} className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-3xl p-6 shadow-xl shadow-gray-200/20 dark:shadow-none h-fit">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400">
                <CalendarIcon className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Calendar & Events</h3>
            </div>
            <div className="space-y-1 divide-y divide-gray-100 dark:divide-white/10">
              <ToggleSwitch 
                checked={eventReminders} 
                onChange={setEventReminders} 
                label="Event Reminders" 
                description="Get notified 5 minutes before an event starts."
              />
              <ToggleSwitch 
                checked={newEvents} 
                onChange={setNewEvents} 
                label="New Events" 
                description="When someone adds you to a new calendar event."
              />
              <ToggleSwitch 
                checked={holidayAlerts} 
                onChange={setHolidayAlerts} 
                label="Holiday Alerts" 
                description="Reminders about upcoming national holidays."
              />
            </div>
          </motion.div>

          {/* Messages & Chat */}
          <motion.div variants={itemVariants} className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-3xl p-6 shadow-xl shadow-gray-200/20 dark:shadow-none h-fit">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Communications</h3>
            </div>
            <div className="space-y-1 divide-y divide-gray-100 dark:divide-white/10">
              <ToggleSwitch 
                checked={directMessages} 
                onChange={setDirectMessages} 
                label="Direct Messages" 
                description="When a team member sends you a direct message."
              />
              <ToggleSwitch 
                checked={mentions} 
                onChange={setMentions} 
                label="Mentions (@yourname)" 
                description="When someone tags you in a public channel or task."
              />
            </div>
          </motion.div>

          {/* System & Security */}
          <motion.div variants={itemVariants} className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-3xl p-6 shadow-xl shadow-gray-200/20 dark:shadow-none md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">System & Security</h3>
            </div>
            <div className="space-y-1 divide-y divide-gray-100 dark:divide-white/10">
              <ToggleSwitch 
                checked={systemUpdates} 
                onChange={setSystemUpdates} 
                label="System Updates" 
                description="Notifications regarding maintenance windows, new features, and version updates."
              />
              <ToggleSwitch 
                checked={securityAlerts} 
                onChange={setSecurityAlerts} 
                label="Security Alerts (Required)" 
                description="Critical alerts regarding new device logins, password changes, and 2FA activities."
              />
            </div>
          </motion.div>

        </div>
      </motion.div>
    </div>
  );
};

export default NotificationSettingsPage;
