import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, User, Loader2 } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const registerSchema = loginSchema.extend({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

interface AuthFormProps {
  isLogin: boolean;
  onSubmit: (data: any) => Promise<void>;
  isLoading: boolean;
}

export const AuthForm: React.FC<AuthFormProps> = ({ isLogin, onSubmit, isLoading }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(isLogin ? loginSchema : registerSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm text-gray-400">Email</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            {...register('email')}
            type="email"
            className="w-full bg-[#2b2b2b] rounded px-10 py-3 focus:outline-none focus:ring-2 focus:ring-red-600"
            placeholder="Enter your email"
          />
        </div>
        {errors.email && (
          <p className="text-sm text-red-600">
            {errors.email.message as string}
          </p>
        )}
      </div>

      {!isLogin && (
        <div className="space-y-2">
          <label className="text-sm text-gray-400">Username</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              {...register('username')}
              type="text"
              className="w-full bg-[#2b2b2b] rounded px-10 py-3 focus:outline-none focus:ring-2 focus:ring-red-600"
              placeholder="Choose a username"
            />
          </div>
          {errors.username && (
            <p className="text-sm text-red-600">
              {errors.username.message as string}
            </p>
          )}
        </div>
      )}

      <div className="space-y-2">
        <label className="text-sm text-gray-400">Password</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            {...register('password')}
            type="password"
            className="w-full bg-[#2b2b2b] rounded px-10 py-3 focus:outline-none focus:ring-2 focus:ring-red-600"
            placeholder="Enter your password"
          />
        </div>
        {errors.password && (
          <p className="text-sm text-red-600">
            {errors.password.message as string}
          </p>
        )}
      </div>

      {!isLogin && (
        <div className="space-y-2">
          <label className="text-sm text-gray-400">Confirm Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              {...register('confirmPassword')}
              type="password"
              className="w-full bg-[#2b2b2b] rounded px-10 py-3 focus:outline-none focus:ring-2 focus:ring-red-600"
              placeholder="Confirm your password"
            />
          </div>
          {errors.confirmPassword && (
            <p className="text-sm text-red-600">
              {errors.confirmPassword.message as string}
            </p>
          )}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-red-600 text-white py-3 rounded font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          isLogin ? 'Sign In' : 'Sign Up'
        )}
      </button>
    </form>
  );
};