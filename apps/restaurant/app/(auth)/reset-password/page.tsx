'use client';

import { motion } from 'framer-motion';
import { ResetPasswordForm } from '@/components/auth/reset-password-form';
import { useRouter } from 'next/navigation';

export default function ResetPasswordPage() {
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
          <h1 className='text-3xl font-bold text-zinc-900'>
            <span className='text-amber-500'>Eat</span>Some
          </h1>
          <p className='text-zinc-600 mt-2'>Restaurant Partner Portal</p>
        </motion.div>
        <ResetPasswordForm onSuccess={() => setTimeout(() => router.push('/login'), 3000)} />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className='mt-8 text-center'
        >
          <button
            onClick={() => router.push('/login')}
            className='text-sm text-zinc-600 hover:text-amber-500'
          >
            ← Back to login
          </button>
        </motion.div>
      </div>
    </div>
  );
}
