import React, { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import {
  BookOpen, Users, Calendar, Quote, CheckCircle,
  XCircle, Trash2, Loader2, Clock, Eye, ChevronDown, ChevronUp,
  AlertTriangle
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import {
  useIsAdmin,
  useAddKatha,
  useGetAllVrats,
  useAddVrat,
  useDeleteVrat,
  useListApprovals,
  useSetApproval,
  useGetPendingCommunityPosts,
  useGetAllCommunityPosts,
  useApproveCommunityPost,
  useRejectCommunityPost,
  useDeleteCommunityPost,
} from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { KathaCategory } from '../backend';
import type { CommunityPost } from '../backend';

// Helper to check post status regardless of how the backend serializes it
function isApproved(status: unknown): boolean {
  if (typeof status === 'string') return status === 'approved';
  if (typeof status === 'object' && status !== null) return 'approved' in status;
  return false;
}

function isPending(status: unknown): boolean {
  if (typeof status === 'string') return status === 'pending';
  if (typeof status === 'object' && status !== null) return 'pending' in status;
  return false;
}

function isRejected(status: unknown): boolean {
  if (typeof status === 'string') return status === 'rejected';
  if (typeof status === 'object' && status !== null) return 'rejected' in status;
  return false;
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: unknown }) {
  if (isApproved(status)) {
    return (
      <span className="text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 px-2 py-0.5 rounded-full">
        Approved
      </span>
    );
  }
  if (isRejected(status)) {
    return (
      <span className="text-xs bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 px-2 py-0.5 rounded-full">
        Rejected
      </span>
    );
  }
  return (
    <span className="text-xs bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300 px-2 py-0.5 rounded-full">
      Pending
    </span>
  );
}

function formatTimeAgo(timestamp: number): string {
  const ms = timestamp / 1_000_000;
  const now = Date.now();
  const diff = now - ms;
  if (diff < 0) return 'अभी';
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return 'अभी';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} मिनट पहले`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} घंटे पहले`;
  const days = Math.floor(hours / 24);
  return `${days} दिन पहले`;
}

// ─── Community Post Admin Card ────────────────────────────────────────────────

function AdminPostCard({
  post,
  showApproveReject = false,
}: {
  post: CommunityPost;
  showApproveReject?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const approveMutation = useApproveCommunityPost();
  const rejectMutation = useRejectCommunityPost();
  const deleteMutation = useDeleteCommunityPost();

  const imageUrl = post.image ? post.image.getDirectURL() : null;
  const authorShort = post.author.toString().slice(0, 12) + '...';
  const timeAgo = formatTimeAgo(Number(post.timestamp));

  const isActing =
    approveMutation.isPending ||
    rejectMutation.isPending ||
    deleteMutation.isPending;

  return (
    <div className="bg-card border border-border rounded-xl p-4 space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
            {authorShort[0]?.toUpperCase() ?? '?'}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-foreground truncate">{authorShort}</p>
            <p className="text-xs text-muted-foreground">{timeAgo}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {post.deityTag && (
            <span className="text-xs bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 px-2 py-0.5 rounded-full">
              {post.deityTag}
            </span>
          )}
          <StatusBadge status={post.status} />
        </div>
      </div>

      {/* Content preview */}
      {post.content && (
        <div>
          <p className={`text-sm text-foreground ${expanded ? '' : 'line-clamp-2'}`}>
            {post.content}
          </p>
          {post.content.length > 100 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-xs text-amber-600 mt-1 flex items-center gap-0.5"
            >
              {expanded
                ? <><ChevronUp className="w-3 h-3" /> कम दिखाएं</>
                : <><ChevronDown className="w-3 h-3" /> और दिखाएं</>
              }
            </button>
          )}
        </div>
      )}

      {/* Image thumbnail */}
      {imageUrl && (
        <img
          src={imageUrl}
          alt="Post image"
          loading="lazy"
          className="w-full max-h-48 object-cover rounded-lg"
        />
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 pt-1 border-t border-border/50">
        {showApproveReject && (
          <>
            <button
              onClick={() => approveMutation.mutate(post.id)}
              disabled={isActing}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-xs rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {approveMutation.isPending ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <CheckCircle className="w-3.5 h-3.5" />
              )}
              Approve
            </button>
            <button
              onClick={() => rejectMutation.mutate(post.id)}
              disabled={isActing}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-500 hover:bg-yellow-600 text-white text-xs rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {rejectMutation.isPending ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <XCircle className="w-3.5 h-3.5" />
              )}
              Reject
            </button>
          </>
        )}
        <button
          onClick={() => deleteMutation.mutate(post.id)}
          disabled={isActing}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs rounded-lg font-medium transition-colors disabled:opacity-50 ml-auto"
        >
          {deleteMutation.isPending ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Trash2 className="w-3.5 h-3.5" />
          )}
          Delete
        </button>
      </div>
    </div>
  );
}

// ─── Main AdminPanel ──────────────────────────────────────────────────────────

export default function AdminPanel() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();

  // Katha form state
  const [kathaTitle, setKathaTitle] = useState('');
  const [kathaCategory, setKathaCategory] = useState<KathaCategory>(KathaCategory.puranik);
  const [kathaDeity, setKathaDeity] = useState('');
  const [kathaHindi, setKathaHindi] = useState('');
  const [kathaEnglish, setKathaEnglish] = useState('');
  const [kathaTags, setKathaTags] = useState('');
  const [kathaSuccess, setKathaSuccess] = useState(false);

  const addKatha = useAddKatha();

  // Vrat state
  const { data: vrats, isLoading: vratsLoading } = useGetAllVrats();
  const [vratName, setVratName] = useState('');
  const [vratDate, setVratDate] = useState('');
  const [vratDesc, setVratDesc] = useState('');
  const addVrat = useAddVrat();
  const deleteVrat = useDeleteVrat();

  // Users/Approvals
  const { data: approvals, isLoading: approvalsLoading } = useListApprovals();
  const setApproval = useSetApproval();

  // Community posts
  const { data: pendingPosts, isLoading: pendingLoading } = useGetPendingCommunityPosts();
  const { data: allPosts, isLoading: allPostsLoading } = useGetAllCommunityPosts();

  if (!identity) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
          <p className="text-foreground font-medium">Login आवश्यक है</p>
          <p className="text-muted-foreground text-sm mt-1">Admin Panel के लिए login करें</p>
        </div>
      </div>
    );
  }

  if (adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <p className="text-foreground font-medium">Access Denied</p>
          <p className="text-muted-foreground text-sm mt-1">आप Admin नहीं हैं</p>
          <button
            onClick={() => navigate({ to: '/' })}
            className="mt-4 px-4 py-2 bg-amber-500 text-white rounded-lg text-sm"
          >
            Home जाएं
          </button>
        </div>
      </div>
    );
  }

  const handleAddKatha = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!kathaTitle.trim() || !kathaHindi.trim()) return;
    addKatha.mutate(
      {
        title: kathaTitle.trim(),
        category: kathaCategory,
        deity: kathaDeity.trim(),
        hindiText: kathaHindi.trim(),
        englishText: kathaEnglish.trim(),
        tags: kathaTags.split(',').map(t => t.trim()).filter(Boolean),
      },
      {
        onSuccess: () => {
          setKathaTitle(''); setKathaCategory(KathaCategory.puranik);
          setKathaDeity(''); setKathaHindi(''); setKathaEnglish(''); setKathaTags('');
          setKathaSuccess(true);
          setTimeout(() => setKathaSuccess(false), 4000);
        },
      }
    );
  };

  const handleAddVrat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vratName.trim() || !vratDate.trim()) return;
    addVrat.mutate(
      { name: vratName.trim(), date: vratDate.trim(), description: vratDesc.trim() },
      {
        onSuccess: () => {
          setVratName(''); setVratDate(''); setVratDesc('');
        },
      }
    );
  };

  const pendingCount = pendingPosts?.length ?? 0;
  const approvedPosts = (allPosts ?? []).filter(p => isApproved(p.status));

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-500 px-4 pt-6 pb-8">
        <h1 className="text-white font-bold text-xl">Admin Panel</h1>
        <p className="text-amber-100 text-sm mt-1">सभी content manage करें</p>
      </div>

      <div className="px-4 py-4">
        <Tabs defaultValue="community" className="w-full">
          <TabsList className="w-full grid grid-cols-5 mb-4 h-auto">
            <TabsTrigger value="community" className="text-xs py-2 relative">
              Posts
              {pendingCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {pendingCount > 9 ? '9+' : pendingCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="kathayen" className="text-xs py-2">कथाएं</TabsTrigger>
            <TabsTrigger value="vrats" className="text-xs py-2">व्रत</TabsTrigger>
            <TabsTrigger value="users" className="text-xs py-2">Users</TabsTrigger>
            <TabsTrigger value="quotes" className="text-xs py-2">Quotes</TabsTrigger>
          </TabsList>

          {/* ── Community Posts Tab ── */}
          <TabsContent value="community" className="space-y-4">
            {/* Pending Queue */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4 text-yellow-500" />
                <h2 className="font-semibold text-foreground text-sm">
                  Pending Approval Queue
                  {pendingCount > 0 && (
                    <span className="ml-2 bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300 text-xs px-2 py-0.5 rounded-full">
                      {pendingCount}
                    </span>
                  )}
                </h2>
              </div>

              {pendingLoading ? (
                <div className="space-y-3">
                  {[1, 2].map(i => (
                    <div key={i} className="bg-card border border-border rounded-xl p-4 space-y-2">
                      <div className="flex items-center gap-2">
                        <Skeleton className="w-8 h-8 rounded-full" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                  ))}
                </div>
              ) : pendingPosts && pendingPosts.length > 0 ? (
                <div className="space-y-3">
                  {pendingPosts.map(post => (
                    <AdminPostCard key={post.id.toString()} post={post} showApproveReject />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-muted/30 rounded-xl">
                  <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <p className="text-muted-foreground text-sm">कोई pending post नहीं है</p>
                </div>
              )}
            </div>

            {/* Approved Posts */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Eye className="w-4 h-4 text-green-500" />
                <h2 className="font-semibold text-foreground text-sm">
                  Approved Posts
                  <span className="ml-2 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 text-xs px-2 py-0.5 rounded-full">
                    {approvedPosts.length}
                  </span>
                </h2>
              </div>

              {allPostsLoading ? (
                <div className="space-y-3">
                  {[1, 2].map(i => (
                    <div key={i} className="bg-card border border-border rounded-xl p-4 space-y-2">
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-3 w-2/3" />
                    </div>
                  ))}
                </div>
              ) : approvedPosts.length > 0 ? (
                <div className="space-y-3">
                  {approvedPosts.map(post => (
                    <AdminPostCard key={post.id.toString()} post={post} showApproveReject={false} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 bg-muted/30 rounded-xl">
                  <p className="text-muted-foreground text-sm">कोई approved post नहीं है</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* ── Kathayen Tab ── */}
          <TabsContent value="kathayen">
            <div className="bg-card border border-border rounded-xl p-4">
              <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-500" />
                नई कथा जोड़ें
              </h2>

              {kathaSuccess && (
                <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-700 dark:text-green-300 text-sm flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  कथा सफलतापूर्वक जोड़ी गई! Kathayen section में दिखेगी।
                </div>
              )}

              <form onSubmit={handleAddKatha} className="space-y-3">
                <input
                  value={kathaTitle}
                  onChange={e => setKathaTitle(e.target.value)}
                  placeholder="कथा का शीर्षक *"
                  className="w-full bg-muted rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />

                <select
                  value={kathaCategory}
                  onChange={e => setKathaCategory(e.target.value as KathaCategory)}
                  className="w-full bg-muted rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value={KathaCategory.puranik}>पौराणिक</option>
                  <option value={KathaCategory.vrat}>व्रत</option>
                </select>

                <input
                  value={kathaDeity}
                  onChange={e => setKathaDeity(e.target.value)}
                  placeholder="देवता (जैसे: श्री राम, कृष्ण)"
                  className="w-full bg-muted rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber-500"
                />

                <textarea
                  value={kathaHindi}
                  onChange={e => setKathaHindi(e.target.value)}
                  placeholder="हिंदी में कथा का पाठ *"
                  rows={5}
                  className="w-full bg-muted rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />

                <textarea
                  value={kathaEnglish}
                  onChange={e => setKathaEnglish(e.target.value)}
                  placeholder="English translation (optional)"
                  rows={3}
                  className="w-full bg-muted rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-amber-500"
                />

                <input
                  value={kathaTags}
                  onChange={e => setKathaTags(e.target.value)}
                  placeholder="Tags (comma separated, e.g.: राम, अयोध्या)"
                  className="w-full bg-muted rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber-500"
                />

                <button
                  type="submit"
                  disabled={addKatha.isPending || !kathaTitle.trim() || !kathaHindi.trim()}
                  className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {addKatha.isPending ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> जोड़ा जा रहा है...</>
                  ) : (
                    'कथा जोड़ें'
                  )}
                </button>
              </form>
            </div>
          </TabsContent>

          {/* ── Vrats Tab ── */}
          <TabsContent value="vrats">
            <div className="space-y-4">
              <div className="bg-card border border-border rounded-xl p-4">
                <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-amber-500" />
                  नया व्रत जोड़ें
                </h2>
                <form onSubmit={handleAddVrat} className="space-y-3">
                  <input
                    value={vratName}
                    onChange={e => setVratName(e.target.value)}
                    placeholder="व्रत का नाम *"
                    className="w-full bg-muted rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                  <input
                    type="date"
                    value={vratDate}
                    onChange={e => setVratDate(e.target.value)}
                    className="w-full bg-muted rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                  <textarea
                    value={vratDesc}
                    onChange={e => setVratDesc(e.target.value)}
                    placeholder="व्रत का विवरण"
                    rows={3}
                    className="w-full bg-muted rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <button
                    type="submit"
                    disabled={addVrat.isPending || !vratName.trim() || !vratDate.trim()}
                    className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {addVrat.isPending ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> जोड़ा जा रहा है...</>
                    ) : (
                      'व्रत जोड़ें'
                    )}
                  </button>
                </form>
              </div>

              {/* Vrat List */}
              <div>
                <h3 className="font-medium text-foreground text-sm mb-3">सभी व्रत</h3>
                {vratsLoading ? (
                  <div className="space-y-2">
                    {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}
                  </div>
                ) : vrats && vrats.length > 0 ? (
                  <div className="space-y-2">
                    {vrats.map(vrat => (
                      <div key={vrat.id.toString()} className="bg-card border border-border rounded-xl p-3 flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{vrat.name}</p>
                          <p className="text-xs text-muted-foreground">{vrat.date}</p>
                        </div>
                        <button
                          onClick={() => deleteVrat.mutate(vrat.id)}
                          disabled={deleteVrat.isPending}
                          className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex-shrink-0"
                        >
                          {deleteVrat.isPending ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm text-center py-4">कोई व्रत नहीं है</p>
                )}
              </div>
            </div>
          </TabsContent>

          {/* ── Users Tab ── */}
          <TabsContent value="users">
            <div className="bg-card border border-border rounded-xl p-4">
              <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-500" />
                User Approvals
              </h2>
              {approvalsLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map(i => <Skeleton key={i} className="h-14 w-full rounded-xl" />)}
                </div>
              ) : approvals && approvals.length > 0 ? (
                <div className="space-y-2">
                  {approvals.map((approval, idx) => (
                    <div key={idx} className="flex items-center justify-between gap-2 p-3 bg-muted rounded-xl">
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-foreground truncate">
                          {approval.principal.toString().slice(0, 20)}...
                        </p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {typeof approval.status === 'string'
                            ? approval.status
                            : JSON.stringify(approval.status)}
                        </p>
                      </div>
                      <div className="flex gap-1.5 flex-shrink-0">
                        <button
                          onClick={() => setApproval.mutate({ user: approval.principal, status: { approved: null } })}
                          disabled={setApproval.isPending}
                          className="px-2 py-1 bg-green-500 hover:bg-green-600 text-white text-xs rounded-lg transition-colors disabled:opacity-50"
                        >
                          ✓
                        </button>
                        <button
                          onClick={() => setApproval.mutate({ user: approval.principal, status: { rejected: null } })}
                          disabled={setApproval.isPending}
                          className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white text-xs rounded-lg transition-colors disabled:opacity-50"
                        >
                          ✗
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm text-center py-4">कोई approval request नहीं है</p>
              )}
            </div>
          </TabsContent>

          {/* ── Quotes Tab ── */}
          <TabsContent value="quotes">
            <div className="bg-card border border-border rounded-xl p-4">
              <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Quote className="w-4 h-4 text-amber-500" />
                Dharma Quotes
              </h2>
              <p className="text-muted-foreground text-sm">
                Dharma quotes backend से manage होते हैं। यहाँ future में quote management add होगा।
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
