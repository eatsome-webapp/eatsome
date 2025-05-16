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
import Link from 'next/link';

// Import de nieuwe Tailwind v4 syntax
import '@/styles/tailwind.css';

type RestaurantRegisterFormProps = {
  redirectPath?: string;
  onSuccess?: () => void;
};

export function RegisterForm({ redirectPath, onSuccess }: RestaurantRegisterFormProps) {
  const {
    formState: { isLoading, error, success },
    handleRegister,
    resetFormState,
  } = useAuthForm();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    restaurantName: '',
    cuisine: '',
    phoneNumber: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Netherlands',
    termsAccepted: false,
  });

  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [step, setStep] = useState<1 | 2>(1);

  const updateFormData = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Validate password match when updating either password field
    if (field === 'password' || field === 'confirmPassword') {
      if (field === 'password' && formData.confirmPassword && formData.confirmPassword !== value) {
        setPasswordError('Passwords do not match');
      } else if (field === 'confirmPassword' && formData.password !== value) {
        setPasswordError('Passwords do not match');
      } else {
        setPasswordError(null);
      }
    }
  };

  const validateStep1 = () => {
    if (!formData.email || !formData.password || !formData.confirmPassword || !formData.fullName) {
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Passwords do not match');
      return false;
    }

    if (formData.password.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.termsAccepted) {
      return;
    }

    await handleRegister(
      {
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        role: 'restaurant_admin',
        metadata: {
          restaurantName: formData.restaurantName,
          cuisine: formData.cuisine,
          phoneNumber: formData.phoneNumber,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          country: formData.country,
          applicationDate: new Date().toISOString(),
          status: 'pending', // Approval status
        },
      },
      {
        onSuccess: () => {
          onSuccess?.();
        },
        successMessage:
          'Registration successful! Our team will review your application and contact you soon.',
      }
    );
  };

  const handleNextStep = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handlePreviousStep = () => {
    setStep(1);
    resetFormState();
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5 },
    },
    exit: { opacity: 0 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial='hidden'
      animate='visible'
      exit='exit'
      className='w-full max-w-md'
    >
      <Card className='border border-zinc-200 shadow-xl bg-white'>
        <CardHeader className='space-y-1'>
          <CardTitle className='text-2xl font-bold text-zinc-900 text-center'>
            Partner Registration
          </CardTitle>
          <CardDescription className='text-center text-zinc-500'>
            {step === 1
              ? 'Create your restaurant partner account'
              : 'Tell us about your restaurant'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className='space-y-4'>
            {step === 1 ? (
              <>
                <div className='space-y-2'>
                  <label htmlFor='email' className='block text-sm font-medium text-gray-700'>
                    Email
                  </label>
                  <Input
                    id='email'
                    type='email'
                    placeholder='restaurant@example.com'
                    value={formData.email}
                    onChange={(e) => updateFormData('email', e.target.value)}
                    required
                    className='border-zinc-300 focus:border-amber-500 focus:ring-amber-500'
                  />
                </div>

                <div className='space-y-2'>
                  <label htmlFor='fullName' className='block text-sm font-medium text-gray-700'>
                    Full Name
                  </label>
                  <Input
                    id='fullName'
                    type='text'
                    placeholder='Your full name'
                    value={formData.fullName}
                    onChange={(e) => updateFormData('fullName', e.target.value)}
                    required
                    className='border-zinc-300 focus:border-amber-500 focus:ring-amber-500'
                  />
                </div>

                <div className='space-y-2'>
                  <label htmlFor='password' className='block text-sm font-medium text-gray-700'>
                    Password
                  </label>
                  <Input
                    id='password'
                    type='password'
                    placeholder='Create a password'
                    value={formData.password}
                    onChange={(e) => updateFormData('password', e.target.value)}
                    required
                    minLength={8}
                    className='border-zinc-300 focus:border-amber-500 focus:ring-amber-500'
                  />
                  <p className='text-xs text-zinc-500'>Password must be at least 8 characters</p>
                </div>

                <div className='space-y-2'>
                  <label
                    htmlFor='confirmPassword'
                    className='block text-sm font-medium text-gray-700'
                  >
                    Confirm Password
                  </label>
                  <Input
                    id='confirmPassword'
                    type='password'
                    placeholder='Confirm your password'
                    value={formData.confirmPassword}
                    onChange={(e) => updateFormData('confirmPassword', e.target.value)}
                    required
                    className='border-zinc-300 focus:border-amber-500 focus:ring-amber-500'
                  />
                  {passwordError && <p className='text-xs text-red-500'>{passwordError}</p>}
                </div>

                <Button
                  type='button'
                  onClick={handleNextStep}
                  disabled={!validateStep1()}
                  className='w-full bg-amber-500 hover:bg-amber-600 text-white font-medium'
                >
                  Continue
                </Button>
              </>
            ) : (
              <>
                <div className='space-y-2'>
                  <label
                    htmlFor='restaurantName'
                    className='block text-sm font-medium text-gray-700'
                  >
                    Restaurant Name
                  </label>
                  <Input
                    id='restaurantName'
                    type='text'
                    placeholder='Your restaurant name'
                    value={formData.restaurantName}
                    onChange={(e) => updateFormData('restaurantName', e.target.value)}
                    required
                    className='border-zinc-300 focus:border-amber-500 focus:ring-amber-500'
                  />
                </div>

                <div className='space-y-2'>
                  <label htmlFor='cuisine' className='block text-sm font-medium text-gray-700'>
                    Cuisine Type
                  </label>
                  <select
                    id='cuisine'
                    value={formData.cuisine}
                    onChange={(e) => updateFormData('cuisine', e.target.value)}
                    className='mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm rounded-md'
                    required
                  >
                    <option value='' disabled>
                      Select cuisine type
                    </option>
                    <option value='italian'>Italian</option>
                    <option value='thai'>Thai</option>
                    <option value='indian'>Indian</option>
                    <option value='chinese'>Chinese</option>
                    <option value='japanese'>Japanese</option>
                    <option value='mexican'>Mexican</option>
                    <option value='french'>French</option>
                    <option value='dutch'>Dutch</option>
                    <option value='other'>Other</option>
                  </select>
                </div>

                <div className='space-y-2'>
                  <label htmlFor='phoneNumber' className='block text-sm font-medium text-gray-700'>
                    Phone Number
                  </label>
                  <Input
                    id='phoneNumber'
                    type='tel'
                    placeholder='+31 6 12345678'
                    value={formData.phoneNumber}
                    onChange={(e) => updateFormData('phoneNumber', e.target.value)}
                    required
                    className='border-zinc-300 focus:border-amber-500 focus:ring-amber-500'
                  />
                </div>

                <div className='space-y-2'>
                  <label htmlFor='address' className='block text-sm font-medium text-gray-700'>
                    Address
                  </label>
                  <Input
                    id='address'
                    type='text'
                    placeholder='Street, number'
                    value={formData.address}
                    onChange={(e) => updateFormData('address', e.target.value)}
                    required
                    className='border-zinc-300 focus:border-amber-500 focus:ring-amber-500'
                  />
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <label htmlFor='postalCode' className='block text-sm font-medium text-gray-700'>
                      Postal Code
                    </label>
                    <Input
                      id='postalCode'
                      type='text'
                      placeholder='1234 AB'
                      value={formData.postalCode}
                      onChange={(e) => updateFormData('postalCode', e.target.value)}
                      required
                      className='border-zinc-300 focus:border-amber-500 focus:ring-amber-500'
                    />
                  </div>
                  <div className='space-y-2'>
                    <label htmlFor='city' className='block text-sm font-medium text-gray-700'>
                      City
                    </label>
                    <Input
                      id='city'
                      type='text'
                      placeholder='Amsterdam'
                      value={formData.city}
                      onChange={(e) => updateFormData('city', e.target.value)}
                      required
                      className='border-zinc-300 focus:border-amber-500 focus:ring-amber-500'
                    />
                  </div>
                </div>

                <div className='flex items-center space-x-2 pt-2'>
                  <Checkbox
                    id='terms'
                    checked={formData.termsAccepted}
                    onCheckedChange={(checked) => updateFormData('termsAccepted', checked === true)}
                    required
                  />
                  <label htmlFor='terms' className='text-sm text-zinc-600'>
                    I agree to the{' '}
                    <Link href='/terms' className='text-amber-600 hover:text-amber-800'>
                      terms and conditions
                    </Link>
                  </label>
                </div>

                <div className='flex space-x-3 pt-2'>
                  <Button
                    type='button'
                    onClick={handlePreviousStep}
                    className='flex-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-800'
                  >
                    Back
                  </Button>
                  <Button
                    type='submit'
                    disabled={isLoading || !formData.termsAccepted}
                    className='flex-1 bg-amber-500 hover:bg-amber-600 text-white font-medium'
                  >
                    {isLoading ? 'Registering...' : 'Register'}
                  </Button>
                </div>
              </>
            )}
          </form>

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
            Already have an account?{' '}
            <Link href='/login' className='text-amber-600 hover:text-amber-800 font-medium'>
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
