import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { Mail, Lock, LogIn } from 'lucide-react'
import toast from 'react-hot-toast'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import { login, clearError } from '../../redux/authSlice'

const Login = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error, user, token } = useSelector((state) => state.auth)
  
  const { register, handleSubmit, formState: { errors } } = useForm()

  useEffect(() => {
    if (token && user) {
      const dashboardPath = user.role === 'super_admin' ? '/admin/dashboard' 
        : user.role === 'hr_manager' ? '/hr/dashboard' 
        : '/employee/dashboard'
      navigate(dashboardPath)
    }
  }, [token, user, navigate])

  useEffect(() => {
    if (error) {
      toast.error(error)
      dispatch(clearError())
    }
  }, [error, dispatch])

  const onSubmit = (data) => {
    dispatch(login(data))
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-2xl">H</span>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
            create a new account
          </Link>
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <Input
              label="Email address"
              type="email"
              icon={Mail}
              error={errors.email?.message}
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: 'Invalid email address'
                }
              })}
            />

            <Input
              label="Password"
              type="password"
              icon={Lock}
              error={errors.password?.message}
              {...register('password', {
                required: 'Password is required'
              })}
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link to="/forgot-password" className="font-medium text-primary-600 hover:text-primary-500">
                  Forgot your password?
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              loading={loading}
              className="w-full"
              size="lg"
            >
              <LogIn size={18} className="mr-2" />
              Sign in
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}

export default Login
