'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthForm } from 'auth';
import { useSearchParams } from 'next/navigation';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Button,
  Input,
} from 'ui';
import Link from 'next/link';
import { LockIcon } from 'lucide-react';

// Import de nieuwe Tailwind v4 syntax
import '@/styles/tailwind.css';

type ResetPasswordFormProps = {
  onSuccess?: () => void;
};

export function ResetPasswordForm({ onSuccess }: ResetPasswordFormProps) {
  const searchParams = useSearchParams();
  const isTokenPresent = searchParams?.has('token');

  const {
    formState: { isLoading, error, success },
    handleResetPassword,
    handleUpdatePassword,
    resetFormState,
  } = useAuthForm();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    validatePasswords(e.target.value, confirmPassword);
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    validatePasswords(password, e.target.value);
  };

  const validatePasswords = (pass: string, confirm: string) => {
    if (confirm && pass !== confirm) {
      setPasswordError('Passwords do not match');
    } else if (pass.length > 0 && pass.length < 8) {
      setPasswordError('Password must be at least 8 characters');
    } else {
      setPasswordError(null);
    }
  };

  const handleSubmitRequestReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await handleResetPassword(email, {
      onSuccess: () => {
        onSuccess?.();
      },
      successMessage: 'Password reset link sent! Please check your email.',
    });
  };

  const handleSubmitUpdatePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    await handleUpdatePassword(password, {
      onSuccess: () => {
        onSuccess?.();
      },
      successMessage:
        'Your password has been updated successfully! You can now log in with your new password.',
    });
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial='hidden'
      animate='visible'
      className='w-full max-w-md'
    >
      <Card className='border border-zinc-200 shadow-xl bg-white'>
        <CardHeader className='space-y-1'>
          <div className='mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100'>
            <LockIcon className='h-6 w-6 text-amber-600' />
          </div>
          <CardTitle className='text-2xl font-bold text-zinc-900 text-center'>
            {isTokenPresent ? 'Update Password' : 'Reset Password'}
          </CardTitle>
          <CardDescription className='text-center text-zinc-500'>
            {isTokenPresent
              ? 'Enter your new password below'
              : 'Enter your email to receive a password reset link'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isTokenPresent ? (
            <form onSubmit={handleSubmitUpdatePassword} className='space-y-4'>
              <div className='space-y-2'>
                <label htmlFor='new-password' className='block text-sm font-medium text-gray-700'>
                  New Password
                </label>
                <Input
                  id='new-password'
                  type='password'
                  placeholder='••••••••'
                  value={password}
                  onChange={handlePasswordChange}
                  required
                  minLength={8}
                  className='border-zinc-300 focus:border-amber-500 focus:ring-amber-500'
                />
                <p className='text-xs text-zinc-500'>Password must be at least 8 characters</p>
              </div>

              <div className='space-y-2'>
                <label
                  htmlFor='confirm-password'
                  className='block text-sm font-medium text-gray-700'
                >
                  Confirm Password
                </label>
                <Input
                  id='confirm-password'
                  type='password'
                  placeholder='••••••••'
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  required
                  className='border-zinc-300 focus:border-amber-500 focus:ring-amber-500'
                />
                {passwordError && <p className='text-xs text-red-500'>{passwordError}</p>}
              </div>

              <Button
                type='submit'
                disabled={isLoading || !!passwordError || !password || !confirmPassword}
                className='w-full bg-amber-500 hover:bg-amber-600 text-white font-medium'
              >
                {isLoading ? 'Updating Password...' : 'Update Password'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleSubmitRequestReset} className='space-y-4'>
              <div className='space-y-2'>
                <label htmlFor='email' className='block text-sm font-medium text-gray-700'>
                  Email
                </label>
                <Input
                  id='email'
                  type='email'
                  placeholder='your@email.com'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className='border-zinc-300 focus:border-amber-500 focus:ring-amber-500'
                />
              </div>

              <Button
                type='submit'
                disabled={isLoading || !email}
                className='w-full bg-amber-500 hover:bg-amber-600 text-white font-medium'
              >
                {isLoading ? 'Sending Link...' : 'Send Reset Link'}
              </Button>
            </form>
          )}

          {error && (
            <div className='mt-4 p-3 border border-red-200 bg-red-50 text-red-800 rounded-md'>
              <h4 className='text-sm font-semibold'>Error</h4>
              <p className='text-sm'>{error}</p>
            </div>
          )}

          {success && (
            <div className='mt-4 p-3 border border-green-200 bg-green-50 text-green-800 rounded-md'>
              <h4 className='text-sm font-semibold'>Success</h4>
              <p className='text-sm'>{success}</p>
            </div>
          )}
        </CardContent>
        <CardFooter className='justify-center'>
          <div className='text-sm text-zinc-500'>
            Remember your password?{' '}
            <Link href='/login' className='text-amber-600 hover:text-amber-800 font-medium'>
              Back to login
            </Link>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
