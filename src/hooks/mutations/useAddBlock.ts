import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { queryKeys } from '@/lib/queryKeys'
import type { Block } from '@/types/blocks'

export function useAddBlock(resumeId: string) {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (block: Block) => {
      const { data, error } = await supabase
        .from('blocks')
        .insert({
          id: block.id,
          resume_id: resumeId,
          type: block.type,
          order_index: block.order_index,
          content: block.content,
          styles: block.styles || {}
        })
        .select()
        .single()
        
      if (error) throw error

      const now = new Date().toISOString()
      await supabase.from('resumes').update({ updated_at: now }).eq('id', resumeId)

      return { data, now }
    },
    onMutate: async (newBlock) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.blocks(resumeId) })
      
      const previousBlocks = queryClient.getQueryData<Block[]>(queryKeys.blocks(resumeId)) || []
      
      queryClient.setQueryData<Block[]>(queryKeys.blocks(resumeId), [...previousBlocks, newBlock])
      
      return { previousBlocks }
    },
    onError: (_err, _newBlock, context) => {
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
