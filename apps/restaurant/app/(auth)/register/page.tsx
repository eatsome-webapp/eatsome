'use client';

import { motion } from 'framer-motion';
import { RegisterForm } from '@/components/auth/register-form';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 p-4'>
      <div className='w-full max-w-xl'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='mb-6 text-center'
        >
          <h1 className='text-3xl font-bold text-zinc-900'>
            Join <span className='text-amber-500'>Eat</span>Some
          </h1>
          <p className='text-zinc-600 mt-2'>
            Start accepting online orders and grow your restaurant business
          </p>
        </motion.div>
        <RegisterForm onSuccess={() => router.push('/login')} />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className='mt-8 text-center'
        >
          <button
            onClick={() => router.push('/')}
            className='text-sm text-zinc-600 hover:text-amber-500'
          >
            ← Back to homepage
          </button>
        </motion.div>
      </div>
    </div>
  );
}
