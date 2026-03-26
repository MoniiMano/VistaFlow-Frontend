import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { authService } from '@api/services/authService'
import { useAuthStore } from '@store/authStore'

export const useAuth = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { user, setUser, logout: logoutStore } = useAuthStore()
  
  // Get current user
  const { data: currentUser, isLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: authService.getCurrentUser,
    enabled: !!user,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    onSuccess: (data) => {
      setUser(data.user)
    },
    onError: () => {
      logoutStore()
    }
  })
  
  // Login mutation
  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      setUser(data.user)
      queryClient.invalidateQueries(['currentUser'])
      toast.success('Login successful!')
      
      // Redirect based on role
      const role = data.user.role
      if (role === 'admin') {
        navigate('/dashboard/admin')
      } else if (role === 'manager') {
        navigate('/dashboard/manager')
      } else {
        navigate('/dashboard/member')
      }
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Login failed')
    }
  })
  
  // Register mutation
  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      setUser(data.user)
      queryClient.invalidateQueries(['currentUser'])
      toast.success('Registration successful!')
      navigate('/dashboard/member')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Registration failed')
    }
  })
  
  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      logoutStore()
      queryClient.clear()
      toast.success('Logged out successfully')
      navigate('/login')
    }
  })
  
  return {
    user: currentUser?.user || user,
    isLoading,
    isAuthenticated: !!user,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: logoutMutation.mutate,
    isLoginLoading: loginMutation.isPending,
    isRegisterLoading: registerMutation.isPending
  }
}

export default useAuth
