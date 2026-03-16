import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { queryKeys } from '@/lib/queryKeys'

export function useUpdateResume(resumeId: string) {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (updates: { title?: string; theme?: 'light' | 'dark' }) => {
      const now = new Date().toISOString()
      const { data, error } = await supabase
        .from('resumes')
        .update({ ...updates, updated_at: now })
        .eq('id', resumeId)
        .select()
        .single()
        
      if (error) throw error
      return data
    },
    onMutate: async (updates) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.resume(resumeId) })
      
      const previousResume = queryClient.getQueryData(queryKeys.resume(resumeId))
      const now = new Date().toISOString()

      // Optimistically update the single-resume cache
      queryClient.setQueryData(queryKeys.resume(resumeId), (old: any) => ({
        ...old,
        ...updates,
        updated_at: now,
      }))

      // Optimistically update the dashboard list cache so it shows "Just now" immediately
      queryClient.setQueriesData<any[]>({ queryKey: ['resumes'] }, (list) =>
        list?.map((r) =>
          r.id === resumeId ? { ...r, ...updates, updated_at: now } : r
        )
      )
      
      return { previousResume }
    },
    onError: (_err, _newResume, context) => {
      if (context?.previousResume) {
        queryClient.setQueryData(queryKeys.resume(resumeId), context.previousResume)
      }
    },
    onSuccess: (data) => {
      // Invalidate both the single resume and the full resumes list
      queryClient.invalidateQueries({ queryKey: queryKeys.resume(resumeId) })
      // Update the resumes list with the confirmed server value
      queryClient.setQueriesData<any[]>({ queryKey: ['resumes'] }, (list) =>
        list?.map((r) => (r.id === resumeId ? { ...r, ...data } : r))
      )
    }
  })
}
