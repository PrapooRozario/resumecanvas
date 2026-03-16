import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { queryKeys } from '@/lib/queryKeys'
import type { Block } from '@/types/blocks'

export function useUpdateBlock(resumeId: string) {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Block> }) => {
      const { data, error } = await supabase
        .from('blocks')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
        
      if (error) throw error

      // Bump the resume's updated_at so the dashboard shows a fresh timestamp
      const now = new Date().toISOString()
      await supabase
        .from('resumes')
        .update({ updated_at: now })
        .eq('id', resumeId)

      return { data, now }
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
    onSuccess: ({ now }) => {
      // Update to the dashboard list cache with the confirmed server timestamp
      queryClient.setQueriesData<any[]>({ queryKey: ['resumes'] }, (list) =>
        list?.map((r) => (r.id === resumeId ? { ...r, updated_at: now } : r))
      )
    },
  })
}
