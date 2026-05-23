import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { 
  User, Mail, Phone, MapPin, Briefcase, Calendar, 
  Camera, CheckCircle, ShieldAlert
} from 'lucide-react';
import { toast } from 'react-toastify';

const ProfilePage = () => {
  const { user, updateUser } = useAuthStore();
  
  // Fallback in case user refreshed
  const currentUser = user || {
    first_name: 'Alex',
    last_name: 'Morgan',
    email: 'alex.morgan@syncsphere.com',
    role: 'ADMIN'
  };

  // Local state for the form
  const [formData, setFormData] = useState({
    firstName: currentUser.first_name || '',
    lastName: currentUser.last_name || '',
    email: currentUser.email || '',
    phone: '+1 (555) 123-4567',
    department: 'Engineering',
    location: 'San Francisco, CA',
    bio: 'Lead Engineer focusing on scalable frontend architectures and beautiful user experiences.',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    // Simulate updating global store if needed
    if (updateUser) {
      updateUser({
        first_name: formData.firstName,
        last_name: formData.lastName,
      });
    }
    toast.success('Profile updated successfully!');
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
        className="max-w-6xl mx-auto space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header Section */}
        <motion.div variants={itemVariants}>
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent drop-shadow-sm flex items-center gap-3">
            <User className="w-8 h-8 text-indigo-500" />
            My Profile
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-2xl">
            Manage your personal information, update your bio, and customize how others see you on the platform.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Profile Card */}
          <div className="lg:col-span-1 space-y-8">
            <motion.div variants={itemVariants} className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-3xl overflow-hidden shadow-xl shadow-gray-200/20 dark:shadow-none">
              {/* Cover Photo */}
              <div className="h-32 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 relative">
                <button className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors backdrop-blur-md">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              
              <div className="px-6 pb-6 relative">
                {/* Avatar */}
                <div className="w-24 h-24 rounded-full bg-white dark:bg-[#0B0F19] border-4 border-white dark:border-[#0B0F19] shadow-lg absolute -top-12 left-6 flex items-center justify-center">
                  <span className="text-3xl font-bold bg-gradient-to-br from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    {formData.firstName?.[0]}{formData.lastName?.[0]}
                  </span>
                  <button className="absolute bottom-0 right-0 p-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-sm transition-colors border-2 border-white dark:border-[#0B0F19]">
                    <Camera className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="mt-14 pt-2">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {formData.firstName} {formData.lastName}
                  </h2>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 mt-2 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    {currentUser.role}
                  </div>
                </div>

                <div className="mt-6 space-y-4 pt-6 border-t border-gray-100 dark:border-white/10">
                  <div className="flex items-start gap-3 text-sm">
                    <Mail className="w-5 h-5 text-gray-400 shrink-0" />
                    <span className="text-gray-600 dark:text-gray-300 font-medium break-all">{formData.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="w-5 h-5 text-gray-400 shrink-0" />
                    <span className="text-gray-600 dark:text-gray-300 font-medium">{formData.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="w-5 h-5 text-gray-400 shrink-0" />
                    <span className="text-gray-600 dark:text-gray-300 font-medium">{formData.location}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Briefcase className="w-5 h-5 text-gray-400 shrink-0" />
                    <span className="text-gray-600 dark:text-gray-300 font-medium">{formData.department}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Edit Form */}
          <div className="lg:col-span-2">
            <motion.div variants={itemVariants} className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-3xl p-6 lg:p-8 shadow-xl shadow-gray-200/20 dark:shadow-none">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Personal Information</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Update your basic profile details below.</p>
                </div>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* First Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">First Name</label>
                    <input 
                      type="text" 
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-[#0B0F19] border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                    />
                  </div>
                  
                  {/* Last Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Last Name</label>
                    <input 
                      type="text" 
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-[#0B0F19] border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                    />
                  </div>

                  {/* Email */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      readOnly
                      className="w-full px-4 py-3 bg-gray-100 dark:bg-[#0B0F19]/50 border border-gray-200 dark:border-white/5 rounded-xl text-gray-500 dark:text-gray-500 cursor-not-allowed"
                      title="Contact support to change your email"
                    />
                    <p className="text-xs text-gray-500 mt-1.5">Your email address cannot be changed from here.</p>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
                    <input 
                      type="text" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-[#0B0F19] border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                    />
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Location</label>
                    <input 
                      type="text" 
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-[#0B0F19] border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                    />
                  </div>

                  {/* Department */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Department</label>
                    <select 
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-[#0B0F19] border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow appearance-none"
                    >
                      <option>Engineering</option>
                      <option>Design</option>
                      <option>Marketing</option>
                      <option>Sales</option>
                      <option>Human Resources</option>
                    </select>
                  </div>

                  {/* Bio */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Short Bio</label>
                    <textarea 
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      rows="4"
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-[#0B0F19] border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow resize-none"
                      placeholder="Write a few sentences about yourself..."
                    ></textarea>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button 
                    type="submit"
                    className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md shadow-indigo-500/20 transition-colors flex items-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Save Profile
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfilePage;
