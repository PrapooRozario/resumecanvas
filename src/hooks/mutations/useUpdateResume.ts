import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { queryKeys } from '@/lib/queryKeys'

export function useUpdateResume(resumeId: string) {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (updates: { title?: string; theme?: 'light' | 'dark' }) => {
      const { data, error } = await supabase
        .from('resumes')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', resumeId)
        .select()
        .single()
        
      if (error) throw error
      return data
    },
    onMutate: async (updates) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.resume(resumeId) })
      
      const previousResume = queryClient.getQueryData(queryKeys.resume(resumeId))
      
      queryClient.setQueryData(queryKeys.resume(resumeId), (old: any) => ({
        ...old,
        ...updates,
      }))
      
      return { previousResume }
    },
    onError: (_err, _newResume, context) => {
      if (context?.previousResume) {
        queryClient.setQueryData(queryKeys.resume(resumeId), context.previousResume)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.resume(resumeId) })
    }
  })
}
