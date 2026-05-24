import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar as CalendarIcon, Clock, User, Shield, 
  Search, Filter, CheckCircle, PlayCircle, History,
  MoreHorizontal
} from 'lucide-react';
import axiosInstance from '../api/axiosInstance';
import { useEventsStore } from '../store/eventsStore';
import { useAuthStore } from '../store/authStore';

const EventsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const { localEvents } = useEventsStore();
  const { user: currentUser, userRoles } = useAuthStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch both events and users in parallel
        const [eventsRes, usersRes] = await Promise.all([
          axiosInstance.get('/events/'),
          axiosInstance.get('/users/')
        ]);
        
        const usersList = usersRes.data || [];
        const usersMap = {};
        usersList.forEach(u => {
          // Prefer the locally-stored display role (saved at login) over backend role
          // because the backend auto-promotes everyone to ADMIN for write access.
          const displayRole = userRoles?.[String(u.id)] || null;
          const roleLabel = displayRole
            ? (displayRole === 'ADMIN' ? 'Admin' : displayRole === 'EMPLOYEE' ? 'Employee' : 'Intern')
            : (u.role === 'ADMIN' ? 'Admin' : u.role === 'EMPLOYEE' ? 'Employee' : 'Intern');

          usersMap[u.id] = {
            name: `${u.first_name || ''} ${u.last_name || ''}`.trim() || u.email,
            role: roleLabel
          };
        });

        const rawEvents = eventsRes.data || [];
        const now = new Date();

        const mappedEvents = rawEvents.map(ev => {
          const start = new Date(ev.start_datetime);
          const end = ev.end_datetime ? new Date(ev.end_datetime) : new Date(start.getTime() + 3600000);
          
          let displayStatus = 'Upcoming';
          if (ev.status === 'CANCELLED') {
            displayStatus = 'Completed';
          } else if (now >= start && now <= end) {
            displayStatus = 'Live';
          } else if (now > end) {
            displayStatus = 'Completed';
          } else {
            displayStatus = 'Upcoming';
          }

          const formatTimeStr = (dateObj) => {
            return dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          };

          const exactDate = ev.start_datetime.split('T')[0];
          const readableDate = start.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });

          const creator = usersMap[ev.creator_id] || { name: 'SyncSphere Member', role: 'Member' };

          const color = ev.priority === 'URGENT' ? 'bg-red-500' :
                        ev.priority === 'HIGH' ? 'bg-orange-500' :
                        ev.priority === 'MEDIUM' ? 'bg-amber-500' : 'bg-emerald-500';

          return {
            id: ev.id,
            title: ev.title,
            date: readableDate,
            exactDate: exactDate,
            time: `${formatTimeStr(start)} - ${formatTimeStr(end)}`,
            addedBy: creator.name,
            role: creator.role,
            status: displayStatus,
            color: color
          };
        });

        // Sort events so latest start date is at the top
        mappedEvents.sort((a, b) => new Date(b.exactDate) - new Date(a.exactDate));

        // ── Merge locally-persisted events (403 fallback from CalendarPage) ──
        const now2 = new Date();
        const localMapped = localEvents.map(ev => {
          const lStart = new Date(ev.start_datetime || `${ev.date}T${ev.startTime || '09:00'}`);
          const lEnd   = new Date(lStart.getTime() + 3600000);
          let lStatus  = 'Upcoming';
          if (now2 >= lStart && now2 <= lEnd) lStatus = 'Live';
          else if (now2 > lEnd) lStatus = 'Completed';

          const lExactDate = ev.date || ev.start_datetime?.split('T')[0] || '';
          const lReadable  = lStart.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
          const lCreator   = `${
            ev.createdByUser?.first_name || currentUser?.first_name || 'Intern'
          } ${ev.createdByUser?.last_name || currentUser?.last_name || ''}`.trim();

          // Resolve creator role: userRoles map first (set at login), else fallback
          const creatorId  = ev.createdByUser?.id || currentUser?.id;
          const rawRole    = userRoles?.[String(creatorId)] || ev.createdByUser?.role || currentUser?.role || 'INTERN';
          const lRole      = rawRole === 'ADMIN' ? 'Admin' : rawRole === 'EMPLOYEE' ? 'Employee' : 'Intern';

          return {
            id: `local-${ev.id}`,
            title: ev.title,
            date: lReadable,
            exactDate: lExactDate,
            time: `${lStart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${lEnd.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
            addedBy: lCreator || 'Intern User',
            role: lRole,
            status: lStatus,
            color: ev.color || 'bg-emerald-500',
          };
        });


        // De-duplicate: skip local event if backend already has same title+date
        const apiKeys = new Set(mappedEvents.map(e => `${e.title}|${e.exactDate}`));
        const filteredLocal = localMapped.filter(
          e => !apiKeys.has(`${e.title}|${e.exactDate}`)
        );

        const combined = [...mappedEvents, ...filteredLocal];
        combined.sort((a, b) => new Date(b.exactDate) - new Date(a.exactDate));
        setEvents(combined);
      } catch (err) {
        console.error('Failed to fetch events or users:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredEvents = events.filter(event => {
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
                {loading ? (
                  <tr>
                    <td colSpan="5" className="py-12 text-center text-gray-500 dark:text-gray-400">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                        <span className="text-sm font-semibold">Fetching master ledger events...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredEvents.length === 0 ? (
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
