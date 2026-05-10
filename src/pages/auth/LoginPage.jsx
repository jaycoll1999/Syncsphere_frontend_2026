import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import axiosInstance from '../../api/axiosInstance'
import { toast } from 'react-toastify'
import { Eye, EyeOff, User, Shield, CheckCircle2 } from 'lucide-react'
import Button from '../../components/shared/Button'

const LoginPage = () => {
  const [activeTab, setActiveTab] = useState('signin')
  const [selectedRole, setSelectedRole] = useState('user')
  const { register, handleSubmit, formState: { errors } } = useForm()
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const [loading, setLoading] = useState(false)

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const endpoint = activeTab === 'signin' ? '/auth/login' : '/auth/register'
      const payload = { ...data, role: selectedRole.toUpperCase() }
      
      const response = await axiosInstance.post(endpoint, payload)
      const { user, token } = response.data
      
      if (selectedRole === 'admin' && user.role !== 'ADMIN') {
        toast.error('Access denied. This login is for administrators only.')
        setLoading(false)
        return
      }

      login(user, token)
      toast.success(`Logged in successfully as ${selectedRole}!`)
      
      if (user.role === 'ADMIN') {
        navigate('/admin')
      } else {
        navigate('/dashboard')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-gray-900 text-white">
      {/* Left Side - Promo */}
      <div className="hidden lg:flex lg:w-1/2 bg-indigo-700 p-12 flex-col justify-center">
        <div className="max-w-md mx-auto">
          <div className="flex items-center space-x-2 mb-8">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white">SyncSphere</h1>
          </div>
          
          <h2 className="text-2xl font-semibold mb-6">One platform for your team's time.</h2>
          
          <ul className="space-y-4">
            <li className="flex items-center space-x-3">
              <CheckCircle2 className="h-6 w-6 text-indigo-300" />
              <span>Smart team calendar & scheduling</span>
            </li>
            <li className="flex items-center space-x-3">
              <CheckCircle2 className="h-6 w-6 text-indigo-300" />
              <span>Leave management with approvals</span>
            </li>
            <li className="flex items-center space-x-3">
              <CheckCircle2 className="h-6 w-6 text-indigo-300" />
              <span>Real-time notifications</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-900">
        <div className="max-w-md w-full bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-700">
          {/* Tabs */}
          <div className="flex bg-gray-700 rounded-lg p-1 mb-8">
            <button
              type="button"
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'signin' ? 'bg-gray-800 text-white shadow' : 'text-gray-400 hover:text-white'}`}
              onClick={() => setActiveTab('signin')}
            >
              Sign In
            </button>
            {selectedRole === 'user' && (
              <button
                type="button"
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'signup' ? 'bg-gray-800 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                onClick={() => setActiveTab('signup')}
              >
                Sign Up
              </button>
            )}
          </div>

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {activeTab === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Your Name"
                  {...register('name', { required: activeTab === 'signup' })}
                />
                {errors.name && <p className="mt-1 text-xs text-red-500">Name is required</p>}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Email address</label>
              <input
                type="email"
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Email address"
                {...register('email', { required: 'Email is required' })}
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-300">Password</label>
                {activeTab === 'signin' && (
                  <Link to="/forgot-password" title="Forgot password?" className="text-sm text-indigo-400 hover:text-indigo-300">
                    Forgot password?
                  </Link>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Password"
                  {...register('password', { required: 'Password is required' })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
            </div>

            {/* Role Selection */}
            {activeTab === 'signup' ? (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Role</label>
                <select
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  defaultValue="user"
                  onChange={(e) => setSelectedRole(e.target.value)}
                >
                  <option value="user">User</option>
                  <option value="employee">Employee</option>
                </select>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-colors ${selectedRole === 'user' ? 'bg-gray-600 border-indigo-500 text-white' : 'bg-gray-700 border-gray-600 text-gray-400 hover:bg-gray-600'}`}
                  onClick={() => setSelectedRole('user')}
                >
                  <User className="h-6 w-6 mb-1" />
                  <span className="text-xs font-medium">User</span>
                </button>
                <button
                  type="button"
                  className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-colors ${selectedRole === 'admin' ? 'bg-gray-600 border-indigo-500 text-white' : 'bg-gray-700 border-gray-600 text-gray-400 hover:bg-gray-600'}`}
                  onClick={() => {
                    setSelectedRole('admin')
                    setActiveTab('signin')
                  }}
                >
                  <Shield className="h-6 w-6 mb-1" />
                  <span className="text-xs font-medium">Admin</span>
                </button>
              </div>
            )}

            <Button
              type="submit"
              className="w-full justify-center bg-gray-700 hover:bg-gray-600 text-white border border-gray-600"
              disabled={loading}
            >
              {loading ? 'Processing...' : activeTab === 'signin' ? 'Sign In' : 'Sign Up'}
            </Button>

            {selectedRole === 'user' && (
              <div className="text-center text-sm text-gray-400">
                {activeTab === 'signin' ? (
                  <>
                    No account?{' '}
                    <button type="button" onClick={() => setActiveTab('signup')} className="text-indigo-400 hover:text-indigo-300">
                      Sign up
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{' '}
                    <button type="button" onClick={() => setActiveTab('signin')} className="text-indigo-400 hover:text-indigo-300">
                      Sign in
                    </button>
                  </>
                )}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
