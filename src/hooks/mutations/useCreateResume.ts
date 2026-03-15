import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { queryKeys } from '@/lib/queryKeys'

export function useCreateResume(userId: string | undefined | null) {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (title: string = 'Untitled Resume') => {
      if (!userId) throw new Error('User required')
      const { data, error } = await supabase
        .from('resumes')
        .insert({ user_id: userId, title })
        .select('id')
        .single()
        
      if (error) throw error
      return data
    },
    onSuccess: () => {
      if (userId) {
        queryClient.invalidateQueries({ queryKey: queryKeys.resumes(userId) })
      }
    }
  })
}
