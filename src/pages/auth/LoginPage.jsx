import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import axiosInstance from '../../api/axiosInstance'
import { toast } from 'react-toastify'
import { Eye, EyeOff, User, Shield, CheckCircle2, Settings } from 'lucide-react'
import { motion } from 'framer-motion'

const LoginPage = () => {
  const [activeTab, setActiveTab] = useState('signin')
  const [selectedRole, setSelectedRole] = useState('INTERN')
  const { register, handleSubmit, formState: { errors } } = useForm()
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [showConfigModal, setShowConfigModal] = useState(false)
  const [backendIp, setBackendIp] = useState(() => {
    return localStorage.getItem('VITE_BACKEND_IP') || '192.168.1.42:8000'
  })

  const onSubmit = async (data) => {
    setLoading(true)
    console.log('--- Auth Form Submission ---');
    try {
      const endpoint = activeTab === 'signin' ? '/auth/login' : '/auth/register'
      const payload = activeTab === 'signin' 
        ? { email: data.email, password: data.password }
        : {
            first_name: data.first_name,
            last_name: data.last_name,
            email: data.email,
            phone: String(data.phone),
            role: selectedRole.toUpperCase(),
            password: data.password
          }
      
      console.log(`Hitting API Endpoint: ${endpoint}`);
      console.log('Request Payload:', payload);
      
      const response = await axiosInstance.post(endpoint, payload)
      console.log('API Response Success:', response.data);
      
      const responseData = response.data
      
      // Dynamically extract token (supports flat, nested, and accessToken formats)
      const token = responseData.token || 
                    responseData.accessToken || 
                    responseData.data?.token || 
                    responseData.data?.accessToken
      
      // Dynamically extract user (supports flat and nested formats)
      let user = responseData.user || responseData.data?.user
      if (!user && (responseData.email || responseData.data?.email)) {
        const source = responseData.email ? responseData : responseData.data
        user = {
          id: source.id || source._id,
          email: source.email,
          first_name: source.first_name,
          last_name: source.last_name,
          phone: source.phone,
          name: source.name || [source.first_name, source.last_name].filter(Boolean).join(' '),
          role: source.role
        }
      } else if (user) {
        user.first_name = user.first_name || user.name?.split(' ')[0] || ''
        user.last_name = user.last_name || user.name?.split(' ').slice(1).join(' ') || ''
      }
      
      const userRole = user?.role || ''
      const isRoleAdmin = userRole.toUpperCase() === 'ADMIN'
      
      if (selectedRole.toUpperCase() === 'ADMIN' && !isRoleAdmin) {
        console.warn('Role Mismatch: Expected ADMIN but got', userRole);
        toast.error('Access denied. This login is for administrators only.')
        setLoading(false)
        return
      }
      if (selectedRole === 'EMPLOYEE' && user.role !== 'EMPLOYEE') {
        toast.error('Access denied. This login is for employees only.')
        setLoading(false)
        return
      }
      if (selectedRole === 'INTERN' && user.role !== 'INTERN') {
        toast.error('Access denied. This login is for interns only.')
        setLoading(false)
        return
      }

      login(user, token)
      toast.success(activeTab === 'signin' ? `Logged in successfully as ${selectedRole.toLowerCase()}!` : `Registered successfully!`)
      
      if (isRoleAdmin) {
        navigate('/admin')
      } else {
        navigate('/dashboard')
      }
    } catch (error) {
      console.error('API Response Error:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-black text-white font-sans">
      {/* Background Image System */}
      <div className="absolute inset-0 z-0">
        <div 
          className="w-full h-full bg-cover bg-center transition-transform duration-1000 scale-105"
          style={{ backgroundImage: "url('/syncsphere_bg.png')", filter: "brightness(0.6)" }}
        />
      </div>

      {/* Overlays */}
      <div className="absolute inset-0 bg-black/40 z-10"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-black/80 via-transparent to-black/40 z-10"></div>

      {/* Content Container (Split Layout on Desktop) */}
      <div className="container mx-auto max-w-7xl px-6 flex flex-col lg:flex-row items-center justify-between relative z-20 h-full min-h-screen py-12">
        
        {/* Left Side Content (Text Over Image) */}
        <div className="w-full lg:w-1/2 text-left mb-12 lg:mb-0 lg:pr-12">
          {/* Logo */}
          <motion.div 
            className="flex items-center space-x-3 mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/30">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">SyncSphere</h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="text-5xl lg:text-6xl font-extrabold leading-tight mb-6 bg-gradient-to-r from-white via-indigo-100 to-indigo-200 bg-clip-text text-transparent drop-shadow-lg">
              One platform for your team's time.
            </h2>
            <p className="text-xl text-gray-300 mb-10 max-w-lg drop-shadow">
              Streamline scheduling, manage leaves, and stay in sync with real-time updates.
            </p>

            {/* Stats Row */}
            <div className="flex flex-wrap gap-8 text-sm font-medium text-gray-400">
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-white">10K+</span>
                <span>Events Managed</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-white">50+</span>
                <span>Teams</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-white">99.9%</span>
                <span>Uptime</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Side - Auth Card */}
        <div className="w-full lg:w-1/2 flex justify-center">
          <motion.div 
            className="max-w-md w-full bg-white/10 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-white/20 ring-1 ring-white/10 relative z-30"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {/* Tabs */}
            <div className="relative flex bg-white/5 rounded-lg p-1 mb-8 border border-white/10">
              <div 
                className={`absolute top-1 bottom-1 w-[calc(50%-0.25rem)] bg-indigo-600 rounded-md shadow-md transition-all duration-300 ease-in-out ${activeTab === 'signin' ? 'left-1' : 'left-[50%]'}`}
              />
              <button
                type="button"
                className={`relative z-10 flex-1 py-2 text-sm font-semibold transition-colors duration-300 ${activeTab === 'signin' ? 'text-white' : 'text-gray-300 hover:text-white'}`}
                onClick={() => setActiveTab('signin')}
              >
                Sign In
              </button>
              <button
                type="button"
                className={`relative z-10 flex-1 py-2 text-sm font-semibold transition-colors duration-300 ${activeTab === 'signup' ? 'text-white' : 'text-gray-400 hover:text-white'}`}
                onClick={() => setActiveTab('signup')}
              >
                Sign Up
              </button>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              {activeTab === 'signup' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-2 uppercase tracking-wider">First Name</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:shadow-[0_0_15px_rgba(99,102,241,0.3)] transition-all duration-300"
                        placeholder="John"
                        {...register('first_name', { required: activeTab === 'signup' })}
                      />
                      {errors.first_name && <p className="mt-1.5 text-xs text-red-500">Required</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-2 uppercase tracking-wider">Last Name</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:shadow-[0_0_15px_rgba(99,102,241,0.3)] transition-all duration-300"
                        placeholder="Doe"
                        {...register('last_name', { required: activeTab === 'signup' })}
                      />
                      {errors.last_name && <p className="mt-1.5 text-xs text-red-500">Required</p>}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-2 uppercase tracking-wider">Phone</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:shadow-[0_0_15px_rgba(99,102,241,0.3)] transition-all duration-300"
                      placeholder="+1234567890"
                      {...register('phone', { required: activeTab === 'signup' })}
                    />
                    {errors.phone && <p className="mt-1.5 text-xs text-red-500">Phone is required</p>}
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-2 uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:shadow-[0_0_15px_rgba(99,102,241,0.3)] transition-all duration-300"
                  placeholder="you@example.com"
                  {...register('email', { required: 'Email is required' })}
                />
                {errors.email && <p className="mt-1.5 text-xs text-red-500">{errors.email.message}</p>}
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-medium text-gray-300 uppercase tracking-wider">Password</label>
                  {activeTab === 'signin' && (
                    <Link to="/forgot-password" title="Forgot password?" className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
                      Forgot?
                    </Link>
                  )}
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:shadow-[0_0_15px_rgba(99,102,241,0.3)] transition-all duration-300"
                    placeholder="••••••••"
                    {...register('password', { required: 'Password is required' })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && <p className="mt-1.5 text-xs text-red-500">{errors.password.message}</p>}
              </div>

              {/* Remember Me */}
              {activeTab === 'signin' && (
                <div className="flex items-center">
                  <input
                    id="rememberMe"
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-white/20 rounded bg-white/10"
                    {...register('rememberMe')}
                  />
                  <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-300">
                    Remember me
                  </label>
                </div>
              )}

              {/* Role Selection */}
              {activeTab === 'signup' ? (
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-2 uppercase tracking-wider">Role</label>
                  <div className="relative">
                    <select
                      className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:shadow-[0_0_15px_rgba(99,102,241,0.3)] transition-all duration-300 appearance-none"
                      defaultValue="INTERN"
                      onChange={(e) => setSelectedRole(e.target.value)}
                    >
                      <option value="INTERN" className="bg-[#0B0F17] text-white">Intern</option>
                      <option value="EMPLOYEE" className="bg-[#0B0F17] text-white">Employee</option>
                      <option value="ADMIN" className="bg-[#0B0F17] text-white">Admin</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    className={`flex items-center justify-center space-x-2 p-3 rounded-lg border transition-all duration-300 transform hover:scale-105 ${selectedRole === 'INTERN' ? 'bg-indigo-500/20 border-indigo-400 text-white shadow-lg shadow-indigo-500/30' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}
                    onClick={() => setSelectedRole('INTERN')}
                  >
                    <User className="h-4 w-4" />
                    <span className="text-sm font-semibold">Intern</span>
                  </button>
                  <button
                    type="button"
                    className={`flex items-center justify-center space-x-2 p-3 rounded-lg border transition-all duration-300 transform hover:scale-105 ${selectedRole === 'EMPLOYEE' ? 'bg-indigo-500/20 border-indigo-400 text-white shadow-lg shadow-indigo-500/30' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}
                    onClick={() => setSelectedRole('EMPLOYEE')}
                  >
                    <User className="h-4 w-4" />
                    <span className="text-sm font-semibold">Employee</span>
                  </button>
                  <button
                    type="button"
                    className={`flex items-center justify-center space-x-2 p-3 rounded-lg border transition-all duration-300 transform hover:scale-105 ${selectedRole === 'ADMIN' ? 'bg-indigo-500/20 border-indigo-400 text-white shadow-lg shadow-indigo-500/30' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}
                    onClick={() => {
                      setSelectedRole('ADMIN')
                      setActiveTab('signin')
                    }}
                  >
                    <Shield className="h-4 w-4" />
                    <span className="text-sm font-semibold">Admin</span>
                  </button>
                </div>
              )}

              <button
                type="submit"
                className="w-full justify-center bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg shadow-lg shadow-indigo-500/40 transform hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-[#020617]"
                disabled={loading}
              >
                {loading ? 'Processing...' : activeTab === 'signin' ? 'Sign In' : 'Sign Up'}
              </button>

              {selectedRole !== 'ADMIN' && (
                <div className="text-center text-sm text-gray-400 mt-6">
                  {activeTab === 'signin' ? (
                    <>
                      No account?{' '}
                      <button type="button" onClick={() => setActiveTab('signup')} className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                        Sign up
                      </button>
                    </>
                  ) : (
                    <>
                      Already have an account?{' '}
                      <button 
                        type="button" 
                        onClick={() => {
                          setActiveTab('signin')
                          setSelectedRole('INTERN')
                        }} 
                        className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
                      >
                        Sign in
                      </button>
                    </>
                  )}
                </div>
              )}
            </form>
          </motion.div>
        </div>
      </div>

      {/* Dynamic Backend IP Gear Button in top-right */}
      <button 
        type="button"
        onClick={() => setShowConfigModal(true)}
        className="absolute top-6 right-6 z-50 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full border border-white/25 shadow-lg transition-all duration-300 hover:rotate-45"
        title="Configure Backend Connection"
      >
        <Settings className="h-5 w-5 text-white" />
      </button>

      {/* Backend Target IP Config Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 w-full max-w-sm shadow-2xl relative animate-in zoom-in duration-150 text-left">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Settings className="h-5 w-5 text-indigo-500 animate-spin-slow" />
              Backend Connection Settings
            </h3>
            <p className="text-xs text-gray-400 mt-2 font-medium">
              Configure the dynamic local network IP of your backend server device. This completely prevents bad gateway/502 errors when your IP changes.
            </p>
            
            <div className="mt-4 flex flex-col gap-1.5">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-400">Backend Host & Port</label>
              <input
                type="text"
                value={backendIp}
                onChange={(e) => setBackendIp(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                placeholder="e.g. 192.168.1.42:8000"
              />
            </div>
            
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowConfigModal(false)}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-bold uppercase rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  localStorage.setItem('VITE_BACKEND_IP', backendIp)
                  setShowConfigModal(false)
                  toast.success(`Dynamic Backend IP updated to: http://${backendIp}`)
                  setTimeout(() => window.location.reload(), 500)
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase rounded-xl shadow-lg shadow-indigo-600/30 transition-all"
              >
                Apply & Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default LoginPage
