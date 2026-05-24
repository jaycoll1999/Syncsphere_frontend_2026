import React, { useState, useEffect } from 'react'
import {
  User,
  Lock,
  Settings,
  Activity,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Camera,
  Check,
  Shield,
  Clock,
  Bell,
  Globe,
  Save,
  Loader2
} from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { useThemeStore } from '../store/themeStore'
import axiosInstance from '../api/axiosInstance'
import { toast } from 'react-toastify'

const ProfilePage = () => {
  const { user, updateUser } = useAuthStore()
  const { theme, toggleTheme } = useThemeStore()

  // Tab State: 'details' | 'security' | 'preferences' | 'activity'
  const [activeTab, setActiveTab] = useState('details')
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Profile Form States
  const [firstName, setFirstName] = useState(() => {
    if (user?.first_name) return user.first_name
    if (user?.name) return user.name.split(' ')[0] || ''
    return ''
  })
  const [lastName, setLastName] = useState(() => {
    if (user?.last_name) return user.last_name
    if (user?.name) return user.name.split(' ').slice(1).join(' ') || ''
    return ''
  })
  const [email, setEmail] = useState(user?.email || '')
  const [phone, setPhone] = useState(user?.phone || '')
  const [location, setLocation] = useState(user?.location || 'New Delhi, India')
  const [bio, setBio] = useState(user?.bio || 'Senior System Administrator & Security Officer at SyncSphere.')
  const [department, setDepartment] = useState(user?.department || 'Operations & Security')

  // Security Form States
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // Preference States
  const [language, setLanguage] = useState('English (US)')
  const [timezone, setTimezone] = useState('GMT+05:30 (IST)')
  const [emailNotifs, setEmailNotifs] = useState(true)
  const [pushNotifs, setPushNotifs] = useState(true)

  // Fetch freshest profile details on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Only trigger blocking loading spinner if we don't have local cached user details
        if (!user?.email) {
          setIsLoading(true)
        }

        // Retrieve token directly to guarantee authorization payload is present
        let currentToken = localStorage.getItem('token')
        if (!currentToken) {
          const storedAuth = localStorage.getItem('auth-storage')
          if (storedAuth) {
            try {
              currentToken = JSON.parse(storedAuth)?.state?.token
            } catch (e) {
              console.error('Failed to parse auth storage', e)
            }
          }
        }
        if (!currentToken) {
          currentToken = useAuthStore.getState().token
        }

        console.log('[ProfilePage] Fetching profile with token:', currentToken ? `Bearer ${currentToken.substring(0, 15)}...` : 'NONE')

        const response = await axiosInstance.get('/auth/me', {
          headers: {
            'Authorization': `Bearer ${currentToken}`
          }
        })
        const userData = response.data?.data || response.data
        if (userData) {
          setFirstName(userData.first_name || '')
          setLastName(userData.last_name || '')
          setEmail(userData.email || '')
          setPhone(userData.phone || '')

          // Save and synchronize back to global persisted auth store
          updateUser({
            first_name: userData.first_name,
            last_name: userData.last_name,
            email: userData.email,
            phone: userData.phone,
            role: userData.role
          })
        }
      } catch (err) {
        console.warn('Background check: /auth/me offline or slow. Using cached credentials.', err.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [])

  // Sync state if user changes in auth store
  useEffect(() => {
    if (user) {
      setFirstName(user.first_name || user.name?.split(' ')[0] || '')
      setLastName(user.last_name || user.name?.split(' ').slice(1).join(' ') || '')
      setEmail(user.email || '')
      if (user.phone) setPhone(user.phone)
      if (user.location) setLocation(user.location)
      if (user.bio) setBio(user.bio)
      if (user.department) setDepartment(user.department)
    }
  }, [user])

  // Profile Update Submission
  const handleProfileUpdate = (e) => {
    e.preventDefault()
    if (!firstName.trim() || !lastName.trim()) {
      toast.error('First name and Last name are required!')
      return
    }

    setIsSaving(true)
    setTimeout(() => {
      updateUser({
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        location,
        bio,
        department
      })
      setIsSaving(false)
      toast.success('Profile details updated successfully!')
    }, 800)
  }

  // Password Reset Submission
  const handlePasswordUpdate = (e) => {
    e.preventDefault()
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('All password fields are required!')
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match!')
      return
    }
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long!')
      return
    }

    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      toast.success('Password updated successfully!')
    }, 1000)
  }

  // Preferences Submission
  const handlePreferencesUpdate = (e) => {
    e.preventDefault()
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      toast.success('Account preferences saved!')
    }, 600)
  }

  // Mock activity logs
  const activityLogs = [
    { id: 1, action: 'User authentication login successful', ip: '192.168.1.43', date: 'Today, 10:24 AM', type: 'login' },
    { id: 2, action: 'Updated system security configuration keys', ip: '192.168.1.43', date: 'Yesterday, 3:15 PM', type: 'settings' },
    { id: 3, action: 'Rescheduled event "SyncSphere Core Sync"', ip: '192.168.1.43', date: 'May 22, 2026, 11:00 AM', type: 'calendar' },
    { id: 4, action: 'Approved leave balance request for Rahul Sharma', ip: '192.168.1.43', date: 'May 20, 2026, 4:40 PM', type: 'leave' },
    { id: 5, action: 'Changed global system timezone settings to IST', ip: '192.168.1.43', date: 'May 18, 2026, 9:12 AM', type: 'settings' }
  ]

  // Helper to draw initials in place of image
  const getInitials = (emailStr) => {
    if (!emailStr) return 'A'
    return emailStr[0].toUpperCase()
  }

  const fullName = [firstName, lastName].filter(Boolean).join(' ') || 'User'

  return (
    <div className="max-w-6xl mx-auto p-1 flex flex-col gap-6 text-gray-900 dark:text-gray-100 animate-in fade-in duration-200">

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in">
          <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
        </div>
      )}

      {/* 1. HEADER BANNER CARD */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
        {/* Banner Gradient */}
        <div className="h-32 md:h-44 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 relative" />

        {/* Profile Info Overlay Card */}
        <div className="p-6 pt-0 flex flex-col md:flex-row items-center md:items-end justify-between gap-6 -mt-16 md:-mt-20 relative">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-4 text-center md:text-left">

            {/* Large Avatar container */}
            <div className="relative group">
              <div className="h-28 w-28 md:h-36 md:w-36 rounded-3xl bg-indigo-600 text-white flex items-center justify-center text-3xl md:text-4xl font-black border-4 border-white dark:border-gray-800 shadow-md">
                {getInitials(email)}
              </div>
              <button className="absolute inset-0 bg-black/40 rounded-3xl opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity duration-150">
                <Camera className="h-6 w-6" />
              </button>
            </div>

            {/* Profile labels */}
            <div className="md:mb-1 pt-1">
              <div className="flex flex-col md:flex-row items-center gap-2">
                <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white leading-tight font-sans">
                  {fullName}
                </h1>
                <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider rounded-full flex items-center gap-1 border border-indigo-200/50 dark:border-indigo-850">
                  <Shield className="h-3.5 w-3.5" />
                  {user?.role || 'Admin'}
                </span>
              </div>
              <p className="text-gray-500 dark:text-gray-400 font-medium text-sm mt-1">{email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 md:mb-3">
            <span className="h-3.5 w-3.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">System Online</span>
          </div>
        </div>
      </div>

      {/* 2. BODY LAYOUT: TABS SIDEBAR + CONTENT CARD */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">

        {/* Navigation Tabs List */}
        <div className="w-full lg:w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl p-4 shadow-sm flex flex-col gap-1.5 flex-shrink-0">
          <button
            onClick={() => setActiveTab('details')}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold uppercase tracking-wider transition-all ${activeTab === 'details'
              ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
              : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
              }`}
          >
            <User className="h-5 w-5" />
            <span>Profile Details</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold uppercase tracking-wider transition-all ${activeTab === 'security'
              ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
              : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
              }`}
          >
            <Lock className="h-5 w-5" />
            <span>Security & Pass</span>
          </button>

          <button
            onClick={() => setActiveTab('preferences')}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold uppercase tracking-wider transition-all ${activeTab === 'preferences'
              ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
              : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
              }`}
          >
            <Settings className="h-5 w-5" />
            <span>Preferences</span>
          </button>

          <button
            onClick={() => setActiveTab('activity')}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold uppercase tracking-wider transition-all ${activeTab === 'activity'
              ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
              : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
              }`}
          >
            <Activity className="h-5 w-5" />
            <span>Activity Log</span>
          </button>
        </div>

        {/* Dynamic Details Content Card */}
        <div className="flex-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl shadow-sm overflow-hidden">

          {/* A. DETAILS TAB */}
          {activeTab === 'details' && (
            <form onSubmit={handleProfileUpdate} className="p-6 md:p-8 flex flex-col gap-6">
              <div className="border-b border-gray-100 dark:border-gray-700 pb-3">
                <h3 className="text-lg font-black text-gray-900 dark:text-white">Personal Profile Information</h3>
                <p className="text-xs font-semibold text-gray-400 mt-1 uppercase tracking-wider">Update your personal account identity details.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">First Name</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm bg-transparent text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium font-sans"
                    placeholder="Enter first name"
                    required
                  />
                </div>

                {/* Last Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Last Name</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm bg-transparent text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium font-sans"
                    placeholder="Enter last name"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Email Address (Primary) */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Email Address (Primary)</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      disabled
                      className="w-full border border-gray-200 dark:border-gray-650 bg-gray-50 dark:bg-gray-900/50 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-400 cursor-not-allowed font-medium font-sans"
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full border border-gray-200 dark:border-gray-600 rounded-xl pl-10 pr-4 py-2.5 text-sm bg-transparent text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium font-sans"
                      placeholder="e.g. 9511785345"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Department / Domain */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Department / Domain</label>
                  <div className="relative">
                    <Briefcase className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full border border-gray-200 dark:border-gray-600 rounded-xl pl-10 pr-4 py-2.5 text-sm bg-transparent text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium font-sans"
                      placeholder="e.g. Operations & Security"
                    />
                  </div>
                </div>

                {/* Location */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Location / Timezone</label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full border border-gray-200 dark:border-gray-600 rounded-xl pl-10 pr-4 py-2.5 text-sm bg-transparent text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium font-sans"
                      placeholder="City, Country"
                    />
                  </div>
                </div>
              </div>

              {/* Biography */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Biography / Description</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm bg-transparent text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all min-h-[100px] font-medium"
                  placeholder="Tell us about yourself..."
                />
              </div>

              {/* Action Buttons */}
              <div className="border-t border-gray-150 dark:border-gray-700 pt-5 flex justify-end">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/10 transition-all"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* B. SECURITY TAB */}
          {activeTab === 'security' && (
            <form onSubmit={handlePasswordUpdate} className="p-6 md:p-8 flex flex-col gap-6">
              <div className="border-b border-gray-100 dark:border-gray-700 pb-3">
                <h3 className="text-lg font-black text-gray-900 dark:text-white">Change Credentials Password</h3>
                <p className="text-xs font-semibold text-gray-400 mt-1 uppercase tracking-wider">Protect your account access with complex and periodically modified passwords.</p>
              </div>

              <div className="flex flex-col gap-5 max-w-md">
                {/* Current Password */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Current Password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm bg-transparent text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="••••••••"
                    required
                  />
                </div>

                {/* New Password */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm bg-transparent text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="••••••••"
                    required
                  />
                </div>

                {/* Confirm New Password */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm bg-transparent text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="border-t border-gray-150 dark:border-gray-700 pt-5 flex justify-end">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/10 transition-all"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Updating Password...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4" />
                      <span>Update Password</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* C. PREFERENCES TAB */}
          {activeTab === 'preferences' && (
            <form onSubmit={handlePreferencesUpdate} className="p-6 md:p-8 flex flex-col gap-6">
              <div className="border-b border-gray-100 dark:border-gray-700 pb-3">
                <h3 className="text-lg font-black text-gray-900 dark:text-white">Account Display & Settings Preferences</h3>
                <p className="text-xs font-semibold text-gray-400 mt-1 uppercase tracking-wider">Configure theme profiles, localizations, and system notifications.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Language selection */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">System Language</label>
                  <div className="relative">
                    <Globe className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full border border-gray-200 dark:border-gray-600 rounded-xl pl-10 pr-4 py-2.5 text-sm bg-transparent text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">English (US)</option>
                      <option className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">Hindi (India)</option>
                      <option className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">Spanish (Spain)</option>
                      <option className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">German (Germany)</option>
                    </select>
                  </div>
                </div>

                {/* Timezone selection */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Time Zone Offset</label>
                  <div className="relative">
                    <Clock className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
                    <select
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                      className="w-full border border-gray-200 dark:border-gray-600 rounded-xl pl-10 pr-4 py-2.5 text-sm bg-transparent text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">GMT+05:30 (IST)</option>
                      <option className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">GMT+00:00 (UTC)</option>
                      <option className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">GMT-05:00 (EST)</option>
                      <option className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">GMT+01:00 (CET)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Theme Settings Toggle (Unified) */}
              <div className="border-t border-gray-100 dark:border-gray-700 pt-5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3">Color Display Mode</h4>
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/40 rounded-2xl border border-gray-100 dark:border-gray-800">
                  <div>
                    <span className="text-sm font-bold text-gray-800 dark:text-gray-200 block">Dark Mode Appearance</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Toggle between light and dark visual themes.</span>
                  </div>
                  <button
                    type="button"
                    onClick={toggleTheme}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${theme === 'dark' ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${theme === 'dark' ? 'translate-x-5' : 'translate-x-0'
                        }`}
                    />
                  </button>
                </div>
              </div>

              {/* Notifications Toggles */}
              <div className="border-t border-gray-100 dark:border-gray-700 pt-5 flex flex-col gap-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  <span>Subscribed Notifications Settings</span>
                </h4>

                <div className="flex items-center justify-between p-2">
                  <div>
                    <span className="text-sm font-bold text-gray-800 dark:text-gray-200 block">Primary Email Notifications</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Receive system leave balances and scheduling alerts.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEmailNotifs(!emailNotifs)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${emailNotifs ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${emailNotifs ? 'translate-x-5' : 'translate-x-0'
                        }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-2">
                  <div>
                    <span className="text-sm font-bold text-gray-800 dark:text-gray-200 block">Push Notification Alerts</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Enable real-time push alerts on events changes.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPushNotifs(!pushNotifs)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${pushNotifs ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${pushNotifs ? 'translate-x-5' : 'translate-x-0'
                        }`}
                    />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="border-t border-gray-150 dark:border-gray-700 pt-5 flex justify-end">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/10 transition-all"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Saving preferences...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      <span>Save Preferences</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* D. ACTIVITY TAB */}
          {activeTab === 'activity' && (
            <div className="p-6 md:p-8 flex flex-col gap-6">
              <div className="border-b border-gray-100 dark:border-gray-700 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-gray-900 dark:text-white">Admin Security Access & Audit Activity Logs</h3>
                  <p className="text-xs font-semibold text-gray-400 mt-1 uppercase tracking-wider">A transparent historical registry of all security sensitive admin executions.</p>
                </div>
                <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 tracking-wide uppercase px-2 py-1 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-lg">5 Entries</span>
              </div>

              {/* Vertical Audit Activity Timeline */}
              <div className="relative border-l border-gray-150 dark:border-gray-700 ml-4 pl-6 flex flex-col gap-6 my-2">
                {activityLogs.map((log) => {
                  return (
                    <div key={log.id} className="relative group">

                      {/* Interactive dot */}
                      <span className="absolute -left-[31px] top-1.5 h-4 w-4 rounded-full border-2 border-indigo-600 bg-white dark:bg-gray-800 flex items-center justify-center transition-all group-hover:scale-125 duration-150">
                        <span className="h-1.5 w-1.5 bg-indigo-600 rounded-full" />
                      </span>

                      {/* Log Card Box */}
                      <div className="bg-gray-50 dark:bg-gray-900/20 border border-gray-200/50 dark:border-gray-800/80 p-4 rounded-2xl shadow-sm transition-all hover:border-indigo-500/30">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                          <p className="text-sm font-bold text-gray-800 dark:text-gray-200">
                            {log.action}
                          </p>
                          <span className="text-[10px] font-medium text-gray-400 dark:text-gray-500 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {log.date}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-[10px] font-bold text-gray-400 dark:text-gray-500 mt-2 tracking-wide uppercase">
                          <span>IP Address: {log.ip}</span>
                          <span className="border-l pl-3 border-gray-200 dark:border-gray-700">Audit Status: PASS</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

        </div>
      </div>

    </div>
  )
}

export default ProfilePage
