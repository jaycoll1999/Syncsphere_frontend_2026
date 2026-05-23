import React from 'react';
import { useAuthStore } from '../store/authStore';
import { motion } from 'framer-motion';
import { 
  User, Mail, Phone, Shield, Calendar, 
  Clock, CheckCircle, Activity, Award, Briefcase, 
  MapPin, Globe, CreditCard
} from 'lucide-react';

const DashboardPage = () => {
  const { user } = useAuthStore();

  // Mock History Data since backend is disconnected
  const pastHistory = [
    { id: 1, action: "Logged in securely (Windows/Chrome)", date: "Today, 10:30 AM", status: "success", icon: Clock },
    { id: 2, action: "Updated profile preferences", date: "Yesterday, 2:15 PM", status: "info", icon: User },
    { id: 3, action: "Completed Q2 security training", date: "May 15, 2026", status: "success", icon: CheckCircle },
    { id: 4, action: "Password changed successfully", date: "May 10, 2026", status: "warning", icon: Shield },
    { id: 5, action: "Account created & verified", date: "May 1, 2026", status: "success", icon: Award }
  ];

  const stats = [
    { label: 'Total Hours', value: '1,240', icon: Clock, color: 'text-blue-500', bg: 'bg-blue-500/10 border-blue-500/20' },
    { label: 'Tasks Done', value: '42', icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-500/10 border-emerald-500/20' },
    { label: 'Projects', value: '7', icon: Briefcase, color: 'text-purple-500', bg: 'bg-purple-500/10 border-purple-500/20' },
    { label: 'Activity Score', value: '98%', icon: Activity, color: 'text-indigo-500', bg: 'bg-indigo-500/10 border-indigo-500/20' }
  ];

  // Use mock details if some are missing
  const userDetails = {
    firstName: user?.first_name || 'Guest',
    lastName: user?.last_name || 'User',
    email: user?.email || 'guest@example.com',
    phone: user?.phone || '+1 (555) 019-2839',
    role: user?.role || 'USER',
    location: 'San Francisco, CA',
    department: 'Engineering',
    joinDate: 'May 1, 2026'
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0B0F19] text-gray-900 dark:text-white p-6 lg:p-10 font-sans">
      <motion.div 
        className="max-w-7xl mx-auto space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent drop-shadow-sm">
              Welcome back, {userDetails.firstName}!
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Here is a complete overview of your account and recent activities.</p>
          </div>
          <div className="flex items-center gap-3 bg-white dark:bg-white/5 px-4 py-2 rounded-full border border-gray-200 dark:border-white/10 shadow-sm">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">System Online</span>
          </div>
        </motion.div>

        {/* Stats Row */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className={`relative overflow-hidden rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 p-6 shadow-xl shadow-gray-200/20 dark:shadow-none hover:shadow-2xl transition-all duration-300 group`}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
                    <h3 className="text-3xl font-bold mt-2 text-gray-800 dark:text-white">{stat.value}</h3>
                  </div>
                  <div className={`p-3 rounded-xl border ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              </div>
            );
          })}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Details Card (Left Column) */}
          <motion.div variants={itemVariants} className="lg:col-span-1">
            <div className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-3xl p-8 shadow-xl shadow-gray-200/20 dark:shadow-none relative overflow-hidden h-full">
              {/* Background Decoration */}
              <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex flex-col items-center text-center relative z-10 mb-8">
                <div className="w-28 h-28 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full p-1 mb-4 shadow-lg shadow-indigo-500/30">
                  <div className="w-full h-full bg-white dark:bg-[#111827] rounded-full flex items-center justify-center border-4 border-white dark:border-[#111827]">
                    <User className="w-12 h-12 text-indigo-500" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{userDetails.firstName} {userDetails.lastName}</h2>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 mt-2 rounded-full bg-indigo-50 dark:bg-indigo-500/20 border border-indigo-100 dark:border-indigo-500/30">
                  <Shield className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-300 tracking-wider uppercase">{userDetails.role}</span>
                </div>
              </div>

              <div className="space-y-6 relative z-10">
                <div className="flex items-center gap-4 text-gray-600 dark:text-gray-300">
                  <div className="w-10 h-10 rounded-lg bg-gray-50 dark:bg-white/5 flex items-center justify-center shrink-0 border border-gray-100 dark:border-white/5">
                    <Mail className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">Email Address</p>
                    <p className="text-sm font-medium truncate">{userDetails.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-gray-600 dark:text-gray-300">
                  <div className="w-10 h-10 rounded-lg bg-gray-50 dark:bg-white/5 flex items-center justify-center shrink-0 border border-gray-100 dark:border-white/5">
                    <Phone className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">Phone Number</p>
                    <p className="text-sm font-medium">{userDetails.phone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-gray-600 dark:text-gray-300">
                  <div className="w-10 h-10 rounded-lg bg-gray-50 dark:bg-white/5 flex items-center justify-center shrink-0 border border-gray-100 dark:border-white/5">
                    <Briefcase className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">Department</p>
                    <p className="text-sm font-medium">{userDetails.department}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-gray-600 dark:text-gray-300">
                  <div className="w-10 h-10 rounded-lg bg-gray-50 dark:bg-white/5 flex items-center justify-center shrink-0 border border-gray-100 dark:border-white/5">
                    <MapPin className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">Location</p>
                    <p className="text-sm font-medium">{userDetails.location}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Past History Timeline (Right Column) */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <div className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-3xl p-8 shadow-xl shadow-gray-200/20 dark:shadow-none h-full">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Activity className="w-6 h-6 text-indigo-500" />
                    Activity History
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">A detailed log of your recent interactions.</p>
                </div>
                <button className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors bg-indigo-50 dark:bg-indigo-500/10 px-4 py-2 rounded-lg">
                  View All
                </button>
              </div>
              
              <div className="relative pl-6 border-l-2 border-indigo-100 dark:border-white/10 space-y-10 mt-6">
                {pastHistory.map((item, index) => {
                  const HistoryIcon = item.icon;
                  const isSuccess = item.status === 'success';
                  const isWarning = item.status === 'warning';
                  
                  return (
                    <motion.div 
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="relative"
                    >
                      {/* Timeline Dot */}
                      <span className="absolute -left-[35px] top-1 flex h-4 w-4 items-center justify-center rounded-full bg-white dark:bg-[#0B0F19] ring-8 ring-white dark:ring-[#0B0F19]">
                        <span className={`h-3 w-3 rounded-full ${
                          isSuccess ? 'bg-emerald-500' : isWarning ? 'bg-amber-500' : 'bg-indigo-500'
                        }`} />
                      </span>

                      <div className="bg-gray-50/50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-2xl p-5 hover:bg-gray-50 dark:hover:bg-white/10 transition-colors group">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-4">
                            <div className={`p-2.5 rounded-xl ${
                              isSuccess ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400' :
                              isWarning ? 'bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400' :
                              'bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400'
                            }`}>
                              <HistoryIcon className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="text-base font-semibold text-gray-800 dark:text-gray-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                {item.action}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1.5 mt-0.5">
                                <Calendar className="w-3.5 h-3.5" />
                                {item.date}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardPage;
