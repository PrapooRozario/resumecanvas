import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, FileDown, Sun, Moon, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";
import { useProfile } from "@/hooks/queries/useProfile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { Variants } from "framer-motion";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

export function LandingPage() {
  const navigate = useNavigate();
  const { user, isLoading: authLoading, signOut } = useAuthStore();
  const { data: profile, isLoading: profileLoading } = useProfile(user?.id);

  const showLoading = authLoading || (user && profileLoading);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background text-text-primary selection:bg-accent/20 overflow-x-hidden">
      {/* Navbar */}
      <header className="fixed top-0 inset-x-0 z-50 bg-transparent h-[52px] md:h-[56px] flex items-center">
        <div className="w-full max-w-[1100px] mx-auto px-[20px] md:px-[32px] grid grid-cols-2 md:grid-cols-[1fr_auto_1fr] items-center">
          <Link
            to="/"
            className="justify-self-start font-serif italic text-[17px] font-normal text-[#f5f5f5] hover:opacity-65 transition-opacity duration-150"
          >
            ResumeCanvas
          </Link>

          <nav className="hidden md:flex justify-self-center items-center gap-[36px]">
            {["Features", "Pricing"].map((item) => (
              <span
                key={item}
                className="text-[14px] font-normal text-[#888888] hover:text-[#f5f5f5] transition-colors duration-[120ms] cursor-pointer"
              >
                {item}
              </span>
            ))}
          </nav>

          <div className="justify-self-end flex items-center gap-[8px]">
            {showLoading ? (
              <div className="w-[84px] h-[34px] bg-[#1a1a1a] animate-pulse rounded-full" />
            ) : user ? (
              <>
                <Link to="/dashboard">
                  <Button
                    variant="default"
                    className="hidden md:flex bg-[#f5f5f5] text-[#0a0a0a] text-[13px] font-medium px-[18px] py-0 h-8 rounded-full hover:bg-white hover:scale-[1.02] active:scale-[0.98] transition-all duration-150 mr-2"
                  >
                    Dashboard <ArrowUpRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger className="focus:outline-none rounded-full">
                    <Avatar className="w-[30px] h-[30px] rounded-full cursor-pointer hover:opacity-75 transition-opacity duration-150">
                      {profile?.avatar_url && (
                        <AvatarImage
                          src={profile.avatar_url}
                          className="object-cover"
                        />
                      )}
                      <AvatarFallback className="bg-[#1a1a1a] border border-[#2a2a2a] text-[#888888] text-[12px] uppercase">
                        {profile?.full_name
                          ? profile.full_name.charAt(0)
                          : user.email?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="right"
                    sideOffset={8}
                    className="bg-[#111111] border border-[#1f1f1f] rounded-[10px] p-[6px] min-w-[180px] shadow-xl"
                  >
                    <div className="px-2 py-1.5 flex flex-col pointer-events-none">
                      <p className="text-[13px] text-[#f5f5f5] font-medium">
                        {profile?.full_name || "User"}
                      </p>
                      <p className="text-[12px] text-[#555555]">
                        @{profile?.username || user.email?.split("@")[0]}
                      </p>
                    </div>
                    <DropdownMenuSeparator className="bg-[#1f1f1f] my-1" />
                    <DropdownMenuItem
                      onClick={() => navigate("/dashboard")}
                      className="cursor-pointer text-[13px] text-[#888888] hover:text-[#f5f5f5] hover:bg-[#1a1a1a] focus:bg-[#1a1a1a] focus:text-[#f5f5f5] rounded-[6px] px-2 py-1.5 transition-colors duration-100"
                    >
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-[#1f1f1f] my-1" />
                    <DropdownMenuItem
                      onClick={handleSignOut}
                      className="cursor-pointer text-[13px] text-[#888888] hover:text-[#ff4444] hover:bg-[#1a1a1a] focus:bg-[#1a1a1a] focus:text-[#ff4444] rounded-[6px] px-2 py-1.5 transition-colors duration-100"
                    >
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hidden md:block text-[14px] font-normal text-[#888888] hover:text-[#f5f5f5] transition-colors duration-[120ms]"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="bg-[#f5f5f5] text-[#0a0a0a] text-[14px] font-medium px-[20px] py-[8px] rounded-full hover:bg-white active:scale-[0.97] transition-all duration-150"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

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
            Your resume.
            <br />
            <span className="text-text-secondary">
              One page. Unforgettable.
            </span>
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
            <Button
              asChild
              size="lg"
              className="bg-text-primary text-background hover:bg-text-secondary rounded-full px-8 w-full sm:w-auto"
            >
              <Link to="/register">
                Start for free <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-border hover:bg-surface-2 rounded-full px-8 w-full sm:w-auto"
            >
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
              <img
                src="/images/demoresume1.png"
                alt="Demo Resume Mockup"
                className="w-full h-auto object-top"
              />
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 md:py-32 px-6 bg-background">
        <div className="max-w-[960px] mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center mb-12"
          >
            <motion.p
              variants={fadeInUp}
              className="text-[11px] font-semibold tracking-[0.15em] text-[#555555] uppercase mb-4"
            >
              FEATURES
            </motion.p>
            <motion.h2
              variants={fadeInUp}
              className="font-serif text-[28px] md:text-[40px] text-[#f5f5f5] mb-4"
            >
              Everything you need.
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-[15px] text-[#888888] max-w-lg mx-auto"
            >
              One focused tool, built to make your resume stand out.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {/* CARD 1 - Drag & Drop */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: 0 }}
              className="bg-[#0f0f0f] border border-[#1f1f1f] rounded-[16px] flex flex-col overflow-hidden group hover:border-[#2a2a2a] hover:scale-[1.01] transition-all duration-200"
            >
              <div className="h-[220px] bg-[#111111] relative flex items-center justify-center p-6 border-b border-[#1a1a1a]">
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-[120px] h-[120px] bg-white opacity-[0.15] blur-[60px] rounded-full" />
                </div>
                <div className="z-10 w-full max-w-[160px] flex flex-col gap-2.5 relative">
                  <div
                    className="h-6 w-full bg-white/[0.25] rounded-md animate-slide-up-fade"
                    style={{ animationDelay: "0s" }}
                  />
                  <div
                    className="h-6 w-[70%] bg-white/[0.20] rounded-md animate-slide-up-fade"
                    style={{ animationDelay: "0.1s" }}
                  />
                  <div
                    className="h-6 w-[50%] bg-white/[0.15] rounded-md animate-slide-up-fade"
                    style={{ animationDelay: "0.2s" }}
                  />
                </div>
              </div>
              <div className="bg-[#0f0f0f] p-6 flex flex-col justify-center flex-1">
                <h3 className="font-serif text-[20px] text-[#f5f5f5] mb-2">
                  Drag & Drop Builder
                </h3>
                <p className="text-[13px] text-[#888888] leading-[1.6]">
                  Arrange your resume sections effortlessly. No code, no
                  complexity.
                </p>
              </div>
            </motion.div>

            {/* CARD 2 - Export as PDF */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="bg-[#0f0f0f] border border-[#1f1f1f] rounded-[16px] flex flex-col overflow-hidden group hover:border-[#2a2a2a] hover:scale-[1.01] transition-all duration-200"
            >
              <div className="h-[220px] bg-[#111111] relative flex flex-col items-center justify-center border-b border-[#1a1a1a]">
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-[120px] h-[120px] bg-white opacity-[0.15] blur-[60px] rounded-full" />
                </div>
                <div className="z-10 relative flex flex-col items-center justify-center">
                  <div className="w-[84px] h-[116px] rounded-md border border-white/40 bg-white/10 flex flex-col items-center pt-8 gap-2.5 relative shadow-lg">
                    <div className="w-12 h-1 bg-white/30 rounded-full" />
                    <div className="w-10 h-1 bg-white/30 rounded-full mr-2" />
                    <div className="w-14 h-1 bg-white/30 rounded-full" />
                  </div>
                  <div className="absolute -bottom-5 animate-bounce-subtle bg-[#111111] p-1.5 rounded-full border border-[#333] shadow-md z-20">
                    <FileDown className="w-[18px] h-[18px] text-white opacity-90" />
                  </div>
                </div>
              </div>
              <div className="bg-[#0f0f0f] p-6 flex flex-col justify-center flex-1">
                <h3 className="font-serif text-[20px] text-[#f5f5f5] mb-2">
                  Export as PDF
                </h3>
                <p className="text-[13px] text-[#888888] leading-[1.6]">
                  Download a pixel-perfect A4 PDF that looks exactly as you
                  built it.
                </p>
              </div>
            </motion.div>

            {/* CARD 3 - Dark & Light Theme */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="bg-[#0f0f0f] border border-[#1f1f1f] rounded-[16px] flex flex-col overflow-hidden group hover:border-[#2a2a2a] hover:scale-[1.01] transition-all duration-200"
            >
              <div className="h-[220px] bg-[#111111] relative flex items-center justify-center border-b border-[#1a1a1a]">
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-[120px] h-[120px] bg-white opacity-[0.15] blur-[60px] rounded-full" />
                </div>
                <div className="z-10 flex relative -space-x-3 items-center">
                  <div className="w-[72px] h-[72px] rounded-full bg-white/95 shadow-xl flex items-center justify-center relative z-20">
                    <Sun className="w-7 h-7 text-black drop-shadow-sm" />
                  </div>
                  <div className="w-[72px] h-[72px] rounded-full bg-[#1a1a1a] border border-[#333] flex items-center justify-center relative z-10 shadow-lg">
                    <Moon className="w-6 h-6 text-white opacity-90" />
                  </div>
                </div>
              </div>
              <div className="bg-[#0f0f0f] p-6 flex flex-col justify-center flex-1">
                <h3 className="font-serif text-[20px] text-[#f5f5f5] mb-2">
                  Dark & Light Theme
                </h3>
                <p className="text-[13px] text-[#888888] leading-[1.6]">
                  Preview and export your resume in both dark and light modes.
                  Your choice.
                </p>
              </div>
            </motion.div>

            {/* CARD 4 - Auto-Save & Sync */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="bg-[#0f0f0f] border border-[#1f1f1f] rounded-[16px] flex flex-col overflow-hidden group hover:border-[#2a2a2a] hover:scale-[1.01] transition-all duration-200"
            >
              <div className="h-[220px] bg-[#111111] relative flex flex-col items-center justify-center border-b border-[#1a1a1a]">
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-[120px] h-[120px] bg-white opacity-[0.15] blur-[60px] rounded-full" />
                </div>
                <div className="z-10 relative flex flex-col items-center justify-center pb-2">
                  <div className="relative flex items-center justify-center w-12 h-12 mt-4 mb-4">
                    <div
                      className="absolute w-6 h-6 rounded-full border border-white/50 animate-pulse-ring"
                      style={{ animationDelay: "0s" }}
                    />
                    <div
                      className="absolute w-6 h-6 rounded-full border border-white/20 animate-pulse-ring"
                      style={{ animationDelay: "1s" }}
                    />
                    <div className="w-[6px] h-[6px] bg-white rounded-full z-10 shadow-[0_0_12px_rgba(255,255,255,0.8)]" />
                  </div>
                  <span className="font-mono text-[10px] text-[#888888] tracking-widest uppercase bg-[#1a1a1a] px-2.5 py-1 rounded-sm border border-[#333]">
                    changes saved
                  </span>
                </div>
              </div>
              <div className="bg-[#0f0f0f] p-6 flex flex-col justify-center flex-1">
                <h3 className="font-serif text-[20px] text-[#f5f5f5] mb-2">
                  Auto-Save & Sync
                </h3>
                <p className="text-[13px] text-[#888888] leading-[1.6]">
                  Every edit saves automatically. Your resume is always up to
                  date, everywhere.
                </p>
              </div>
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
            <motion.h2
              variants={fadeInUp}
              className="font-serif text-4xl md:text-5xl text-text-primary mb-6"
            >
              The template, refined.
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-base md:text-lg text-text-muted mb-8 max-w-md mx-auto md:mx-0 font-sans"
            >
              Say goodbye to endless tinkering. We've crafted one opinionated,
              designer-approved layout engineered to make your experience shine
              and pass ATS filters.
            </motion.p>
            <motion.div variants={fadeInUp}>
              <Button
                asChild
                size="lg"
                className="bg-text-primary text-background hover:bg-text-secondary rounded-full px-8 w-full md:w-auto"
              >
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
              <img
                src="/images/demoresume2.png"
                alt="Demo Resume"
                className="w-full h-auto object-top"
              />
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
          <motion.h2
            variants={fadeInUp}
            className="font-serif text-4xl md:text-6xl text-text-primary mb-6"
          >
            Ready to build yours?
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-lg md:text-xl text-text-muted mb-10 font-sans"
          >
            Free to start. No credit card required.
          </motion.p>
          <motion.div variants={fadeInUp}>
            <Button
              asChild
              size="lg"
              className="bg-text-primary text-background hover:bg-text-secondary rounded-full px-8 md:px-10 h-12 md:h-14 text-sm md:text-base w-full sm:w-auto"
            >
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
            <div className="font-serif italic text-xl mb-2 text-text-primary">
              ResumeCanvas
            </div>
            <p className="text-xs md:text-sm text-text-muted">
              © {new Date().getFullYear()} ResumeCanvas. Made for builders and
              designers.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-text-muted">
            <a href="#" className="hover:text-text-primary transition-colors">
              Twitter
            </a>
            <a href="#" className="hover:text-text-primary transition-colors">
              GitHub
            </a>
            <a href="#" className="hover:text-text-primary transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-text-primary transition-colors">
              Privacy
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
