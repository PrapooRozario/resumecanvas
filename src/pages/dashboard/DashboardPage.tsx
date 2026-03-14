import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Plus,
  Settings,
  LogOut,
  AlertCircle,
  RefreshCcw,
  Loader2,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ResumeCard } from "./components/ResumeCard";
import { toast } from "sonner";

interface Resume {
  id: string;
  title: string;
  updated_at: string;
}

export function DashboardPage() {
  const navigate = useNavigate();
  const { user, signOut } = useAuthStore();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [resumeCount, setResumeCount] = useState<number>(3); // skeleton count — updated before data loads
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const fetchResumes = async () => {
    setIsLoading(true);
    if (!user) return;

    // Ensure profile exists (fixes foreign key error for Google OAuth users)
    const { data: profile } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", user.id)
      .single();
    if (!profile) {
      const baseName =
        user.email
          ?.split("@")[0]
          .replace(/[^a-z0-9]/gi, "")
          .toLowerCase() || "user";
      const defaultUsername = `${baseName}${Math.floor(Math.random() * 10000)}`;
      await supabase.from("profiles").insert({
        id: user.id,
        username: defaultUsername,
        full_name: user.user_metadata?.full_name || "ResumeCanvas User",
      });
    }

    // Phase 1: Fast COUNT query — sets skeleton count BEFORE data arrives
    const { count } = await supabase
      .from("resumes")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id);

    if (count !== null && count > 0) {
      setResumeCount(count);
    }

    // Phase 2: Full data fetch
    const { data, error } = await supabase
      .from("resumes")
      .select("id, title, updated_at")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false });

    if (error) {
      setFetchError(error.message);
    } else if (data) {
      setResumes(data);
      setFetchError(null);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchResumes();
  }, [user]);

  const handleNewResume = async () => {
    if (resumes.length >= 1) {
      setShowUpgradeModal(true);
      return;
    }

    setIsCreating(true);
    const { data, error } = await supabase
      .from("resumes")
      .insert({
        user_id: user?.id,
        title: "Untitled Resume",
        // default empty blocks can be initialized when the builder mounts
      })
      .select("id")
      .single();

    setIsCreating(false);

    if (!error && data) {
      navigate(`/builder/${data.id}`);
    }
  };

  const handleDeleteResume = async (id: string) => {
    // Find the resume object first to allow undo
    const resumeToDelete = resumes.find((r) => r.id === id);

    const { error } = await supabase.from("resumes").delete().eq("id", id);
    if (!error) {
      setResumes(resumes.filter((r) => r.id !== id));
      toast.success("Resume deleted", {
        action: resumeToDelete
          ? {
              label: "Undo",
              onClick: async () => {
                // Fast optimistic UI restore
                setResumes((prev) =>
                  [resumeToDelete, ...prev].sort(
                    (a, b) =>
                      new Date(b.updated_at).getTime() -
                      new Date(a.updated_at).getTime(),
                  ),
                );

                // Re-insert into DB
                const { error: undoError } = await supabase
                  .from("resumes")
                  .insert({
                    ...resumeToDelete,
                  });

                if (undoError) {
                  toast.error("Failed to undo deletion");
                  // Revert optimistic insert
                  setResumes((prev) => prev.filter((r) => r.id !== id));
                } else {
                  toast.success("Resume restored");
                }
              },
            }
          : undefined,
      });
    } else {
      toast.error("Failed to delete resume");
    }
  };

  const handleEditResume = (id: string) => {
    navigate(`/builder/${id}`);
  };

  const handleExportPDF = (id: string) => {
    // Placeholder for future export functionality
    console.log("Exporting...", id);
    alert("Export PDF coming soon!");
  };

  const userInitials = user?.email
    ? user.email.substring(0, 2).toUpperCase()
    : "RC";

  return (
    <div className="min-h-screen bg-background text-text-primary">
      {/* Sticky Navbar */}
      <nav className="sticky top-0 z-40 bg-surface border-b border-border h-16 flex items-center justify-between px-6 lg:px-12">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          <span className="font-serif text-xl tracking-tight">
            ResumeCanvas
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleNewResume}
            disabled={isCreating}
          >
            {isCreating ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Plus className="w-4 h-4 mr-2" />
            )}
            {isCreating ? "Creating..." : "New Resume"}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none focus:ring-2 focus:ring-accent rounded-full">
              <Avatar className="w-8 h-8 cursor-pointer ring-1 ring-border hover:ring-accent transition-all">
                <AvatarFallback>{userInitials}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="right" className="w-48">
              <div className="px-4 py-2 border-b border-border mb-1">
                <p className="text-sm font-medium truncate">{user?.email}</p>
                <p className="text-xs text-text-muted mt-0.5">Free Plan</p>
              </div>
              <DropdownMenuItem onClick={() => {}}>
                <Settings className="w-4 h-4 mr-2 inline-block" /> Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={signOut}>
                <LogOut className="w-4 h-4 mr-2 inline-block" /> Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
        <header className="mb-8">
          <h1 className="text-3xl font-serif">Your Resumes</h1>
          <p className="text-text-secondary mt-2">
            Build and export your single-page resume
          </p>
        </header>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: resumeCount }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col bg-surface-2 border border-border rounded-lg overflow-hidden animate-pulse"
              >
                <div className="aspect-[1/1.4] bg-surface p-6 border-b border-border flex items-center justify-center">
                  <div className="w-full h-full rounded border border-border bg-background/40 flex flex-col p-3 gap-2"></div>
                </div>
                <div className="p-4 flex flex-col gap-2 bg-surface-2">
                  <div className="h-4 bg-border/50 rounded w-1/2" />
                  <div className="h-3 bg-border/40 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : fetchError ? (
          <div className="w-full max-w-2xl mx-auto mt-16 text-center space-y-6 bg-destructive/5 border border-destructive/20 rounded-2xl p-12">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto opacity-80" />
            <div className="space-y-2">
              <h2 className="text-xl font-medium text-destructive">
                Failed to load resumes
              </h2>
              <p className="text-sm text-text-secondary">{fetchError}</p>
            </div>
            <Button
              onClick={fetchResumes}
              variant="outline"
              className="border-destructive/30 hover:bg-destructive/10"
            >
              <RefreshCcw className="w-4 h-4 mr-2" />
              Try again
            </Button>
          </div>
        ) : resumes.length === 0 ? (
          /* Empty State - animated dashed border card mockup */
          <div className="w-full max-w-lg mx-auto mt-16 text-center space-y-8">
            {/* Animated card mockup */}
            <div className="border-2 border-dashed border-border rounded-2xl p-10 bg-surface-2/20 transition-all hover:bg-surface-2/40">
              <div className="flex flex-col items-center gap-5">
                {/* Mini paper mockup */}
                <div className="w-20 h-28 border border-border rounded-lg bg-surface/60 shadow-sm flex flex-col p-3 gap-2 animate-float">
                  <div className="w-3/4 h-2 bg-text-muted/30 rounded-sm" />
                  <div className="w-full h-[1px] bg-border/40 my-0.5" />
                  <div className="w-full h-1.5 bg-border/30 rounded-sm" />
                  <div className="w-5/6 h-1.5 bg-border/30 rounded-sm" />
                  <div className="w-4/6 h-1.5 bg-border/30 rounded-sm" />
                  <div className="mt-1 w-full h-[1px] bg-border/40" />
                  <div className="w-full h-1.5 bg-border/20 rounded-sm" />
                  <div className="w-3/4 h-1.5 bg-border/20 rounded-sm" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl font-medium text-text-primary">
                    No resumes yet
                  </h2>
                  <p className="text-sm text-text-secondary">
                    Create your first resume to get started
                  </p>
                </div>
                <Button onClick={handleNewResume} disabled={isCreating}>
                  {isCreating ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4 mr-2" />
                  )}
                  Create resume
                </Button>
              </div>
            </div>
          </div>
        ) : (
          /* Resume Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes.map((resume) => (
              <ResumeCard
                key={resume.id}
                resume={resume}
                onEdit={handleEditResume}
                onExport={handleExportPDF}
                onDelete={handleDeleteResume}
              />
            ))}
          </div>
        )}
      </main>

      {/* Upgrade Limiter Modal */}
      <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upgrade to add more resumes</DialogTitle>
            <DialogDescription className="mt-2 text-base">
              Free plan is limited to 1 resume. Upgrade coming soon.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6">
            <Button
              onClick={() => setShowUpgradeModal(false)}
              className="w-full sm:w-auto"
            >
              Got it
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
