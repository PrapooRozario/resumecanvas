import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { queryKeys } from '@/lib/queryKeys'

export function useResume(resumeId: string | undefined | null) {
  return useQuery({
    queryKey: resumeId ? queryKeys.resume(resumeId) : [],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .eq('id', resumeId!)
        .single()
        
      if (error) throw error
      return data
    },
    enabled: !!resumeId,
    staleTime: 1000 * 60 * 3, // 3 minutes
  })
}
