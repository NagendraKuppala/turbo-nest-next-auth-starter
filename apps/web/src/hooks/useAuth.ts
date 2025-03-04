import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import { signIn, signUp } from '@/lib/auth';
import type { SignInFormData, SignUpFormData } from '@/lib/authTypes';

export function useAuth() {
  const queryClient = useQueryClient();
  const { login, logout } = useAuthStore();
  
  // Fixed type parameters order for loginMutation
  const loginMutation = useMutation({
    mutationFn: (data: SignInFormData) => signIn(data),
    onSuccess: (data) => {
      login(data);
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });

  // Fixed type parameters order for registerMutation
  const registerMutation = useMutation({
    mutationFn: (data: SignUpFormData) => signUp(data),
    onSuccess: (data) => {
      login(data);
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await fetch('/api/auth/logout', { method: 'POST' });
      return logout();
    },
    onSuccess: () => {
      queryClient.clear(); // Clear all queries in cache
    },
  });

  return {
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
    
    register: registerMutation.mutate,
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error,
    
    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,
  };
}