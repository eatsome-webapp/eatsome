'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { EyeIcon, EyeOffIcon, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { cn } from '../../lib/utils';

interface AuthCardProps {
  type?: 'login' | 'register' | 'resetPassword';
  title?: string;
  subtitle?: string;
  onSubmit?: (data: any) => void;
  isLoading?: boolean;
  error?: string;
  success?: string;
  redirectText?: string;
  redirectLink?: string;
  redirectLinkText?: string;
  className?: string;
}

export function AuthCard({
  type = 'login',
  title,
  subtitle,
  onSubmit,
  isLoading = false,
  error,
  success,
  redirectText,
  redirectLink,
  redirectLinkText,
  className,
}: AuthCardProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  
  // Generate title and subtitle based on type if not provided
  const getTitle = () => {
    if (title) return title;
    
    switch (type) {
      case 'login':
        return 'Welcome back';
      case 'register':
        return 'Create an account';
      case 'resetPassword':
        return 'Reset password';
      default:
        return 'Authentication';
    }
  };
  
  const getSubtitle = () => {
    if (subtitle) return subtitle;
    
    switch (type) {
      case 'login':
        return 'Enter your credentials to access your account';
      case 'register':
        return 'Fill in your details to create a new account';
      case 'resetPassword':
        return 'Enter your email to receive a password reset link';
      default:
        return '';
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (type === 'register' && formData.password !== formData.confirmPassword) {
      // Handle password mismatch
      return;
    }
    
    onSubmit?.(formData);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "bg-white rounded-xl shadow-card overflow-hidden w-full max-w-md",
        className
      )}
    >
      <div className="p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold text-slate-800">{getTitle()}</h2>
          <p className="text-slate-500 mt-1">{getSubtitle()}</p>
        </div>
        
        {/* Status messages */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-100 text-red-700 flex items-center">
            <XCircle className="h-5 w-5 mr-2 text-red-500" />
            <span className="text-sm">{error}</span>
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-100 text-green-700 flex items-center">
            <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
            <span className="text-sm">{success}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name field - only for register */}
          {type === 'register' && (
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
              />
            </div>
          )}
          
          {/* Email field */}
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              required
            />
          </div>
          
          {/* Password field - not for reset password */}
          {type !== 'resetPassword' && (
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="password">Password</Label>
                {type === 'login' && (
                  <a href="/forgot-password" className="text-xs text-secondary hover:underline">
                    Forgot password?
                  </a>
                )}
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                </button>
              </div>
            </div>
          )}
          
          {/* Confirm password - only for register */}
          {type === 'register' && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          )}
          
          {/* Submit button */}
          <Button 
            type="submit" 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                <span>
                  {type === 'login' ? 'Signing in...' : 
                   type === 'register' ? 'Creating account...' : 'Sending...'}
                </span>
              </div>
            ) : (
              <span>
                {type === 'login' ? 'Sign in' : 
                 type === 'register' ? 'Create account' : 'Send reset link'}
              </span>
            )}
          </Button>
        </form>
      </div>
      
      {/* Footer */}
      {redirectText && redirectLink && redirectLinkText && (
        <div className="py-4 px-6 bg-slate-50 border-t border-slate-100 text-center">
          <p className="text-sm text-slate-600">
            {redirectText}{' '}
            <a 
              href={redirectLink} 
              className="font-medium text-secondary hover:underline"
            >
              {redirectLinkText}
            </a>
          </p>
        </div>
      )}
    </motion.div>
  );
} 