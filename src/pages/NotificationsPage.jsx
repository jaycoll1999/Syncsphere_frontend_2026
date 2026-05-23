import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotificationStore } from '../store/notificationStore';
import { 
  Bell, Calendar as CalendarIcon, MessageSquare, AlertCircle, 
  Check, Trash2, Clock, CheckCircle2
} from 'lucide-react';
import { toast } from 'react-toastify';

const NotificationsPage = () => {
  const { notifications, markRead, markAllRead, addNotification } = useNotificationStore();

  // Populate mock notifications if empty for demonstration purposes
  useEffect(() => {
    if (notifications.length === 0) {
      const mockNotifs = [
        { id: 1, type: 'event_reminder', title: 'Upcoming Event: Team Sync', message: 'This event starts in exactly 5 minutes.', time: 'Just now', read: false, color: 'bg-orange-500' },
        { id: 2, type: 'system', title: 'System Update', message: 'SyncSphere Version 2.0 has been deployed successfully.', time: '2 hours ago', read: false, color: 'bg-emerald-500' },
        { id: 3, type: 'message', title: 'New Message from Sarah', message: 'Can you send over the updated files for the meeting?', time: 'Yesterday', read: true, color: 'bg-blue-500' },
        { id: 4, type: 'event_added', title: 'New Event Added', message: 'Alex Morgan added "Q3 Roadmapping" to the calendar.', time: '2 days ago', read: true, color: 'bg-indigo-500' },
      ];
      
      // Add in reverse to maintain chronological order in the store (since addNotification pushes to the top)
      mockNotifs.reverse().forEach(n => addNotification(n));
    }
  }, []);

  const simulateEventReminder = () => {
    const reminder = {
      id: Date.now(),
      type: 'event_reminder',
      title: 'Upcoming Event: Client Pitch',
      message: 'Reminder: This event starts in exactly 5 minutes.',
      time: 'Just now',
      read: false,
      color: 'bg-orange-500'
    };
    addNotification(reminder);
    toast.info('Reminder: Client Pitch starts in 5 minutes!');
  };

  const getIcon = (type, colorClass) => {
     switch(type) {
       case 'event_reminder': return <Clock className={`w-5 h-5 text-white`} />;
       case 'event_added': return <CalendarIcon className={`w-5 h-5 text-white`} />;
       case 'system': return <AlertCircle className={`w-5 h-5 text-white`} />;
       case 'message': return <MessageSquare className={`w-5 h-5 text-white`} />;
       default: return <Bell className={`w-5 h-5 text-white`} />;
     }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } }
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
              <Bell className="w-8 h-8 text-indigo-500" />
              Notifications
              {unreadCount > 0 && (
                <span className="inline-flex items-center justify-center w-6 h-6 ml-2 text-sm font-bold text-white bg-red-500 rounded-full">
                  {unreadCount}
                </span>
              )}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-2xl">
              Stay updated with system alerts, messages, and important event reminders.
            </p>
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={simulateEventReminder}
              className="px-4 py-2 bg-orange-100 text-orange-700 hover:bg-orange-200 dark:bg-orange-500/10 dark:text-orange-400 dark:hover:bg-orange-500/20 border border-orange-200 dark:border-orange-500/20 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 shadow-sm"
            >
              <Clock className="w-4 h-4" />
              Test 5-Min Reminder
            </button>
            <button 
              onClick={markAllRead}
              disabled={unreadCount === 0}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 shadow-sm ${
                unreadCount > 0 
                  ? 'bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/10' 
                  : 'bg-gray-100 dark:bg-[#111827] text-gray-400 dark:text-gray-600 cursor-not-allowed border border-transparent'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              Mark All Read
            </button>
          </div>
        </motion.div>

        {/* Notifications List */}
        <motion.div variants={itemVariants} className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-3xl shadow-xl shadow-gray-200/20 dark:shadow-none overflow-hidden">
          {notifications.length === 0 ? (
            <div className="p-12 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-gray-50 dark:bg-[#0B0F19] rounded-full flex items-center justify-center mb-4">
                <Bell className="w-10 h-10 text-gray-300 dark:text-gray-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">You're all caught up!</h3>
              <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-sm">
                There are no new notifications at this time. Check back later for updates and reminders.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-white/5">
              <AnimatePresence>
                {notifications.map((notif) => (
                  <motion.div
                    key={notif.id}
                    layout
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                    className={`p-5 flex gap-4 transition-colors relative group ${notif.read ? 'bg-transparent' : 'bg-indigo-50/50 dark:bg-indigo-500/[0.03]'}`}
                  >
                    {!notif.read && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 rounded-r-full"></div>
                    )}
                    
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${notif.color || 'bg-gray-500'}`}>
                      {getIcon(notif.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0 pt-1">
                      <div className="flex justify-between items-start gap-4 mb-1">
                        <h4 className={`text-base font-bold truncate ${notif.read ? 'text-gray-700 dark:text-gray-300' : 'text-gray-900 dark:text-white'}`}>
                          {notif.title}
                        </h4>
                        <span className="text-xs font-medium text-gray-400 dark:text-gray-500 whitespace-nowrap">
                          {notif.time}
                        </span>
                      </div>
                      <p className={`text-sm ${notif.read ? 'text-gray-500 dark:text-gray-400' : 'text-gray-600 dark:text-gray-300 font-medium'}`}>
                        {notif.message}
                      </p>
                    </div>

                    <div className="flex flex-col items-end justify-center gap-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      {!notif.read && (
                        <button 
                          onClick={() => markRead(notif.id)}
                          className="p-2 bg-white dark:bg-[#0B0F19] text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 border border-gray-200 dark:border-white/10 rounded-xl shadow-sm transition-colors"
                          title="Mark as Read"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotificationsPage;
