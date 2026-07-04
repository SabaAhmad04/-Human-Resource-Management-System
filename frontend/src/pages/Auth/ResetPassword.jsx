import React, { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { Lock, ArrowLeft, Check } from 'lucide-react'
import toast from 'react-hot-toast'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import { resetPassword, clearError, clearMessage } from '../../redux/authSlice'

const ResetPassword = () => {
  const { token } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { loading, error, message } = useSelector((state) => state.auth)
  
  const { register, handleSubmit, formState: { errors }, watch } = useForm()
  const password = watch('password')

  useEffect(() => {
    if (error) {
      toast.error(error)
      dispatch(clearError())
    }
  }, [error, dispatch])

  useEffect(() => {
    if (message) {
      toast.success(message)
      dispatch(clearMessage())
      navigate('/login')
    }
  }, [message, dispatch, navigate])

  const onSubmit = (data) => {
    dispatch(resetPassword({ token, password: data.password }))
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
          Reset your password
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Enter your new password below
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
              label="New Password"
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
              <Check size={18} className="mr-2" />
              Reset Password
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}

export default ResetPassword
