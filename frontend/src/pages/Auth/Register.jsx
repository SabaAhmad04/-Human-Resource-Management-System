import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { Mail, Lock, User, UserPlus } from 'lucide-react'
import toast from 'react-hot-toast'
import Input from '../../components/common/Input'
import Select from '../../components/common/Select'
import Button from '../../components/common/Button'
import { register as registerUser, clearError } from '../../redux/authSlice'

const Register = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error, user, token } = useSelector((state) => state.auth)
  
  const { register, handleSubmit, formState: { errors }, watch } = useForm()
  const password = watch('password')

  useEffect(() => {
    if (token && user) {
      navigate('/employee/dashboard')
    }
  }, [token, user, navigate])

  useEffect(() => {
    if (error) {
      toast.error(error)
      dispatch(clearError())
    }
  }, [error, dispatch])

  const onSubmit = (data) => {
    dispatch(registerUser(data))
  }

  const roleOptions = [
    { value: 'employee', label: 'Employee' },
    { value: 'hr_manager', label: 'HR Manager' },
  ]

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
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
            Sign in
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
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                icon={User}
                error={errors.firstName?.message}
                {...register('firstName', {
                  required: 'First name is required'
                })}
              />

              <Input
                label="Last Name"
                icon={User}
                error={errors.lastName?.message}
                {...register('lastName', {
                  required: 'Last name is required'
                })}
              />
            </div>

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

            <Select
              label="Role"
              options={roleOptions}
              error={errors.role?.message}
              {...register('role', {
                required: 'Role is required'
              })}
            />

            <Input
              label="Password"
              type="password"
              icon={Lock}
              error={errors.password?.message}
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters'
                }
              })}
            />

            <Input
              label="Confirm Password"
              type="password"
              icon={Lock}
              error={errors.confirmPassword?.message}
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: value => value === password || 'Passwords do not match'
              })}
            />

            <Button
              type="submit"
              loading={loading}
              className="w-full"
              size="lg"
            >
              <UserPlus size={18} className="mr-2" />
              Create Account
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}

export default Register
