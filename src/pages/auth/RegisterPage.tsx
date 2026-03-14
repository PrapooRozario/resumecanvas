import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

const registerSchema = z.object({
    fullName: z.string().min(2, 'Full name is required'),
    username: z.string().min(3, 'Username must be at least 3 characters').regex(/^[a-z0-9_-]+$/, 'Only lowercase letters, numbers, underscores, and hyphens allowed'),
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
})

type RegisterFormValues = z.infer<typeof registerSchema>

export function RegisterPage() {
    const navigate = useNavigate()
    const [isGoogleLoading, setIsGoogleLoading] = useState(false)
    const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null)
    const [checkingUsername, setCheckingUsername] = useState(false)

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: { fullName: '', username: '', email: '', password: '' },
    })

    // Watch fields for live preview and strength
    const watchFullName = watch('fullName')
    const watchUsername = watch('username')
    const watchPassword = watch('password')

    // Auto-suggest username from full name if username is empty
    useEffect(() => {
        if (watchFullName && !watchUsername) {
            const suggested = watchFullName
                .toLowerCase()
                .replace(/[^a-z0-9]/g, '')
            if (suggested.length >= 3) {
                setValue('username', suggested, { shouldValidate: true })
            }
        }
    }, [watchFullName])

    // Check username uniqueness
    useEffect(() => {
        if (!watchUsername || watchUsername.length < 3 || errors.username) {
            setUsernameAvailable(null)
            return
        }

        const checkUsername = async () => {
            setCheckingUsername(true)
            const { data } = await supabase
                .from('profiles')
                .select('username')
                .eq('username', watchUsername)
                .single()

            setCheckingUsername(false)
            // If data exists, it's taken. If error (PGRST116 no rows), it's available.
            if (data) {
                setUsernameAvailable(false)
            } else {
                setUsernameAvailable(true)
            }
        }

        const debounce = setTimeout(checkUsername, 500)
        return () => clearTimeout(debounce)
    }, [watchUsername, errors.username])

    // Calculate password strength
    const getPasswordStrength = (pass: string) => {
        if (!pass) return 0
        let strength = 0
        if (pass.length >= 8) strength += 25
        if (pass.match(/[a-z]/) && pass.match(/[A-Z]/)) strength += 25
        if (pass.match(/\d/)) strength += 25
        if (pass.match(/[^a-zA-Z\d]/)) strength += 25
        return strength
    }

    const strength = getPasswordStrength(watchPassword)
    const strengthColor =
        strength <= 25 ? 'bg-destructive' :
            strength <= 50 ? 'bg-orange-500' :
                strength <= 75 ? 'bg-yellow-500' :
                    'bg-success'

    const onSubmit = async (data: RegisterFormValues) => {
        if (usernameAvailable === false) {
            toast.error('Username is already taken')
            return
        }

        const { data: authData, error: signUpError } = await supabase.auth.signUp({
            email: data.email,
            password: data.password,
        })

        if (signUpError) {
            toast.error(signUpError.message)
            return
        }

        if (authData.user) {
            // Create profile record
            const { error: profileError } = await supabase
                .from('profiles')
                .insert({
                    id: authData.user.id,
                    username: data.username,
                    full_name: data.fullName,
                })

            if (profileError) {
                toast.error('Account created, but failed to save profile info. ' + profileError.message)
            } else {
                toast.success('Account created successfully')
                navigate('/dashboard')
            }
        }
    }

    const handleGoogleLogin = async () => {
        setIsGoogleLoading(true)
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        })

        if (error) {
            toast.error(error.message)
            setIsGoogleLoading(false)
        }
    }

    return (
        <div className="w-full bg-surface p-8 max-w-md mx-auto rounded-2xl border border-border space-y-8">
            <div className="space-y-2 text-center">
                <h1 className="text-3xl font-serif text-text-primary">Create an account</h1>
                <p className="text-sm text-text-secondary">Enter your details to get started</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-1">
                    <label className="text-sm font-medium text-text-primary" htmlFor="fullName">
                        Full Name
                    </label>
                    <input
                        {...register('fullName')}
                        id="fullName"
                        type="text"
                        placeholder="Alex Morgan"
                        disabled={isSubmitting || isGoogleLoading}
                        className="w-full h-10 px-3 rounded-md bg-background border border-border text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent transition-all disabled:opacity-50"
                    />
                    {errors.fullName && <p className="text-xs text-destructive mt-1">{errors.fullName.message}</p>}
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-medium text-text-primary" htmlFor="username">
                        Username
                    </label>
                    <div className="relative">
                        <input
                            {...register('username')}
                            id="username"
                            type="text"
                            placeholder="alexmorgan"
                            disabled={isSubmitting || isGoogleLoading}
                            className="w-full h-10 px-3 rounded-md bg-background border border-border text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent transition-all disabled:opacity-50"
                        />
                        {checkingUsername && <span className="absolute right-3 top-2.5 text-xs text-text-muted">Checking...</span>}
                        {!checkingUsername && usernameAvailable === true && <span className="absolute right-3 top-2.5 text-xs text-success">Available</span>}
                        {!checkingUsername && usernameAvailable === false && <span className="absolute right-3 top-2.5 text-xs text-destructive">Taken</span>}
                    </div>
                    {errors.username && <p className="text-xs text-destructive mt-1">{errors.username.message}</p>}
                    {watchUsername && !errors.username && (
                        <p className="text-xs text-text-muted mt-1 font-mono">resumecanvas.app/u/{watchUsername}</p>
                    )}
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-medium text-text-primary" htmlFor="email">
                        Email
                    </label>
                    <input
                        {...register('email')}
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        disabled={isSubmitting || isGoogleLoading}
                        className="w-full h-10 px-3 rounded-md bg-background border border-border text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent transition-all disabled:opacity-50"
                    />
                    {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-medium text-text-primary" htmlFor="password">
                        Password
                    </label>
                    <input
                        {...register('password')}
                        id="password"
                        type="password"
                        disabled={isSubmitting || isGoogleLoading}
                        className="w-full h-10 px-3 rounded-md bg-background border border-border text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent transition-all disabled:opacity-50"
                    />
                    {errors.password && <p className="text-xs text-destructive mt-1">{errors.password.message}</p>}
                    {watchPassword && (
                        <div className="w-full h-1 mt-2 bg-background rounded-full overflow-hidden">
                            <div
                                className={`h-full transition-all duration-300 ${strengthColor}`}
                                style={{ width: `${strength}%` }}
                            />
                        </div>
                    )}
                </div>

                <div className="pt-2">
                    <Button type="submit" className="w-full" disabled={isSubmitting || isGoogleLoading || usernameAvailable === false || checkingUsername}>
                        {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        {isSubmitting ? 'Creating account...' : 'Create account'}
                    </Button>
                </div>
            </form>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-surface px-2 text-text-muted">Or continue with</span>
                </div>
            </div>

            <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleGoogleLogin}
                disabled={isSubmitting || isGoogleLoading}
            >
                <svg viewBox="0 0 24 24" className="w-4 h-4 mr-2" aria-hidden="true">
                    <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                    />
                    <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                    />
                    <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                    />
                    <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                    />
                </svg>
                {isGoogleLoading ? <Loader2 className="w-4 h-4 ml-2 animate-spin" /> : 'Google'}
            </Button>

            <p className="text-center text-sm text-text-secondary">
                Already have an account?{' '}
                <Link to="/login" className="text-text-primary underline-offset-4 hover:underline">
                    Sign in
                </Link>
            </p>
        </div>
    )
}
