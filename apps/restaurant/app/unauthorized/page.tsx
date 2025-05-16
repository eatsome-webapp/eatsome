'use client';

import { Button } from 'ui';
import { motion } from 'framer-motion';
import { useAuth } from 'auth';
import { useRouter } from 'next/navigation';

export default function Unauthorized() {
  const { signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 px-4'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='max-w-md w-full text-center p-8 bg-white rounded-xl shadow-lg'
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className='w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-12 w-12 text-red-500'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M12 15v2m0 0V9m0 6h.01M12 3a9 9 0 110 18 9 9 0 010-18z'
            />
          </svg>
        </motion.div>

        <h1 className='text-2xl font-bold text-gray-900 mb-3'>Access Denied</h1>

        <p className='text-gray-600 mb-6'>
          You don't have the required permissions to access this page. Please contact your
          administrator if you believe this is a mistake.
        </p>

        <div className='space-y-3'>
          <Button
            onClick={() => router.push('/')}
            className='w-full bg-brand-yellow hover:bg-brand-yellow/90 text-brand-black'
          >
            Return to Home
          </Button>

          <Button
            onClick={handleSignOut}
            variant='outline'
            className='w-full border-gray-300 text-gray-700 hover:bg-gray-50'
          >
            Sign Out
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
