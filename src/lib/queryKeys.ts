export const queryKeys = {
  profile: (userId: string) => ['profile', userId],
  
  resumes: (userId: string) => ['resumes', userId],
  
  resume: (resumeId: string) => ['resume', resumeId],
  
  blocks: (resumeId: string) => ['blocks', resumeId],
  
  vercelStatus: (resumeId: string) => ['vercel-status', resumeId],
}
