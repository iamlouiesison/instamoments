'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PasswordStrength } from '@/components/ui/password-strength';
import { signUpSchema, type SignUpFormData } from '@/lib/validations/auth';
import { signUpAction } from '@/lib/auth-actions';

export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError,
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const password = watch('password');

  const onSubmit = async (data: SignUpFormData) => {
    setIsLoading(true);
    setMessage(null);

    try {
      const result = await signUpAction(data);

      if (result.success) {
        setMessage({ type: 'success', text: result.message || 'Account created successfully!' });
        // Redirect to sign in page after successful sign up
        setTimeout(() => {
          window.location.href = '/auth/signin';
        }, 3000);
      } else {
        const errorMessage = result.error || 'An unexpected error occurred';
        setMessage({ type: 'error', text: errorMessage });
        // Set field-specific errors if available
        if (errorMessage.includes('email')) {
          setError('email', { message: errorMessage });
        } else if (errorMessage.includes('password')) {
          setError('password', { message: errorMessage });
        } else if (errorMessage.includes('full name')) {
          setError('full_name', { message: errorMessage });
        }
      }
    } catch {
      setMessage({ 
        type: 'error', 
        text: 'An unexpected error occurred. Please try again.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-8">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-bold text-blue-600">InstaMoments</h1>
          </Link>
          <p className="mt-2 text-gray-600">
            Create your account to start capturing memories
          </p>
        </div>

        {/* Sign Up Form */}
        <Card className="shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Create Your Account
            </CardTitle>
            <CardDescription className="text-center">
              Join 500+ Filipino event hosts
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Full Name Field */}
              <div className="space-y-2">
                <label htmlFor="full_name" className="text-sm font-medium text-gray-700">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <Input
                  id="full_name"
                  type="text"
                  placeholder="Enter your full name"
                  aria-describedby="full_name-error"
                  aria-invalid={!!errors.full_name}
                  {...register('full_name')}
                  className={errors.full_name ? 'border-red-500 focus:ring-red-500' : ''}
                />
                {errors.full_name && (
                  <p id="full_name-error" className="text-sm text-red-600">
                    {errors.full_name.message}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  aria-describedby="email-error"
                  aria-invalid={!!errors.email}
                  {...register('email')}
                  className={errors.email ? 'border-red-500 focus:ring-red-500' : ''}
                />
                {errors.email && (
                  <p id="email-error" className="text-sm text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Phone Field */}
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium text-gray-700">
                  Phone Number (Optional)
                </label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+63 9XX XXX XXXX"
                  aria-describedby="phone-error"
                  aria-invalid={!!errors.phone}
                  {...register('phone')}
                  className={errors.phone ? 'border-red-500 focus:ring-red-500' : ''}
                />
                {errors.phone && (
                  <p id="phone-error" className="text-sm text-red-600">
                    {errors.phone.message}
                  </p>
                )}
                <p className="text-xs text-gray-500">
                  For payment verification and support
                </p>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a strong password"
                    aria-describedby="password-error password-strength"
                    aria-invalid={!!errors.password}
                    {...register('password')}
                    className={errors.password ? 'border-red-500 focus:ring-red-500 pr-10' : 'pr-10'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p id="password-error" className="text-sm text-red-600">
                    {errors.password.message}
                  </p>
                )}
                {password && <PasswordStrength password={password} />}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <label htmlFor="confirm_password" className="text-sm font-medium text-gray-700">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Input
                    id="confirm_password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    aria-describedby="confirm_password-error"
                    aria-invalid={!!errors.confirm_password}
                    {...register('confirm_password')}
                    className={errors.confirm_password ? 'border-red-500 focus:ring-red-500 pr-10' : 'pr-10'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.confirm_password && (
                  <p id="confirm_password-error" className="text-sm text-red-600">
                    {errors.confirm_password.message}
                  </p>
                )}
              </div>

              {/* Terms and Marketing Consent */}
              <div className="space-y-3">
                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    {...register('terms_accepted')}
                    className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    aria-describedby="terms-error"
                    aria-invalid={!!errors.terms_accepted}
                  />
                  <div className="text-sm text-gray-700">
                    <span>I agree to the </span>
                    <Link
                      href="/terms"
                      className="text-blue-600 hover:text-blue-500 hover:underline"
                      target="_blank"
                    >
                      Terms of Service
                    </Link>
                    <span> and </span>
                    <Link
                      href="/privacy"
                      className="text-blue-600 hover:text-blue-500 hover:underline"
                      target="_blank"
                    >
                      Privacy Policy
                    </Link>
                    <span className="text-red-500"> *</span>
                  </div>
                </label>
                {errors.terms_accepted && (
                  <p id="terms-error" className="text-sm text-red-600 ml-6">
                    {errors.terms_accepted.message}
                  </p>
                )}

                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    {...register('marketing_consent')}
                    className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="text-sm text-gray-700">
                    I&apos;d like to receive updates about new features and promotions
                  </div>
                </label>
              </div>

              {/* Message Display */}
              {message && (
                <div
                  className={`p-3 rounded-md text-sm ${
                    message.type === 'success'
                      ? 'bg-green-50 text-green-800 border border-green-200'
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}
                >
                  {message.text}
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
                aria-describedby="submit-status"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>
              <div id="submit-status" className="sr-only">
                {isLoading ? 'Creating account...' : 'Ready to create account'}
              </div>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">Already have an account?</span>
              </div>
            </div>

            {/* Sign In Link */}
            <div className="text-center">
              <Link
                href="/auth/signin"
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Sign In to Your Account
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          <p>
            Free tier available • No credit card required • 
            <span className="ml-1">Average 85% guest participation rate</span>
          </p>
        </div>
      </div>
    </div>
  );
}
