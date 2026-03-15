import { Navigate, Outlet } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuthStore } from '@/store/useAuthStore'
import { useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/queryKeys'
import { supabase } from '@/lib/supabase'

export function ProtectedRoute() {
    const { session, user, isLoading } = useAuthStore()
    const queryClient = useQueryClient()

    useEffect(() => {
        if (user) {
            queryClient.prefetchQuery({
                queryKey: queryKeys.profile(user.id),
                queryFn: async () => {
                    const { data, error } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', user.id)
                        .single()
                    if (error) throw error
                    return data
                },
                staleTime: 1000 * 60 * 10,
            })
        }
    }, [user, queryClient])

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background">
                <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    if (!session) {
        return <Navigate to="/login" replace />
    }

    return <Outlet />
}
