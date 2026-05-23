import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, Activity, TrendingUp, Clock, 
  Search, Filter, ChevronDown, CheckCircle, 
  XCircle, Shield, MoreHorizontal, UserCheck, Calendar
} from 'lucide-react';

const AnalyticsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock Global Stats
  const stats = [
    { label: 'Total Users', value: '1,248', change: '+12%', isPositive: true, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Active Sessions', value: '432', change: '+5%', isPositive: true, icon: Activity, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Avg Session Time', value: '24m', change: '-2%', isPositive: false, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { label: 'Engagement Rate', value: '89%', change: '+4%', isPositive: true, icon: TrendingUp, color: 'text-indigo-500', bg: 'bg-indigo-500/10' }
  ];

  // Mock All Users Details
  const allUsers = [
    { id: 'USR-001', name: 'Alex Morgan', email: 'alex.m@example.com', role: 'ADMIN', status: 'Active', lastActive: '2 mins ago', joinDate: 'Jan 15, 2026' },
    { id: 'USR-002', name: 'Sarah Chen', email: 'sarah.c@example.com', role: 'EMPLOYEE', status: 'Active', lastActive: '1 hour ago', joinDate: 'Feb 03, 2026' },
    { id: 'USR-003', name: 'Michael Ross', email: 'mike.r@example.com', role: 'USER', status: 'Inactive', lastActive: '2 days ago', joinDate: 'Mar 12, 2026' },
    { id: 'USR-004', name: 'Jessica Alba', email: 'jess.a@example.com', role: 'EMPLOYEE', status: 'Active', lastActive: '5 mins ago', joinDate: 'Apr 22, 2026' },
    { id: 'USR-005', name: 'David Kim', email: 'david.k@example.com', role: 'USER', status: 'Suspended', lastActive: '1 week ago', joinDate: 'May 01, 2026' },
  ];

  // Mock Global Past History
  const globalHistory = [
    { id: 1, user: 'Alex Morgan', action: 'Modified system settings', time: '10:45 AM', type: 'system' },
    { id: 2, user: 'Sarah Chen', action: 'Exported quarterly report', time: '09:12 AM', type: 'document' },
    { id: 3, user: 'Jessica Alba', action: 'Created new project timeline', time: 'Yesterday, 4:30 PM', type: 'project' },
    { id: 4, user: 'System', action: 'Automated backup completed', time: 'Yesterday, 2:00 AM', type: 'system' },
  ];

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
        {/* Header Section */}
        <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent drop-shadow-sm">
              User Analytics & History
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-2xl">
              Comprehensive overview of all user details, system engagement, and historical activity logs.
            </p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors shadow-lg shadow-indigo-500/30">
            <Calendar className="w-4 h-4" />
            Last 30 Days
            <ChevronDown className="w-4 h-4 ml-1" />
          </button>
        </motion.div>

        {/* Global Stats Grid */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl p-6 shadow-xl shadow-gray-200/20 dark:shadow-none relative overflow-hidden group">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-xl border border-white/5 ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className={`flex items-center gap-1 text-sm font-semibold ${stat.isPositive ? 'text-emerald-500' : 'text-amber-500'}`}>
                    {stat.change}
                    <TrendingUp className={`w-4 h-4 ${!stat.isPositive && 'rotate-180'}`} />
                  </div>
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</h3>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
                </div>
              </div>
            );
          })}
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Main User Details Table (Takes 2 columns on XL screens) */}
          <motion.div variants={itemVariants} className="xl:col-span-2">
            <div className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-3xl p-6 shadow-xl shadow-gray-200/20 dark:shadow-none h-full flex flex-col">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Users className="w-6 h-6 text-indigo-500" />
                    All User Details
                  </h3>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="Search users..." 
                      className="pl-9 pr-4 py-2 bg-gray-50 dark:bg-[#0B0F19] border border-gray-200 dark:border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white w-full sm:w-64 transition-shadow"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <button className="p-2 border border-gray-200 dark:border-white/10 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                    <Filter className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto flex-1">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-white/10 text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      <th className="pb-4 pl-4 font-semibold">User</th>
                      <th className="pb-4 font-semibold">Role</th>
                      <th className="pb-4 font-semibold">Status</th>
                      <th className="pb-4 font-semibold">Last Active</th>
                      <th className="pb-4 font-semibold text-right pr-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                    {allUsers.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase())).map((user, i) => (
                      <tr key={i} className="hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors group">
                        <td className="py-4 pl-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                              {user.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 dark:text-white text-sm group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{user.name}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4">
                          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/5">
                            {user.role === 'ADMIN' && <Shield className="w-3 h-3 text-indigo-500" />}
                            {user.role !== 'ADMIN' && <UserCheck className="w-3 h-3 text-gray-500" />}
                            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{user.role}</span>
                          </div>
                        </td>
                        <td className="py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border
                            ${user.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20' : 
                              user.status === 'Suspended' ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20' : 
                              'bg-gray-50 text-gray-700 border-gray-200 dark:bg-white/5 dark:text-gray-400 dark:border-white/10'}`}>
                            {user.status === 'Active' && <CheckCircle className="w-3 h-3" />}
                            {user.status === 'Suspended' && <XCircle className="w-3 h-3" />}
                            {user.status}
                          </span>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                            <Clock className="w-3.5 h-3.5" />
                            {user.lastActive}
                          </div>
                        </td>
                        <td className="py-4 pr-4 text-right">
                          <button className="p-2 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-lg transition-colors">
                            <MoreHorizontal className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>

          {/* Global Past History Timeline (Right Column) */}
          <motion.div variants={itemVariants} className="xl:col-span-1">
            <div className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-3xl p-6 shadow-xl shadow-gray-200/20 dark:shadow-none h-full flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Activity className="w-6 h-6 text-purple-500" />
                  Past History feed
                </h3>
              </div>
              
              <div className="relative pl-5 border-l-2 border-gray-100 dark:border-white/10 space-y-8 mt-2 flex-1">
                {globalHistory.map((item, index) => (
                  <motion.div 
                    key={item.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="relative"
                  >
                    {/* Timeline Dot */}
                    <span className="absolute -left-[27px] top-1 flex h-3 w-3 items-center justify-center rounded-full bg-indigo-500 ring-4 ring-white dark:ring-[#0B0F19]" />

                    <div className="bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-2xl p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm font-bold text-gray-900 dark:text-white">{item.user}</span>
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-[#0B0F19] px-2 py-0.5 rounded-md border border-gray-100 dark:border-white/5">
                          {item.time}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{item.action}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <button className="w-full mt-6 py-3 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-xl text-sm font-semibold text-gray-500 dark:text-gray-400 hover:border-indigo-500 hover:text-indigo-600 dark:hover:border-indigo-400 dark:hover:text-indigo-400 transition-colors">
                Load More History
              </button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default AnalyticsPage;
