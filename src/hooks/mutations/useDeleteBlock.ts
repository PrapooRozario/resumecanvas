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
      return blockId
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.blocks(resumeId) })
    }
  })
}
