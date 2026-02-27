import React, { useState } from 'react';
import { Heart, Flag, Plus, Send, Loader2, MessageCircle, Users, Lock } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import {
  useGetApprovedCommunityPosts,
  useCreateCommunityPost,
  useLikeCommunityPost,
  useReportCommunityPost,
  useIsCallerApproved,
  useRequestApproval,
} from '../hooks/useQueries';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

// Seed posts shown when no backend posts exist
const SEED_POSTS = [
  {
    id: -1,
    author: 'भक्त रामदास',
    content: '🙏 आज सुबह ब्रह्म मुहूर्त में उठकर गायत्री मंत्र का जाप किया। मन को अद्भुत शांति मिली। हर हर महादेव! 🕉️',
    timestamp: Date.now() - 2 * 60 * 60 * 1000,
    likes: 24,
    comments: 5,
    reports: 0,
  },
  {
    id: -2,
    author: 'माँ लक्ष्मी भक्त',
    content: '🌸 एकादशी का व्रत रखा और विष्णु सहस्रनाम का पाठ किया। भगवान की कृपा से सब कुछ ठीक हो रहा है। जय श्री हरि! 🙏',
    timestamp: Date.now() - 5 * 60 * 60 * 1000,
    likes: 18,
    comments: 3,
    reports: 0,
  },
  {
    id: -3,
    author: 'कृष्ण भक्त',
    content: '🎵 हरे कृष्ण हरे कृष्ण, कृष्ण कृष्ण हरे हरे। आज मंदिर में भजन-कीर्तन में भाग लिया। राधे राधे! 💛',
    timestamp: Date.now() - 24 * 60 * 60 * 1000,
    likes: 31,
    comments: 8,
    reports: 0,
  },
];

function timeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (days > 0) return `${days} दिन पहले`;
  if (hours > 0) return `${hours} घंटे पहले`;
  if (minutes > 0) return `${minutes} मिनट पहले`;
  return 'अभी';
}

interface SeedPost {
  id: number;
  author: string;
  content: string;
  timestamp: number;
  likes: number;
  comments: number;
  reports: number;
}

function SeedPostCard({ post }: { post: SeedPost }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);

  const handleLike = () => {
    if (!liked) {
      setLiked(true);
      setLikeCount(c => c + 1);
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4 space-y-3">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
          {post.author.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-foreground text-sm">{post.author}</p>
          <p className="text-muted-foreground text-xs">{timeAgo(post.timestamp)}</p>
        </div>
      </div>
      <p className="text-foreground text-sm leading-relaxed">{post.content}</p>
      <div className="flex items-center gap-4 pt-1">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1.5 text-sm transition-colors ${
            liked ? 'text-rose-500' : 'text-muted-foreground hover:text-rose-500'
          }`}
        >
          <Heart className={`w-4 h-4 ${liked ? 'fill-rose-500' : ''}`} />
          <span>{likeCount}</span>
        </button>
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MessageCircle className="w-4 h-4" />
          <span>{post.comments}</span>
        </div>
      </div>
    </div>
  );
}

interface BackendPost {
  id: bigint;
  author: { toString(): string };
  content: string;
  timestamp: bigint;
  likes: bigint;
  comments: bigint;
  reports: bigint;
}

function BackendPostCard({ post }: { post: BackendPost }) {
  const { identity } = useInternetIdentity();
  const likeMutation = useLikeCommunityPost();
  const reportMutation = useReportCommunityPost();
  const [localLikes, setLocalLikes] = useState(Number(post.likes));
  const [liked, setLiked] = useState(false);
  const [reported, setReported] = useState(false);

  const handleLike = async () => {
    if (liked || !identity) return;
    setLiked(true);
    setLocalLikes(c => c + 1);
    try {
      await likeMutation.mutateAsync(post.id);
    } catch {
      setLiked(false);
      setLocalLikes(c => c - 1);
    }
  };

  const handleReport = async () => {
    if (reported || !identity) return;
    setReported(true);
    try {
      await reportMutation.mutateAsync(post.id);
    } catch {
      setReported(false);
    }
  };

  const authorStr = post.author.toString();
  const shortAuthor = authorStr.length > 12 ? authorStr.slice(0, 6) + '...' + authorStr.slice(-4) : authorStr;
  const ts = Number(post.timestamp);
  const timeDisplay = ts > 1e15 ? timeAgo(Math.floor(ts / 1_000_000)) : timeAgo(ts);

  return (
    <div className="bg-card border border-border rounded-xl p-4 space-y-3">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-saffron to-gold flex items-center justify-center text-white font-bold text-sm shrink-0">
          भ
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-foreground text-sm font-mono">{shortAuthor}</p>
          <p className="text-muted-foreground text-xs">{timeDisplay}</p>
        </div>
      </div>
      <p className="text-foreground text-sm leading-relaxed">{post.content}</p>
      <div className="flex items-center gap-4 pt-1">
        <button
          onClick={handleLike}
          disabled={!identity || liked}
          className={`flex items-center gap-1.5 text-sm transition-colors ${
            liked ? 'text-rose-500' : 'text-muted-foreground hover:text-rose-500'
          } disabled:opacity-50`}
        >
          <Heart className={`w-4 h-4 ${liked ? 'fill-rose-500' : ''}`} />
          <span>{localLikes}</span>
        </button>
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MessageCircle className="w-4 h-4" />
          <span>{Number(post.comments)}</span>
        </div>
        {identity && (
          <button
            onClick={handleReport}
            disabled={reported}
            className={`flex items-center gap-1.5 text-sm ml-auto transition-colors ${
              reported ? 'text-orange-500' : 'text-muted-foreground hover:text-orange-500'
            } disabled:opacity-50`}
          >
            <Flag className="w-4 h-4" />
            <span className="text-xs">{reported ? 'रिपोर्ट किया' : 'रिपोर्ट'}</span>
          </button>
        )}
      </div>
    </div>
  );
}

export default function Community() {
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const isAuthenticated = !!identity;

  const { data: posts = [], isLoading: postsLoading } = useGetApprovedCommunityPosts();
  const { data: isApproved, isLoading: approvalLoading } = useIsCallerApproved();
  const requestApprovalMutation = useRequestApproval();
  const createPostMutation = useCreateCommunityPost();

  const [composeOpen, setComposeOpen] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [approvalRequested, setApprovalRequested] = useState(false);

  const handleRequestApproval = async () => {
    try {
      await requestApprovalMutation.mutateAsync();
      setApprovalRequested(true);
      queryClient.invalidateQueries({ queryKey: ['isCallerApproved'] });
    } catch (err) {
      console.error('Approval request failed:', err);
    }
  };

  const handleSubmitPost = async () => {
    if (!postContent.trim()) return;
    try {
      await createPostMutation.mutateAsync(postContent.trim());
      setPostContent('');
      setComposeOpen(false);
    } catch (err) {
      console.error('Post creation failed:', err);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-900 to-orange-900 px-4 pt-6 pb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">सत्संग समुदाय</h1>
            <p className="text-amber-200 text-sm mt-1">भक्तों का मिलन स्थल</p>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-300" />
            <span className="text-amber-200 text-sm">समुदाय</span>
          </div>
        </div>
      </div>

      <div className="px-4 -mt-4 space-y-4">
        {/* Compose button / Auth prompt */}
        {!isAuthenticated ? (
          <div className="bg-card border border-border rounded-xl p-4 text-center">
            <Lock className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-foreground font-medium text-sm mb-1">समुदाय में शामिल हों</p>
            <p className="text-muted-foreground text-xs">पोस्ट करने के लिए लॉगिन करें</p>
          </div>
        ) : !approvalLoading && isApproved === false ? (
          <div className="bg-amber-950 border border-amber-800 rounded-xl p-4">
            <p className="text-amber-200 font-medium text-sm mb-1">🙏 अनुमोदन आवश्यक है</p>
            <p className="text-amber-400 text-xs mb-3">
              पोस्ट करने के लिए व्यवस्थापक की अनुमति आवश्यक है।
            </p>
            {approvalRequested ? (
              <p className="text-green-400 text-sm font-medium">✓ अनुरोध भेज दिया गया है</p>
            ) : (
              <Button
                size="sm"
                onClick={handleRequestApproval}
                disabled={requestApprovalMutation.isPending}
                className="bg-amber-600 hover:bg-amber-500 text-white"
              >
                {requestApprovalMutation.isPending ? (
                  <><Loader2 className="w-3 h-3 mr-1 animate-spin" /> भेज रहे हैं...</>
                ) : (
                  'अनुमोदन अनुरोध करें'
                )}
              </Button>
            )}
          </div>
        ) : isAuthenticated && isApproved ? (
          <button
            onClick={() => setComposeOpen(true)}
            className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white rounded-xl p-4 flex items-center gap-3 transition-all shadow-md"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">नई पोस्ट लिखें...</span>
          </button>
        ) : null}

        {/* Posts feed */}
        {postsLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
          </div>
        ) : posts.length > 0 ? (
          <div className="space-y-4">
            {posts.map((post) => (
              <BackendPostCard key={String(post.id)} post={post} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-muted-foreground text-xs text-center py-2">
              — समुदाय की पोस्टें —
            </p>
            {SEED_POSTS.map((post) => (
              <SeedPostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>

      {/* Compose Dialog */}
      <Dialog open={composeOpen} onOpenChange={setComposeOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>नई पोस्ट लिखें</DialogTitle>
          </DialogHeader>
          <div className="py-2">
            <Textarea
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              placeholder="अपने भक्ति अनुभव साझा करें... 🙏"
              className="min-h-[120px] resize-none"
              maxLength={500}
            />
            <p className="text-muted-foreground text-xs mt-1 text-right">
              {postContent.length}/500
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setComposeOpen(false)}>
              रद्द करें
            </Button>
            <Button
              onClick={handleSubmitPost}
              disabled={!postContent.trim() || createPostMutation.isPending}
              className="bg-amber-600 hover:bg-amber-500 text-white"
            >
              {createPostMutation.isPending ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> पोस्ट हो रहा है...</>
              ) : (
                <><Send className="w-4 h-4 mr-2" /> पोस्ट करें</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
