import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import axiosInstance from '../../api/axiosInstance'
import { toast } from 'react-toastify'
import { Mail, ArrowLeft } from 'lucide-react'
import Button from '../../components/shared/Button'

const ForgotPasswordPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await axiosInstance.post('/auth/forgot-password', data)
      setSubmitted(true)
      toast.success('Reset link sent!')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send reset link')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Forgot Password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Enter your email to receive a password reset link.
          </p>
        </div>

        {submitted ? (
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30">
              <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Check your email</h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              We've sent a password reset link to your email address.
            </p>
            <div className="mt-6">
              <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 flex items-center justify-center">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to login
              </Link>
            </div>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  className={`appearance-none rounded-lg relative block w-full px-3 py-2 pl-10 border ${errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} placeholder-gray-500 text-gray-900 dark:text-white dark:bg-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                  placeholder="Email address"
                  {...register('email', { required: 'Email is required' })}
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
            </div>

            <div>
              <Button
                type="submit"
                className="w-full justify-center"
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send reset link'}
              </Button>
            </div>

            <div className="text-center">
              <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 flex items-center justify-center">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default ForgotPasswordPage
