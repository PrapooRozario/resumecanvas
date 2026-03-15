import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { queryKeys } from '@/lib/queryKeys'
import type { Block } from '@/types/blocks'

export function useBlocks(resumeId: string | undefined | null) {
  return useQuery({
    queryKey: resumeId ? queryKeys.blocks(resumeId) : [],
    queryFn: async (): Promise<Block[]> => {
      const { data, error } = await supabase
        .from('blocks')
        .select('*')
        .eq('resume_id', resumeId!)
        .order('order_index', { ascending: true })
        
      if (error) throw error
      // ensure we return Block[] array
      return data as Block[]
    },
    enabled: !!resumeId,
    staleTime: 0, // always fresh
  })
}
