'use client';

import { useState, FormEvent } from 'react';
import { useAuth } from '../context/auth-context';
import type { AuthError } from '@supabase/supabase-js';
import type { UserRole } from '../utils/roles';

interface AuthFormState {
  isLoading: boolean;
  error: string | null;
  success: string | null;
}

interface RegisterFormData {
  email: string;
  password: string;
  fullName?: string;
  role?: UserRole;
  metadata?: Record<string, any>;
}

interface LoginFormData {
  email: string;
  password: string;
}

interface PinLoginFormData {
  email: string;
  pin: string;
}

export function useAuthForm() {
  const auth = useAuth();
  const [formState, setFormState] = useState<AuthFormState>({
    isLoading: false,
    error: null,
    success: null,
  });

  const resetFormState = () => {
    setFormState({
      isLoading: false,
      error: null,
      success: null,
    });
  };

  const handleRegister = async (
    data: RegisterFormData,
    options?: {
      onSuccess?: (data: any) => void;
      onError?: (error: AuthError) => void;
      successMessage?: string;
    }
  ) => {
    try {
      setFormState({ isLoading: true, error: null, success: null });

      const { error } = await auth.signUp(data.email, data.password, {
        full_name: data.fullName,
        role: data.role || 'customer',
        metadata: data.metadata || {},
      });

      if (error) {
        setFormState({
          isLoading: false,
          error: error.message,
          success: null,
        });
        options?.onError?.(error);
        return;
      }

      setFormState({
        isLoading: false,
        error: null,
        success:
          options?.successMessage || 'Account created! Please check your email for verification.',
      });
      options?.onSuccess?.({});
    } catch (error) {
      setFormState({
        isLoading: false,
        error: 'An unexpected error occurred',
        success: null,
      });
      options?.onError?.(error as AuthError);
    }
  };

  const handleLogin = async (
    data: LoginFormData,
    options?: {
      onSuccess?: (data: any) => void;
      onError?: (error: AuthError) => void;
      successMessage?: string;
    }
  ) => {
    try {
      setFormState({ isLoading: true, error: null, success: null });

      const { error } = await auth.signIn(data.email, data.password);

      if (error) {
        setFormState({
          isLoading: false,
          error: error.message,
          success: null,
        });
        options?.onError?.(error);
        return;
      }

      setFormState({
        isLoading: false,
        error: null,
        success: options?.successMessage || 'Login successful!',
      });
      options?.onSuccess?.({});
    } catch (error) {
      setFormState({
        isLoading: false,
        error: 'An unexpected error occurred',
        success: null,
      });
      options?.onError?.(error as AuthError);
    }
  };

  const handlePinLogin = async (
    data: PinLoginFormData,
    options?: {
      onSuccess?: (data: any) => void;
      onError?: (error: AuthError) => void;
      successMessage?: string;
    }
  ) => {
    try {
      setFormState({ isLoading: true, error: null, success: null });

      const { error } = await auth.signInWithPin(data.email, data.pin);

      if (error) {
        setFormState({
          isLoading: false,
          error: error.message,
          success: null,
        });
        options?.onError?.(error);
        return;
      }

      setFormState({
        isLoading: false,
        error: null,
        success:
          options?.successMessage ||
          'PIN login successful! Please check your email for a one-time login link.',
      });
      options?.onSuccess?.({});
    } catch (error) {
      setFormState({
        isLoading: false,
        error: 'An unexpected error occurred',
        success: null,
      });
      options?.onError?.(error as AuthError);
    }
  };

  const handleOtpLogin = async (
    email: string,
    options?: {
      onSuccess?: (data: any) => void;
      onError?: (error: AuthError) => void;
      successMessage?: string;
    }
  ) => {
    try {
      setFormState({ isLoading: true, error: null, success: null });

      const { error } = await auth.signInWithOtp(email);

      if (error) {
        setFormState({
          isLoading: false,
          error: error.message,
          success: null,
        });
        options?.onError?.(error);
        return;
      }

      setFormState({
        isLoading: false,
        error: null,
        success: options?.successMessage || 'Check your email for a login link!',
      });
      options?.onSuccess?.({});
    } catch (error) {
      setFormState({
        isLoading: false,
        error: 'An unexpected error occurred',
        success: null,
      });
      options?.onError?.(error as AuthError);
    }
  };

  const handleResetPassword = async (
    email: string,
    options?: {
      onSuccess?: (data: any) => void;
      onError?: (error: AuthError) => void;
      successMessage?: string;
    }
  ) => {
    try {
      setFormState({ isLoading: true, error: null, success: null });

      const { error } = await auth.resetPassword(email);

      if (error) {
        setFormState({
          isLoading: false,
          error: error.message,
          success: null,
        });
        options?.onError?.(error);
        return;
      }

      setFormState({
        isLoading: false,
        error: null,
        success: options?.successMessage || 'Password reset email sent. Check your inbox!',
      });
      options?.onSuccess?.({});
    } catch (error) {
      setFormState({
        isLoading: false,
        error: 'An unexpected error occurred',
        success: null,
      });
      options?.onError?.(error as AuthError);
    }
  };

  const handleUpdatePassword = async (
    password: string,
    options?: {
      onSuccess?: (data: any) => void;
      onError?: (error: AuthError) => void;
      successMessage?: string;
    }
  ) => {
    try {
      setFormState({ isLoading: true, error: null, success: null });

      const { error } = await auth.updatePassword(password);

      if (error) {
        setFormState({
          isLoading: false,
          error: error.message,
          success: null,
        });
        options?.onError?.(error);
        return;
      }

      setFormState({
        isLoading: false,
        error: null,
        success: options?.successMessage || 'Password updated successfully!',
      });
      options?.onSuccess?.({});
    } catch (error) {
      setFormState({
        isLoading: false,
        error: 'An unexpected error occurred',
        success: null,
      });
      options?.onError?.(error as AuthError);
    }
  };

  const getAuthFormProps = <T extends HTMLFormElement>(
    handleSubmit: (e: FormEvent<T>) => Promise<void>
  ) => {
    return {
      onSubmit: async (e: FormEvent<T>) => {
        e.preventDefault();
        await handleSubmit(e);
      },
      state: formState,
      resetState: resetFormState,
    };
  };

  return {
    formState,
    resetFormState,
    handleRegister,
    handleLogin,
    handlePinLogin,
    handleOtpLogin,
    handleResetPassword,
    handleUpdatePassword,
    getAuthFormProps,
  };
}
