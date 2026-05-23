import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, CheckCircle, Clock, 
  Briefcase, Mail, X, Plus, Calendar, Shield, User
} from 'lucide-react';
import { toast } from 'react-toastify';

const TeamOverviewPage = () => {
  // Mock Team Data
  const [teamMembers, setTeamMembers] = useState([
    { id: 1, name: 'Alex Morgan', role: 'Lead Developer', email: 'alex@example.com', avatar: 'A', tasks: 5 },
    { id: 2, name: 'Sarah Chen', role: 'UI/UX Designer', email: 'sarah@example.com', avatar: 'S', tasks: 2 },
    { id: 3, name: 'Michael Ross', role: 'Backend Engineer', email: 'michael@example.com', avatar: 'M', tasks: 4 },
    { id: 4, name: 'Jessica Alba', role: 'Product Manager', email: 'jessica@example.com', avatar: 'J', tasks: 1 },
    { id: 5, name: 'David Kim', role: 'QA Tester', email: 'david@example.com', avatar: 'D', tasks: 3 },
    { id: 6, name: 'Emily Clark', role: 'Frontend Engineer', email: 'emily@example.com', avatar: 'E', tasks: 0 }
  ]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [taskName, setTaskName] = useState('');
  const [taskDeadline, setTaskDeadline] = useState('');

  const openAssignModal = (member) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMember(null);
    setTaskName('');
    setTaskDeadline('');
  };

  const handleAssignTask = (e) => {
    e.preventDefault();
    if (!taskName) {
      toast.error('Please enter a task name');
      return;
    }
    
    // Update local state to reflect the new task
    setTeamMembers(prev => prev.map(m => 
      m.id === selectedMember.id ? { ...m, tasks: m.tasks + 1 } : m
    ));
    
    toast.success(`Task "${taskName}" successfully assigned to ${selectedMember.name}!`);
    closeModal();
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
    <div className="min-h-screen bg-gray-50 dark:bg-[#0B0F19] text-gray-900 dark:text-white p-6 lg:p-10 font-sans relative">
      <motion.div 
        className="max-w-7xl mx-auto space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent drop-shadow-sm flex items-center gap-3">
              <Users className="w-8 h-8 text-indigo-500" />
              Team Directory & Task Assignment
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-2xl">
              View all team members, manage their active workloads, and instantly assign new tasks to keep projects moving.
            </p>
          </div>
        </motion.div>

        {/* Team Members Grid */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {teamMembers.map((member) => (
            <div key={member.id} className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-3xl p-6 shadow-xl shadow-gray-200/20 dark:shadow-none hover:shadow-2xl transition-all duration-300 relative group overflow-hidden flex flex-col h-full">
              {/* Card Background Decoration */}
              <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-3xl pointer-events-none group-hover:bg-indigo-500/20 transition-colors" />
              
              <div className="flex items-start gap-4 mb-6 relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 p-0.5 shadow-lg shadow-indigo-500/30 shrink-0">
                  <div className="w-full h-full bg-white dark:bg-[#111827] rounded-xl flex items-center justify-center">
                    <span className="text-2xl font-bold bg-gradient-to-tr from-indigo-500 to-purple-500 bg-clip-text text-transparent">{member.avatar}</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{member.name}</h3>
                  <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 text-sm font-medium mt-0.5">
                    <Briefcase className="w-4 h-4" />
                    {member.role}
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-8 relative z-10 flex-1">
                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300 text-sm">
                  <Mail className="w-4 h-4 text-gray-400" />
                  {member.email}
                </div>
                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300 text-sm">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span className="font-semibold text-gray-900 dark:text-white">{member.tasks}</span> Active Tasks
                </div>
              </div>

              <button 
                onClick={() => openAssignModal(member)}
                className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 text-indigo-600 dark:text-indigo-400 font-semibold rounded-xl transition-all duration-300 relative z-10"
              >
                <Plus className="w-5 h-5" />
                Assign New Task
              </button>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Task Assignment Modal */}
      <AnimatePresence>
        {isModalOpen && selectedMember && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={closeModal}
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-[#111827] border border-gray-100 dark:border-white/10 w-full max-w-lg rounded-3xl shadow-2xl relative z-10 overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-white/10 bg-gray-50/50 dark:bg-white/5">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-indigo-500" />
                  Assign Task
                </h3>
                <button 
                  onClick={closeModal}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white bg-white dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleAssignTask} className="p-6 space-y-6">
                <div className="bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 p-4 rounded-2xl flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-md">
                    {selectedMember.avatar}
                  </div>
                  <div>
                    <p className="text-sm text-indigo-600 dark:text-indigo-400 font-semibold mb-0.5">Assigning to</p>
                    <p className="font-bold text-gray-900 dark:text-white">{selectedMember.name}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Task Description</label>
                  <input
                    type="text"
                    value={taskName}
                    onChange={(e) => setTaskName(e.target.value)}
                    placeholder="e.g., Update homepage UI components"
                    className="w-full px-4 py-3 bg-white dark:bg-[#0B0F19] border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Deadline (Optional)</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      value={taskDeadline}
                      onChange={(e) => setTaskDeadline(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-white dark:bg-[#0B0F19] border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                    />
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 px-4 py-3 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 font-semibold rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/30 transition-colors"
                  >
                    Assign Task
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TeamOverviewPage;
