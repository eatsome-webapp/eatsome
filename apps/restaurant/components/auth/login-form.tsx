'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthForm } from 'auth';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Button,
  Input,
  Checkbox,
} from 'ui';
import { LockIcon, MailIcon, KeyIcon } from 'lucide-react';
import Link from 'next/link';

// Import de nieuwe Tailwind v4 syntax
import '@/styles/tailwind.css';

type LoginTab = 'email' | 'pin' | 'magic';

export function LoginForm() {
  const {
    formState: { isLoading, error, success },
    handleLogin,
    handlePinLogin,
    handleOtpLogin,
    resetFormState,
  } = useAuthForm();
  const [activeTab, setActiveTab] = useState<LoginTab>('email');
  const [emailPassword, setEmailPassword] = useState({ email: '', password: '' });
  const [pinLogin, setPinLogin] = useState({ email: '', pin: '' });
  const [magicLinkEmail, setMagicLinkEmail] = useState('');

  const handleTabChange = (value: LoginTab) => {
    setActiveTab(value);
    resetFormState();
  };

  const handleEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await handleLogin(emailPassword, {
      onSuccess: () => {
        // Het succes wordt automatisch afgehandeld door redirect naar dashboard
      },
    });
  };

  const handlePinSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await handlePinLogin(pinLogin, {
      successMessage: 'PIN code verified. Please check your email for a login link.',
    });
  };

  const handleMagicLinkSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await handleOtpLogin(magicLinkEmail, {
      successMessage: 'Magic link sent! Please check your email.',
    });
  };

  // Animation variants for Framer Motion
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
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
          <CardTitle className='text-2xl font-bold text-zinc-900 text-center'>
            Restaurant Portal
          </CardTitle>
          <CardDescription className='text-center text-zinc-500'>
            Choose how you want to sign in
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='mb-6'>
            <div className='flex border-b border-gray-200'>
              <button
                onClick={() => handleTabChange('email')}
                className={`flex items-center px-4 py-2 border-b-2 font-medium text-sm ${
                  activeTab === 'email'
                    ? 'border-amber-500 text-amber-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <MailIcon className='w-4 h-4 mr-2' />
                Email
              </button>
              <button
                onClick={() => handleTabChange('pin')}
                className={`flex items-center px-4 py-2 border-b-2 font-medium text-sm ${
                  activeTab === 'pin'
                    ? 'border-amber-500 text-amber-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <KeyIcon className='w-4 h-4 mr-2' />
                PIN Code
              </button>
              <button
                onClick={() => handleTabChange('magic')}
                className={`flex items-center px-4 py-2 border-b-2 font-medium text-sm ${
                  activeTab === 'magic'
                    ? 'border-amber-500 text-amber-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <LockIcon className='w-4 h-4 mr-2' />
                Magic Link
              </button>
            </div>
          </div>

          {/* Email/Password Login */}
          {activeTab === 'email' && (
            <form onSubmit={handleEmailSubmit} className='space-y-4'>
              <div className='space-y-2'>
                <label htmlFor='email' className='block text-sm font-medium text-gray-700'>
                  Email
                </label>
                <Input
                  id='email'
                  type='email'
                  placeholder='your@email.com'
                  value={emailPassword.email}
                  onChange={(e) => setEmailPassword((prev) => ({ ...prev, email: e.target.value }))}
                  required
                  className='border-zinc-300 focus:border-amber-500 focus:ring-amber-500'
                />
              </div>

              <div className='space-y-2'>
                <div className='flex items-center justify-between'>
                  <label htmlFor='password' className='block text-sm font-medium text-gray-700'>
                    Password
                  </label>
                  <Link
                    href='/auth/reset-password'
                    className='text-xs text-amber-600 hover:text-amber-800'
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id='password'
                  type='password'
                  placeholder='••••••••'
                  value={emailPassword.password}
                  onChange={(e) =>
                    setEmailPassword((prev) => ({ ...prev, password: e.target.value }))
                  }
                  required
                  className='border-zinc-300 focus:border-amber-500 focus:ring-amber-500'
                />
              </div>

              <div className='flex items-center space-x-2'>
                <Checkbox id='remember' />
                <label htmlFor='remember' className='text-sm text-zinc-600'>
                  Remember me for 30 days
                </label>
              </div>

              <Button
                type='submit'
                disabled={isLoading}
                className='w-full bg-amber-500 hover:bg-amber-600 text-white font-medium'
              >
                {isLoading ? (
                  <span className='flex items-center justify-center'>
                    <svg
                      className='animate-spin -ml-1 mr-2 h-4 w-4 text-white'
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                    >
                      <circle
                        className='opacity-25'
                        cx='12'
                        cy='12'
                        r='10'
                        stroke='currentColor'
                        strokeWidth='4'
                      ></circle>
                      <path
                        className='opacity-75'
                        fill='currentColor'
                        d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                      ></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  'Sign in'
                )}
              </Button>
            </form>
          )}

          {/* PIN Code Login (voor staff) */}
          {activeTab === 'pin' && (
            <form onSubmit={handlePinSubmit} className='space-y-4'>
              <div className='space-y-2'>
                <label htmlFor='staff-email' className='block text-sm font-medium text-gray-700'>
                  Staff Email
                </label>
                <Input
                  id='staff-email'
                  type='email'
                  placeholder='staff@restaurant.com'
                  value={pinLogin.email}
                  onChange={(e) => setPinLogin((prev) => ({ ...prev, email: e.target.value }))}
                  required
                  className='border-zinc-300 focus:border-amber-500 focus:ring-amber-500'
                />
              </div>

              <div className='space-y-2'>
                <label htmlFor='pin-code' className='block text-sm font-medium text-gray-700'>
                  PIN Code
                </label>
                <Input
                  id='pin-code'
                  type='password'
                  placeholder='Enter your PIN'
                  value={pinLogin.pin}
                  onChange={(e) => setPinLogin((prev) => ({ ...prev, pin: e.target.value }))}
                  required
                  maxLength={6}
                  className='border-zinc-300 focus:border-amber-500 focus:ring-amber-500 text-center text-lg tracking-widest'
                />
              </div>

              <Button
                type='submit'
                disabled={isLoading}
                className='w-full bg-amber-500 hover:bg-amber-600 text-white font-medium'
              >
                {isLoading ? 'Verifying PIN...' : 'Continue with PIN'}
              </Button>

              <p className='text-xs text-zinc-500 text-center px-6'>
                This option is for staff members who have been assigned a PIN code by their manager
              </p>
            </form>
          )}

          {/* Magic Link Login */}
          {activeTab === 'magic' && (
            <form onSubmit={handleMagicLinkSubmit} className='space-y-4'>
              <div className='space-y-2'>
                <label htmlFor='magic-email' className='block text-sm font-medium text-gray-700'>
                  Email Address
                </label>
                <Input
                  id='magic-email'
                  type='email'
                  placeholder='your@email.com'
                  value={magicLinkEmail}
                  onChange={(e) => setMagicLinkEmail(e.target.value)}
                  required
                  className='border-zinc-300 focus:border-amber-500 focus:ring-amber-500'
                />
              </div>

              <Button
                type='submit'
                disabled={isLoading}
                className='w-full bg-amber-500 hover:bg-amber-600 text-white font-medium'
              >
                {isLoading ? 'Sending...' : 'Send Magic Link'}
              </Button>

              <p className='text-xs text-zinc-500 text-center px-6'>
                We'll email you a magic link for a password-free sign in
              </p>
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
          <p className='text-sm text-zinc-500'>
            Not a partner yet?{' '}
            <a href='#become-a-partner' className='text-amber-600 hover:text-amber-800 font-medium'>
              Apply to become a partner
            </a>
          </p>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
