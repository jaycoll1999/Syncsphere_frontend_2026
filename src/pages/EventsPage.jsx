import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar as CalendarIcon, Clock, User, Shield, 
  Search, Filter, CheckCircle, PlayCircle, History,
  MoreHorizontal
} from 'lucide-react';

const EventsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('All');

  // Mock Event Records Database
  const eventsDatabase = [
    { id: 1, title: 'Design System Review', date: 'Today', exactDate: '2026-05-17', time: '11:00 AM - 12:00 PM', addedBy: 'Sarah Chen', role: 'Lead Designer', status: 'Live', color: 'bg-emerald-500' },
    { id: 2, title: 'Q3 Roadmapping', date: 'Tomorrow', exactDate: '2026-05-18', time: '02:00 PM - 04:00 PM', addedBy: 'Jessica Alba', role: 'Product Manager', status: 'Upcoming', color: 'bg-blue-500' },
    { id: 3, title: 'Weekly Engineering Sync', date: 'Next Week', exactDate: '2026-05-22', time: '10:00 AM - 11:00 AM', addedBy: 'Alex Morgan', role: 'Admin', status: 'Upcoming', color: 'bg-indigo-500' },
    { id: 4, title: 'Client Onboarding', date: 'Last Week', exactDate: '2026-05-10', time: '01:00 PM - 02:30 PM', addedBy: 'Michael Ross', role: 'Account Exec', status: 'Completed', color: 'bg-gray-500' },
    { id: 5, title: 'Server Maintenance', date: 'Last Month', exactDate: '2026-04-28', time: '12:00 AM - 03:00 AM', addedBy: 'System', role: 'Automated', status: 'Completed', color: 'bg-amber-500' },
    { id: 6, title: 'Marketing Campaign Launch', date: 'In 2 Weeks', exactDate: '2026-06-01', time: '09:00 AM - 10:00 AM', addedBy: 'Alex Morgan', role: 'Admin', status: 'Upcoming', color: 'bg-purple-500' },
  ];

  const filteredEvents = eventsDatabase.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          event.addedBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'All' || event.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Live': return <PlayCircle className="w-4 h-4 text-emerald-500" />;
      case 'Upcoming': return <Clock className="w-4 h-4 text-blue-500" />;
      case 'Completed': return <CheckCircle className="w-4 h-4 text-gray-500" />;
      default: return <History className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Live': 
        return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20";
      case 'Upcoming': 
        return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20";
      case 'Completed': 
        return "bg-gray-50 text-gray-700 border-gray-200 dark:bg-white/5 dark:text-gray-400 dark:border-white/10";
      default: 
        return "bg-gray-50 text-gray-700 border-gray-200 dark:bg-white/5 dark:text-gray-400 dark:border-white/10";
    }
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
        {/* Header Section */}
        <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent drop-shadow-sm flex items-center gap-3">
              <CalendarIcon className="w-8 h-8 text-indigo-500" />
              Event Master Ledger
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-2xl">
              Track and monitor every event added to the system. View live events, upcoming schedules, and complete past historical records.
            </p>
          </div>
        </motion.div>

        {/* Toolbar & Filters */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-white/5 p-4 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm">
          {/* Tabs */}
          <div className="flex bg-gray-100 dark:bg-[#0B0F19] p-1 rounded-xl">
            {['All', 'Live', 'Upcoming', 'Completed'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${activeTab === tab ? 'bg-white dark:bg-white/10 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
              >
                {tab}
              </button>
            ))}
          </div>
          
          {/* Search */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search events or creators..." 
                className="pl-9 pr-4 py-2 bg-gray-50 dark:bg-[#0B0F19] border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white w-full transition-shadow"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="p-2.5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        {/* Events Data Table */}
        <motion.div variants={itemVariants} className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-3xl shadow-xl shadow-gray-200/20 dark:shadow-none overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-gray-100 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.02] text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  <th className="py-5 pl-8 font-semibold">Event Details</th>
                  <th className="py-5 font-semibold">Schedule</th>
                  <th className="py-5 font-semibold">Created By</th>
                  <th className="py-5 font-semibold">Status</th>
                  <th className="py-5 font-semibold text-right pr-8">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                {filteredEvents.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-12 text-center text-gray-500 dark:text-gray-400">
                      No events found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredEvents.map((event, i) => (
                    <motion.tr 
                      key={event.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors group"
                    >
                      {/* Event Details */}
                      <td className="py-5 pl-8">
                        <div className="flex items-center gap-4">
                          <div className={`w-3 h-3 rounded-full ${event.color} ring-4 ring-gray-50 dark:ring-[#0B0F19]`} />
                          <div>
                            <p className="font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors text-base">{event.title}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">ID: EVT-{1000 + event.id}</p>
                          </div>
                        </div>
                      </td>
                      
                      {/* Schedule */}
                      <td className="py-5">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-gray-200">
                            <CalendarIcon className="w-4 h-4 text-gray-400" />
                            {event.date} <span className="text-xs font-normal text-gray-500">({event.exactDate})</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                            <Clock className="w-3.5 h-3.5" />
                            {event.time}
                          </div>
                        </div>
                      </td>
                      
                      {/* Created By */}
                      <td className="py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center text-gray-600 dark:text-gray-300 font-bold text-xs border border-gray-200 dark:border-white/5">
                            {event.addedBy.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">{event.addedBy}</p>
                            <div className="flex items-center gap-1 mt-0.5">
                              {event.role === 'Admin' ? <Shield className="w-3 h-3 text-indigo-500" /> : <User className="w-3 h-3 text-gray-400" />}
                              <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{event.role}</p>
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      {/* Status */}
                      <td className="py-5">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${getStatusBadge(event.status)}`}>
                          {getStatusIcon(event.status)}
                          {event.status}
                        </span>
                      </td>
                      
                      {/* Actions */}
                      <td className="py-5 pr-8 text-right">
                        <button className="p-2 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-lg transition-colors">
                          <MoreHorizontal className="w-5 h-5" />
                        </button>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default EventsPage;
