import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'

/**
 * AuthCallback — landing page for Supabase OAuth redirects.
 *
 * Flow:
 *  1. Supabase detects the #access_token hash automatically (detectSessionInUrl: true)
 *     and exchanges it for a session via onAuthStateChange before this component mounts.
 *  2. We call getSession() to read that fresh session.
 *  3. If a session exists we ensure a profile row exists (upsert for first-time Google users)
 *     then clean the URL hash and navigate to /dashboard.
 *  4. If no session we redirect to /login.
 */
export function AuthCallback() {
    const navigate = useNavigate()

    useEffect(() => {
        const handleCallback = async () => {
            const { data: { session }, error } = await supabase.auth.getSession()

            if (error || !session) {
                navigate('/login', { replace: true })
                return
            }

            const user = session.user

            // Ensure a profile row exists for Google OAuth users (first sign-in)
            const { data: existingProfile } = await supabase
                .from('profiles')
                .select('id')
                .eq('id', user.id)
                .single()

            if (!existingProfile) {
                const baseName = user.email
                    ?.split('@')[0]
                    .replace(/[^a-z0-9]/gi, '')
                    .toLowerCase() || 'user'
                const defaultUsername = `${baseName}${Math.floor(Math.random() * 10000)}`

                await supabase.from('profiles').insert({
                    id: user.id,
                    username: defaultUsername,
                    full_name: user.user_metadata?.full_name || 'ResumeCanvas User',
                })
            }

            // Clean the token hash from the URL so it never sits in browser history
            window.history.replaceState(null, '', window.location.pathname)

            navigate('/dashboard', { replace: true })
        }

        handleCallback()
    }, [navigate])

    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <div className="flex flex-col items-center gap-4">
                <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-text-muted">Signing you in…</p>
            </div>
        </div>
    )
}
