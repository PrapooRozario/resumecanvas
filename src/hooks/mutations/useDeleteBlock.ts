import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { queryKeys } from '@/lib/queryKeys'
import type { Block } from '@/types/blocks'

export function useDeleteBlock(resumeId: string) {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (blockId: string) => {
      const { error } = await supabase
        .from('blocks')
        .delete()
        .eq('id', blockId)
        
      if (error) throw error

      const now = new Date().toISOString()
      await supabase.from('resumes').update({ updated_at: now }).eq('id', resumeId)

      return { blockId, now }
    },
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.blocks(resumeId) })
      
      const previousBlocks = queryClient.getQueryData<Block[]>(queryKeys.blocks(resumeId))
      
      if (previousBlocks) {
        queryClient.setQueryData<Block[]>(
          queryKeys.blocks(resumeId),
          previousBlocks.filter((b) => b.id !== deletedId)
        )
      }
      
      return { previousBlocks }
    },
    onError: (_err, _deletedId, context) => {
      if (context?.previousBlocks) {
        queryClient.setQueryData(queryKeys.blocks(resumeId), context.previousBlocks)
      }
    },
    onSuccess: ({ now }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.blocks(resumeId) })
      queryClient.setQueriesData<any[]>({ queryKey: ['resumes'] }, (list) =>
        list?.map((r) => (r.id === resumeId ? { ...r, updated_at: now } : r))
      )
    }
  })
}
