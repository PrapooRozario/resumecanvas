import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { queryKeys } from '@/lib/queryKeys'

export function useResumes(userId: string | undefined | null) {
  return useQuery({
    queryKey: userId ? queryKeys.resumes(userId) : [],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('resumes')
        .select('id, title, updated_at')
        .eq('user_id', userId!)
        .order('updated_at', { ascending: false })
        
      if (error) throw error
      return data
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}
