
import { Outlet } from 'react-router-dom'
import { PenTool } from 'lucide-react'

export function AuthLayout() {
    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-background text-text-primary">
            {/* Left side: Static Resume Preview Mockup */}
            <div className="hidden lg:flex flex-col justify-between p-12 bg-surface border-r border-border relative overflow-hidden">
                {/* Background decorative grad (subtle) */}
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_left,var(--surface-2),transparent_50%)] opacity-50" />

                <div className="relative z-10 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-background border border-border flex items-center justify-center shadow-sm">
                        <PenTool className="w-4 h-4 text-text-primary" />
                    </div>
                    <span className="font-serif text-xl tracking-tight">ResumeCanvas</span>
                </div>

                {/* The Mockup Card */}
                <div className="relative z-10 mx-auto w-full max-w-sm mt-8 mb-auto">
                    <div className="aspect-[1/1.4] bg-text-primary rounded-lg shadow-xl p-8 flex flex-col gap-6 transform rotate-[-2deg] transition-transform hover:rotate-0 duration-500">
                        {/* Header */}
                        <div className="space-y-1">
                            <h1 className="font-serif text-background text-4xl">Alex Morgan</h1>
                            <p className="font-mono text-muted text-xs text-background/60">Senior Product Designer • New York, NY</p>
                        </div>

                        {/* Divider */}
                        <div className="w-full h-[1px] bg-background/20" />

                        {/* Exp Section */}
                        <div className="space-y-4 font-sans text-background">
                            <div>
                                <h3 className="text-sm font-semibold tracking-wide">EXPERIENCE</h3>
                                <div className="mt-3 space-y-1">
                                    <div className="flex justify-between text-xs">
                                        <span className="font-medium">Design Director</span>
                                        <span className="font-mono opacity-60">2021 - Present</span>
                                    </div>
                                    <p className="text-[10px] opacity-70 leading-relaxed">
                                        Led the redesign of the core product suite, improving user retention by 40% and establishing a global design system.
                                    </p>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-semibold tracking-wide mt-4">EDUCATION</h3>
                                <div className="mt-3 space-y-1">
                                    <div className="flex justify-between text-xs">
                                        <span className="font-medium">Parsons School of Design</span>
                                        <span className="font-mono opacity-60">2016 - 2020</span>
                                    </div>
                                    <p className="text-[10px] opacity-70">BFA Interaction Design</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 mt-auto text-center">
                    <blockquote className="space-y-2">
                        <p className="text-lg text-text-secondary font-serif italic">
                            "The most intuitive way to craft a professional story. Beautiful, minimal, and fast."
                        </p>
                    </blockquote>
                </div>
            </div>

            {/* Right side: Auth Form Container */}
            <div className="flex items-center justify-center p-8 lg:p-12">
                <div className="w-full max-w-[400px]">
                    {/* Mobile Logo Header */}
                    <div className="flex lg:hidden items-center gap-2 mb-8 justify-center">
                        <div className="w-8 h-8 rounded-lg bg-surface-2 border border-border flex items-center justify-center shadow-sm">
                            <PenTool className="w-4 h-4 text-text-primary" />
                        </div>
                        <span className="font-serif text-xl tracking-tight">ResumeCanvas</span>
                    </div>

                    {/* Form Content via Outlet */}
                    <Outlet />
                </div>
            </div>
        </div>
    )
}
