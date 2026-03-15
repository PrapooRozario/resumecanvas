import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { queryKeys } from '@/lib/queryKeys'
import type { Block } from '@/types/blocks'

export function useReorderBlocks(resumeId: string) {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (blocks: Block[]) => {
      const blocksToUpsert = blocks.map(b => ({
        id: b.id,
        resume_id: resumeId,
        type: b.type,
        order_index: b.order_index,
        content: b.content,
        styles: b.styles || {}
      }))
      
      const { error } = await supabase
        .from('blocks')
        .upsert(blocksToUpsert)
        
      if (error) throw error
      return blocks
    },
    onMutate: async (newOrder) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.blocks(resumeId) })
      
      const previousBlocks = queryClient.getQueryData<Block[]>(queryKeys.blocks(resumeId))
      
      queryClient.setQueryData<Block[]>(queryKeys.blocks(resumeId), newOrder)
      
      return { previousBlocks }
    },
    onError: (_err, _newOrder, context) => {
      if (context?.previousBlocks) {
        queryClient.setQueryData(queryKeys.blocks(resumeId), context.previousBlocks)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.blocks(resumeId) })
    }
  })
}
