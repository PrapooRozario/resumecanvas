import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { queryKeys } from '@/lib/queryKeys'

export function useDeleteResume(userId: string | undefined | null) {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (resumeId: string) => {
      const { error } = await supabase
        .from('resumes')
        .delete()
        .eq('id', resumeId)
        
      if (error) throw error
      return resumeId
    },
    onMutate: async (deletedId) => {
      if (!userId) return
      
      await queryClient.cancelQueries({ queryKey: queryKeys.resumes(userId) })
      const previousResumes = queryClient.getQueryData<{ id: string }[]>(queryKeys.resumes(userId))
      
      if (previousResumes) {
        queryClient.setQueryData(
          queryKeys.resumes(userId),
          previousResumes.filter((r) => r.id !== deletedId)
        )
      }
      
      return { previousResumes }
    },
    onError: (_err, _deletedId, context) => {
      if (userId && context?.previousResumes) {
        queryClient.setQueryData(queryKeys.resumes(userId), context.previousResumes)
      }
    },
    onSuccess: () => {
      if (userId) {
        queryClient.invalidateQueries({ queryKey: queryKeys.resumes(userId) })
      }
    }
  })
}
