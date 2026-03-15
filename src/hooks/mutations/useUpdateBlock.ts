import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { queryKeys } from '@/lib/queryKeys'
import type { Block } from '@/types/blocks'

export function useUpdateBlock(resumeId: string) {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Block> }) => {
      // In a real database we wouldn't update the whole block blindly,
      // but we match the previous Zustand auto-save logic for simplicity.
      // If we only have content/styles/order_index, we update those.
      const { data, error } = await supabase
        .from('blocks')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
        
      if (error) throw error
      return data
    },
    onMutate: async ({ id, updates }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.blocks(resumeId) })
      
      const previousBlocks = queryClient.getQueryData<Block[]>(queryKeys.blocks(resumeId))
      
      if (previousBlocks) {
        queryClient.setQueryData<Block[]>(
          queryKeys.blocks(resumeId),
          previousBlocks.map((b) => (b.id === id ? { ...b, ...updates } : b))
        )
      }
      
      return { previousBlocks }
    },
    onError: (_err, _variables, context) => {
      if (context?.previousBlocks) {
        queryClient.setQueryData(queryKeys.blocks(resumeId), context.previousBlocks)
      }
    },
    // NO onSuccess INVALIDATION as per requirements (optimistic update is sufficient)
  })
}
