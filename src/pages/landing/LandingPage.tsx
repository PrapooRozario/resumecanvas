import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Move, FileDown, Layout, Sun, Save, Lock, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/useAuthStore'
import { useProfile } from '@/hooks/queries/useProfile'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import type { Variants } from 'framer-motion'

const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
    }
}

const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
}

export function LandingPage() {
    const navigate = useNavigate()
    const { user, isLoading: authLoading, signOut } = useAuthStore()
    const { data: profile, isLoading: profileLoading } = useProfile(user?.id)

    const [scrolled, setScrolled] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    const showLoading = authLoading || (user && profileLoading)
    
    const handleSignOut = async () => {
        await signOut()
        navigate('/')
    }

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 80)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <div className="min-h-screen bg-background text-text-primary selection:bg-accent/20 overflow-x-hidden">

            {/* Navbar */}
            <header
                className={`fixed top-0 inset-x-0 z-50 transition-all duration-300  ${scrolled ? 'bg-surface/80 backdrop-blur-sm border-border py-4' : 'bg-transparent border-transparent py-4 md:py-6'
                    }`}
            >
                <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
                    <div className="font-serif italic text-2xl tracking-tight pr-4">ResumeCanvas</div>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-4">
                        {showLoading ? (
                            <>
                                <div className="w-20 h-8 bg-surface-2 animate-pulse rounded-md" />
                                <div className="w-8 h-8 rounded-full bg-surface-2 animate-pulse" />
                            </>
                        ) : user ? (
                            <>
                                <Button asChild variant="ghost" size="sm" className="text-text-muted hover:text-text-primary transition-colors">
                                    <Link to="/dashboard">Dashboard</Link>
                                </Button>
                                <DropdownMenu>
                                    <DropdownMenuTrigger className="focus:outline-none focus:ring-2 focus:ring-accent rounded-full">
                                        <Avatar className="w-8 h-8 cursor-pointer ring-1 ring-border hover:ring-accent transition-all">
                                            {profile?.avatar_url && <AvatarImage src={profile.avatar_url} />}
                                            <AvatarFallback className="bg-surface-2 text-text-primary text-xs">
                                                {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase() || 'U'}
                                            </AvatarFallback>
                                        </Avatar>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="right" className="w-48">
                                        <div className="px-4 py-2 flex flex-col gap-0.5 pointer-events-none">
                                            <p className="text-sm text-text-primary/70">{profile?.full_name || 'User'}</p>
                                            <p className="text-[12px] text-text-muted">@{profile?.username || user.email?.split('@')[0]}</p>
                                        </div>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={() => navigate('/dashboard')} className="cursor-pointer flex items-center">
                                            Dashboard
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer flex items-center text-text-secondary hover:text-destructive">
                                            Sign out
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-sm font-medium text-text-muted hover:text-text-primary transition-colors">
                                    Sign in
                                </Link>
                                <Button asChild size="sm" className="bg-text-primary text-background hover:bg-text-secondary rounded-full px-5">
                                    <Link to="/register">Get started</Link>
                                </Button>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden p-2 -mr-2 text-text-muted hover:text-text-primary transition-colors"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </header>

            {/* Mobile Nav Drawer */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-40 bg-surface/95 backdrop-blur-xl pt-24 px-6 md:hidden flex flex-col items-center gap-6 animate-in fade-in zoom-in-95 duration-200">
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium text-text-secondary hover:text-text-primary transition-colors">
                        Sign in
                    </Link>
                    <Button asChild size="lg" className="w-full bg-text-primary text-background hover:bg-text-secondary rounded-full">
                        <Link to="/register" onClick={() => setMobileMenuOpen(false)}>Get started for free</Link>
                    </Button>
                </div>
            )}

            {/* Hero Section */}
            <section className="relative pt-32 pb-16 md:pt-52 md:pb-32 px-6">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-text-primary/[0.03] via-transparent to-transparent" />

                <motion.div
                    className="max-w-3xl mx-auto text-center relative z-10"
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                >
                    <motion.h1
                        variants={fadeInUp}
                        className="font-serif text-4xl sm:text-5xl md:text-7xl leading-[1.1] tracking-tight mb-6"
                    >
                        Your resume.<br />
                        <span className="text-text-secondary">One page. Unforgettable.</span>
                    </motion.h1>

                    <motion.p
                        variants={fadeInUp}
                        className="text-base md:text-xl text-text-muted mb-10 max-w-xl mx-auto font-sans"
                    >
                        Build a beautiful single-page resume with a drag-and-drop editor.
                        Export as a pixel-perfect PDF in one click.
                    </motion.p>

                    <motion.div
                        variants={fadeInUp}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <Button asChild size="lg" className="bg-text-primary text-background hover:bg-text-secondary rounded-full px-8 w-full sm:w-auto">
                            <Link to="/register">
                                Start for free <ArrowRight className="w-4 h-4 ml-2" />
                            </Link>
                        </Button>
                        <Button asChild size="lg" variant="outline" className="border-border hover:bg-surface-2 rounded-full px-8 w-full sm:w-auto">
                            <Link to="/login">See an example</Link>
                        </Button>
                    </motion.div>
                </motion.div>

                {/* Hero Browser Mockup */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="max-w-5xl mx-auto mt-16 md:mt-20 relative z-10"
                >
                    <div className="rounded-xl md:rounded-2xl border border-border bg-surface shadow-2xl overflow-hidden flex flex-col items-center">
                        {/* Browser Chrome */}
                        <div className="h-10 w-full border-b border-border flex items-center px-4 gap-2 bg-surface-2">
                            <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                            <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                        </div>
                        {/* Browser Content */}
                        <div className="w-full bg-canvas overflow-hidden relative h-fit md:h-[600px] border-t border-border/50">
                            <img src="/image/Demo.svg" alt="Demo Resume Mockup" className="w-full h-auto object-top" />
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* Features Section */}
            <section className="py-24 md:py-32 px-6 bg-background">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={staggerContainer}
                        className="text-center mb-16"
                    >
                        <motion.p variants={fadeInUp} className="text-sm font-semibold tracking-widest text-text-muted uppercase mb-3">
                            Features
                        </motion.p>
                        <motion.h2 variants={fadeInUp} className="font-serif text-3xl md:text-5xl text-text-primary">
                            Everything you need. Nothing you don't.
                        </motion.h2>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={staggerContainer}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {/* 1 */}
                        <motion.div variants={fadeInUp} className="bg-surface border border-border rounded-2xl p-6 md:p-8 flex flex-col">
                            <div className="w-12 h-12 bg-surface-2 rounded-xl flex items-center justify-center mb-6">
                                <Move className="w-6 h-6 text-text-primary" />
                            </div>
                            <h3 className="text-xl font-medium mb-2 text-text-primary">Drag & Drop Builder</h3>
                            <p className="text-text-muted text-base flex-1">Arrange your resume sections with intuitive drag and drop. No manual formatting required.</p>
                        </motion.div>
                        {/* 2 */}
                        <motion.div variants={fadeInUp} className="bg-surface border border-border rounded-2xl p-6 md:p-8 flex flex-col">
                            <div className="w-12 h-12 bg-surface-2 rounded-xl flex items-center justify-center mb-6">
                                <FileDown className="w-6 h-6 text-text-primary" />
                            </div>
                            <h3 className="text-xl font-medium mb-2 text-text-primary">PDF Export</h3>
                            <p className="text-text-muted text-base flex-1">Export a pristine, high-resolution A4 PDF with one click. What you see is exactly what you get.</p>
                        </motion.div>
                        {/* 3 */}
                        <motion.div variants={fadeInUp} className="bg-surface border border-border rounded-2xl p-6 md:p-8 flex flex-col">
                            <div className="w-12 h-12 bg-surface-2 rounded-xl flex items-center justify-center mb-6">
                                <Layout className="w-6 h-6 text-text-primary" />
                            </div>
                            <h3 className="text-xl font-medium mb-2 text-text-primary">One Perfect Template</h3>
                            <p className="text-text-muted text-base flex-1">Carefully designed by product designers for maximum clarity, readability, and modern aesthetic impact.</p>
                        </motion.div>
                        {/* 4 */}
                        <motion.div variants={fadeInUp} className="bg-surface border border-border rounded-2xl p-6 md:p-8 flex flex-col">
                            <div className="w-12 h-12 bg-surface-2 rounded-xl flex items-center justify-center mb-6">
                                <Sun className="w-6 h-6 text-text-primary" />
                            </div>
                            <h3 className="text-xl font-medium mb-2 text-text-primary">Dark & Light Theme</h3>
                            <p className="text-text-muted text-base flex-1">Write your resume comfortably in dark mode, and instantly toggle between themes before exporting.</p>
                        </motion.div>
                        {/* 5 */}
                        <motion.div variants={fadeInUp} className="bg-surface border border-border rounded-2xl p-6 md:p-8 flex flex-col">
                            <div className="w-12 h-12 bg-surface-2 rounded-xl flex items-center justify-center mb-6">
                                <Save className="w-6 h-6 text-text-primary" />
                            </div>
                            <h3 className="text-xl font-medium mb-2 text-text-primary">Auto-Save</h3>
                            <p className="text-text-muted text-base flex-1">Never lose your work. Every keystroke and drag operation is saved automatically in real time.</p>
                        </motion.div>
                        {/* 6 */}
                        <motion.div variants={fadeInUp} className="bg-surface border border-border rounded-2xl p-6 md:p-8 flex flex-col">
                            <div className="w-12 h-12 bg-surface-2 rounded-xl flex items-center justify-center mb-6">
                                <Lock className="w-6 h-6 text-text-primary" />
                            </div>
                            <h3 className="text-xl font-medium mb-2 text-text-primary">Secure & Private</h3>
                            <p className="text-text-muted text-base flex-1">Your data belongs to you. Built on top of enterprise-grade security with Supabase authentication.</p>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Template Preview Section */}
            <section className="py-24 md:py-32 px-6 bg-surface border-y border-border overflow-hidden">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16 lg:gap-24">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={staggerContainer}
                        className="flex-1 text-center md:text-left"
                    >
                        <motion.h2 variants={fadeInUp} className="font-serif text-4xl md:text-5xl text-text-primary mb-6">
                            The template, refined.
                        </motion.h2>
                        <motion.p variants={fadeInUp} className="text-base md:text-lg text-text-muted mb-8 max-w-md mx-auto md:mx-0 font-sans">
                            Say goodbye to endless tinkering. We've crafted one opinionated, designer-approved layout engineered to make your experience shine and pass ATS filters.
                        </motion.p>
                        <motion.div variants={fadeInUp}>
                            <Button asChild size="lg" className="bg-text-primary text-background hover:bg-text-secondary rounded-full px-8 w-full md:w-auto">
                                <Link to="/register">Create your resume</Link>
                            </Button>
                        </motion.div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="flex-1 w-full max-w-lg lg:max-w-none relative mt-10 md:mt-0"
                    >
                        {/* Subtle glow behind the resume */}
                        <div className="absolute inset-0 bg-accent/5 blur-3xl rounded-full" />

                        <div className="relative bg-canvas rounded-xl border border-border shadow-2xl h-fit md:h-[500px] overflow-hidden">
                            <img src="/image/Demo2.svg" alt="Demo Resume" className="w-full h-auto object-top" />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* CTA Banner */}
            <section className="py-24 md:py-32 px-6 bg-background relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_var(--tw-gradient-stops))] from-text-primary/[0.03] via-transparent to-transparent" />
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                    className="max-w-3xl mx-auto text-center relative z-10"
                >
                    <motion.h2 variants={fadeInUp} className="font-serif text-4xl md:text-6xl text-text-primary mb-6">
                        Ready to build yours?
                    </motion.h2>
                    <motion.p variants={fadeInUp} className="text-lg md:text-xl text-text-muted mb-10 font-sans">
                        Free to start. No credit card required.
                    </motion.p>
                    <motion.div variants={fadeInUp}>
                        <Button asChild size="lg" className="bg-text-primary text-background hover:bg-text-secondary rounded-full px-8 md:px-10 h-12 md:h-14 text-sm md:text-base w-full sm:w-auto">
                            <Link to="/register">
                                Get started free <ArrowRight className="w-4 h-4 ml-2" />
                            </Link>
                        </Button>
                    </motion.div>
                </motion.div>
            </section>

            {/* Footer */}
            <footer className="bg-surface border-t border-border py-10 md:py-12 px-6">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="text-center md:text-left">
                        <div className="font-serif italic text-xl mb-2 text-text-primary">ResumeCanvas</div>
                        <p className="text-xs md:text-sm text-text-muted">© {new Date().getFullYear()} ResumeCanvas. Made for builders and designers.</p>
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-text-muted">
                        <a href="#" className="hover:text-text-primary transition-colors">Twitter</a>
                        <a href="#" className="hover:text-text-primary transition-colors">GitHub</a>
                        <a href="#" className="hover:text-text-primary transition-colors">Terms</a>
                        <a href="#" className="hover:text-text-primary transition-colors">Privacy</a>
                    </div>
                </div>
            </footer>
        </div>
    )
}
