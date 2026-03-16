import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import {
  Plus,
  AlertCircle,
  RefreshCcw,
  Loader2,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { queryKeys } from "@/lib/queryKeys";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { ExportModal } from "@/pages/builder/components/ExportModal";
import { toast } from "sonner";
import { useResumes } from "@/hooks/queries/useResumes";
import { useCreateResume } from "@/hooks/mutations/useCreateResume";
import { useDeleteResume } from "@/hooks/mutations/useDeleteResume";
import { useProfile } from "@/hooks/queries/useProfile";

export function DashboardPage() {
  const navigate = useNavigate();
  const { user, signOut } = useAuthStore();
  const queryClient = useQueryClient();
  
  const { data: profile } = useProfile(user?.id);
  const { data: resumes = [], isLoading, isError, error, refetch } = useResumes(user?.id);
  const createResumeMutation = useCreateResume(user?.id);
  const deleteResumeMutation = useDeleteResume(user?.id);

  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [exportResumeId, setExportResumeId] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  // ... (keep rest until userInitials)
  const handleNewResume = async () => {
    if (resumes.length >= 1) {
      setShowUpgradeModal(true);
      return;
    }

    try {
      const data = await createResumeMutation.mutateAsync("Untitled Resume");
      navigate(`/builder/${data.id}`);
    } catch (err) {
      toast.error("Failed to create resume");
    }
  };

  const confirmDeleteResume = async () => {
    if (!deleteConfirmId) return;
    const resumeToDelete = resumes.find((r) => r.id === deleteConfirmId);
    
    deleteResumeMutation.mutate(deleteConfirmId, {
      onSuccess: () => {
        toast.success("Resume deleted", {
          action: resumeToDelete
            ? {
                label: "Undo",
                onClick: async () => {
                  const { error: undoError } = await supabase
                    .from("resumes")
                    .insert({ ...resumeToDelete });

                  if (undoError) {
                    toast.error("Failed to undo deletion");
                  } else {
                    queryClient.invalidateQueries({ queryKey: queryKeys.resumes(user?.id!) });
                    toast.success("Resume restored");
                  }
                },
              }
            : undefined,
        });
      }
    });
    setDeleteConfirmId(null);
  };

  const handleEditResume = (id: string) => {
    navigate(`/builder/${id}`);
  };

  const handleEditHover = (id: string) => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.blocks(id),
      queryFn: async () => {
        const { data, error } = await supabase
          .from("blocks")
          .select("*")
          .eq("resume_id", id)
          .order("order_index", { ascending: true });
        if (error) throw error;
        return data;
      },
      staleTime: 1000 * 60 * 3, // 3 minutes
    });
  };

  const handleExportPDF = (id: string) => {
    setExportResumeId(id);
  };

  const executeExport = async (filename: string) => {
    setIsExporting(true);
    // Since PDF generation requires the rendered DOM canvas, the cleanest way 
    // from the dashboard is to deep link into the builder with an export flag
    navigate(`/builder/${exportResumeId}?export=${encodeURIComponent(filename)}`);
    // Alternatively, we could visually render a hidden instance of the resume here, 
    // but that is heavy. Routing to builder is standard for DOM-based capture.
    setIsExporting(false);
    setExportResumeId(null);
  };

  return (
    <div className="min-h-screen bg-background text-text-primary">
      {/* Floating Navbar */}
      <header className="fixed top-0 inset-x-0 z-50 bg-transparent h-[52px] md:h-[56px] flex items-center">
        <div className="w-full max-w-[1100px] mx-auto px-[20px] md:px-[32px] grid grid-cols-2 md:grid-cols-[1fr_auto_1fr] items-center">
          <Link
            to="/"
            className="justify-self-start font-serif italic text-[17px] font-normal text-[#f5f5f5] hover:opacity-65 transition-opacity duration-150"
          >
            ResumeCanvas
          </Link>

          <nav className="hidden md:flex justify-self-center items-center gap-[36px]"></nav>

          <div className="justify-self-end flex items-center gap-[8px]">
            <Button
              variant="default"
              className="hidden md:flex bg-[#f5f5f5] text-[#0a0a0a] text-[13px] font-medium px-[18px] py-0 h-8 rounded-full hover:bg-white hover:scale-[1.02] active:scale-[0.98] transition-all duration-150 mr-2"
              onClick={handleNewResume}
              disabled={createResumeMutation.isPending}
            >
              {createResumeMutation.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Plus className="w-4 h-4 mr-2" />
              )}
              {createResumeMutation.isPending ? "Creating..." : "New Resume"}
            </Button>

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
                      : user?.email?.charAt(0) || "U"}
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
                    @{profile?.username || user?.email?.split("@")[0]}
                  </p>
                </div>
                <DropdownMenuSeparator className="bg-[#1f1f1f] my-1" />
                <DropdownMenuItem
                  onClick={() => {}}
                  className="cursor-pointer text-[13px] text-[#888888] hover:text-[#f5f5f5] hover:bg-[#1a1a1a] focus:bg-[#1a1a1a] focus:text-[#f5f5f5] rounded-[6px] px-2 py-1.5 transition-colors duration-100"
                >
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-[#1f1f1f] my-1" />
                <DropdownMenuItem
                  onClick={signOut}
                  className="cursor-pointer text-[13px] text-[#888888] hover:text-[#ff4444] hover:bg-[#1a1a1a] focus:bg-[#1a1a1a] focus:text-[#ff4444] rounded-[6px] px-2 py-1.5 transition-colors duration-100"
                >
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 lg:px-12 pt-24 pb-12">
        <header className="mb-8">
          <h1 className="text-3xl font-serif">Your Resumes</h1>
          <p className="text-text-secondary mt-2">
            Build and export your single-page resume
          </p>
        </header>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
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
        ) : isError ? (
          <div className="w-full max-w-2xl mx-auto mt-16 text-center space-y-6 bg-destructive/5 border border-destructive/20 rounded-2xl p-12">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto opacity-80" />
            <div className="space-y-2">
              <h2 className="text-xl font-medium text-destructive">
                Failed to load resumes
              </h2>
              <p className="text-sm text-text-secondary">{error?.message}</p>
            </div>
            <Button
              onClick={() => refetch()}
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
            <div className="border-2 border-dashed border-border rounded-2xl p-10 bg-surface-2/20 transition-all hover:bg-surface-2/40">
              <div className="flex flex-col items-center gap-5">
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
                <Button onClick={handleNewResume} disabled={createResumeMutation.isPending}>
                  {createResumeMutation.isPending ? (
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
              <div
                key={resume.id}
                onMouseEnter={() => handleEditHover(resume.id)}
              >
                <ResumeCard
                  resume={resume}
                  onEdit={handleEditResume}
                  onExport={handleExportPDF}
                  onDelete={setDeleteConfirmId}
                />
              </div>
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

      {/* Delete Confirmation Modal */}
      <Dialog open={!!deleteConfirmId} onOpenChange={(open) => !open && setDeleteConfirmId(null)}>
        <DialogContent className="w-fit">
          <DialogHeader>
            <DialogTitle>Delete Resume</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this resume? This action can be undone briefly via the toast notification.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6">
            <Button
              variant="outline"
              onClick={() => setDeleteConfirmId(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDeleteResume}
              disabled={deleteResumeMutation.isPending}
            >
              {deleteResumeMutation.isPending && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Export Modal */}
      <ExportModal
        open={!!exportResumeId}
        onOpenChange={(open) => !open && setExportResumeId(null)}
        onExport={executeExport}
        isExporting={isExporting}
      />
    </div>
  );
}

