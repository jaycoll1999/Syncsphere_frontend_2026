import React from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { 
  Briefcase, HeartPulse, Coffee, 
  User as UserIcon, Calendar, CheckCircle, PieChart, Shield
} from 'lucide-react';

const LeaveBalancePage = () => {
  const { user } = useAuthStore();
  
  // Fallback in case user refreshed and store didn't persist user data during mock phase
  const currentUser = user || {
    first_name: 'Alex',
    last_name: 'Morgan',
    email: 'alex.morgan@syncsphere.com',
    role: 'ADMIN'
  };

  const leaveBalances = [
    { 
      id: 'annual', 
      title: 'Annual Leave', 
      total: 20, 
      taken: 8, 
      icon: <Briefcase className="w-6 h-6 text-indigo-500" />,
      color: 'bg-indigo-500',
      lightColor: 'bg-indigo-100 dark:bg-indigo-500/20'
    },
    { 
      id: 'sick', 
      title: 'Sick Leave', 
      total: 10, 
      taken: 2, 
      icon: <HeartPulse className="w-6 h-6 text-red-500" />,
      color: 'bg-red-500',
      lightColor: 'bg-red-100 dark:bg-red-500/20'
    },
    { 
      id: 'casual', 
      title: 'Casual Leave', 
      total: 5, 
      taken: 4, 
      icon: <Coffee className="w-6 h-6 text-orange-500" />,
      color: 'bg-orange-500',
      lightColor: 'bg-orange-100 dark:bg-orange-500/20'
    }
  ];

  const totalLeaves = leaveBalances.reduce((acc, curr) => acc + curr.total, 0);
  const totalTaken = leaveBalances.reduce((acc, curr) => acc + curr.taken, 0);
  const totalRemaining = totalLeaves - totalTaken;

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
        className="max-w-6xl mx-auto space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header Section */}
        <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent drop-shadow-sm flex items-center gap-3">
              <PieChart className="w-8 h-8 text-indigo-500" />
              My Leave Balance
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-2xl">
              Track your personal time off, view how many days you've taken, and check your remaining balances for the year.
            </p>
          </div>
        </motion.div>

        {/* User Identity Card */}
        <motion.div variants={itemVariants} className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-3xl p-6 shadow-xl shadow-gray-200/20 dark:shadow-none flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5 w-full md:w-auto">
            <div className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center border-2 border-white dark:border-[#0B0F19] shadow-md relative">
              <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                {currentUser.first_name?.[0]}{currentUser.last_name?.[0]}
              </span>
              <div className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white dark:border-[#0B0F19]"></div>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {currentUser.first_name} {currentUser.last_name}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                {currentUser.role === 'ADMIN' ? (
                  <Shield className="w-4 h-4 text-indigo-500" />
                ) : (
                  <UserIcon className="w-4 h-4 text-gray-400" />
                )}
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {currentUser.role || 'Employee'}
                </span>
                <span className="text-gray-300 dark:text-gray-600 mx-1">•</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">{currentUser.email}</span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            <div className="bg-gray-50 dark:bg-[#0B0F19] px-5 py-3 rounded-2xl border border-gray-100 dark:border-white/5 min-w-[120px]">
              <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider mb-1">Total</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalLeaves} <span className="text-sm font-normal text-gray-500">days</span></p>
            </div>
            <div className="bg-gray-50 dark:bg-[#0B0F19] px-5 py-3 rounded-2xl border border-gray-100 dark:border-white/5 min-w-[120px]">
              <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider mb-1">Taken</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalTaken} <span className="text-sm font-normal text-gray-500">days</span></p>
            </div>
            <div className="bg-emerald-50 dark:bg-emerald-500/10 px-5 py-3 rounded-2xl border border-emerald-100 dark:border-emerald-500/20 min-w-[120px]">
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold uppercase tracking-wider mb-1">Available</p>
              <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">{totalRemaining} <span className="text-sm font-normal opacity-80">days</span></p>
            </div>
          </div>
        </motion.div>

        {/* Detailed Breakdown */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {leaveBalances.map((leave, index) => {
            const remaining = leave.total - leave.taken;
            const percentageUsed = (leave.taken / leave.total) * 100;
            const isLow = remaining <= 2 && remaining > 0;
            const isExhausted = remaining === 0;
            
            return (
              <motion.div 
                key={leave.id}
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-3xl p-6 shadow-xl shadow-gray-200/20 dark:shadow-none flex flex-col"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className={`p-3 rounded-2xl ${leave.lightColor}`}>
                    {leave.icon}
                  </div>
                  {isExhausted ? (
                    <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400 rounded-full">Exhausted</span>
                  ) : isLow ? (
                    <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400 rounded-full">Running Low</span>
                  ) : (
                    <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 rounded-full">Available</span>
                  )}
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{leave.title}</h3>
                
                <div className="flex-1">
                  <div className="flex justify-between items-end mb-2">
                    <div>
                      <p className="text-3xl font-extrabold text-gray-900 dark:text-white">
                        {remaining}
                      </p>
                      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-1">Remaining</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-700 dark:text-gray-300">
                        {leave.taken} <span className="text-sm font-medium text-gray-500">/ {leave.total}</span>
                      </p>
                      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-1">Used</p>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-gray-100 dark:bg-white/10 rounded-full h-3 mt-4 overflow-hidden relative">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${percentageUsed}%` }}
                      transition={{ duration: 1, delay: 0.2 + (index * 0.1) }}
                      className={`h-full rounded-full ${leave.color} relative`}
                    >
                      <div className="absolute inset-0 bg-white/20 w-full h-full" style={{ backgroundImage: 'linear-gradient(45deg, rgba(255,255,255,.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,.15) 50%, rgba(255,255,255,.15) 75%, transparent 75%, transparent)', backgroundSize: '1rem 1rem' }}></div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Quick Info */}
        <motion.div variants={itemVariants} className="bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 rounded-2xl p-5 flex items-start gap-4">
          <Calendar className="w-6 h-6 text-indigo-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-indigo-900 dark:text-indigo-300">Leave Policy Cycle</h4>
            <p className="text-sm text-indigo-700 dark:text-indigo-400/80 mt-1">
              Your leave balances reset annually on <strong>January 1st</strong>. Unused Annual Leave (up to 5 days) automatically rolls over to the next year. Casual and Sick leaves do not roll over.
            </p>
          </div>
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

export default LeaveBalancePage;
