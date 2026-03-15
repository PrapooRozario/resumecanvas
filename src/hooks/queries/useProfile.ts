import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { queryKeys } from '@/lib/queryKeys'

export function useProfile(userId: string | undefined | null) {
  return useQuery({
    queryKey: userId ? queryKeys.profile(userId) : [],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId!)
        .single()
        
      if (error) throw error
      return data
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 10, // 10 minutes
  })
}
