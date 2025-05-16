'use client';

import { motion } from 'framer-motion';
import { LoginForm } from '@/components/auth/login-form';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 p-4'>
      <div className='w-full max-w-md'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='mb-6 text-center'
        >
          <h1 className='text-3xl font-bold text-brand-black'>
            <span className='text-brand-yellow'>Eat</span>Some
          </h1>
          <p className='text-gray-600 mt-2'>Restaurant Partner Portal</p>
        </motion.div>
        <LoginForm />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className='mt-8 text-center'
        >
          <button
            onClick={() => router.push('/')}
            className='text-sm text-gray-600 hover:text-brand-yellow'
          >
            ← Back to homepage
          </button>
        </motion.div>
      </div>
    </div>
  );
}
