import React, { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useIsCallerApproved, useRequestApproval } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Heart, Flag, Plus, Clock, Loader2, UserCheck } from 'lucide-react';
import { toast } from 'sonner';

interface Post {
  id: number;
  author: string;
  content: string;
  timestamp: string;
  likes: number;
  status: 'pending' | 'approved';
  liked: boolean;
}

const SEED_POSTS: Post[] = [
  {
    id: 1,
    author: 'Priya Sharma',
    content: 'आज एकादशी का व्रत रखा। भगवान विष्णु की कृपा से मन बहुत शांत है। 🙏',
    timestamp: '2 hours ago',
    likes: 24,
    status: 'approved',
    liked: false,
  },
  {
    id: 2,
    author: 'Rajesh Kumar',
    content: 'Visited Kashi Vishwanath temple today. The divine energy there is indescribable. Har Har Mahadev! 🕉️',
    timestamp: '5 hours ago',
    likes: 41,
    status: 'approved',
    liked: false,
  },
  {
    id: 3,
    author: 'Meera Devi',
    content: 'सत्यनारायण कथा सुनी आज। जीवन में सत्य और धर्म का पालन करना ही सबसे बड़ी पूजा है।',
    timestamp: '1 day ago',
    likes: 18,
    status: 'approved',
    liked: false,
  },
];

export default function Community() {
  const { identity } = useInternetIdentity();
  const { data: isApproved, isLoading: approvalLoading } = useIsCallerApproved();
  const requestApprovalMutation = useRequestApproval();

  const [posts, setPosts] = useState<Post[]>(SEED_POSTS);
  const [composeOpen, setComposeOpen] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');

  const isAuthenticated = !!identity;

  const handleLike = (postId: number) => {
    if (!isAuthenticated) {
      toast.error('Please log in to like posts');
      return;
    }
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
          : p
      )
    );
  };

  const handleReport = (postId: number) => {
    toast.info('Post reported for review');
  };

  const handleSubmitPost = () => {
    if (!newPostContent.trim()) return;
    const newPost: Post = {
      id: Date.now(),
      author: 'You',
      content: newPostContent.trim(),
      timestamp: 'Just now',
      likes: 0,
      status: 'pending',
      liked: false,
    };
    setPosts((prev) => [newPost, ...prev]);
    setNewPostContent('');
    setComposeOpen(false);
    toast.success('Post submitted for review');
  };

  const handleRequestApproval = () => {
    requestApprovalMutation.mutate(undefined, {
      onSuccess: () => toast.success('Approval request submitted!'),
      onError: () => toast.error('Failed to submit approval request'),
    });
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-foreground">Community</h1>
          {isAuthenticated && !approvalLoading && !isApproved && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleRequestApproval}
              disabled={requestApprovalMutation.isPending}
              className="gap-1.5"
            >
              {requestApprovalMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <UserCheck className="w-4 h-4" />
              )}
              Request Access
            </Button>
          )}
        </div>

        {/* Posts */}
        <div className="space-y-4">
          {posts.map((post) => (
            <Card key={post.id} className="border border-border">
              <CardContent className="pt-4 pb-3 px-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="font-semibold text-sm text-foreground">{post.author}</span>
                    <span className="text-xs text-muted-foreground ml-2">{post.timestamp}</span>
                  </div>
                  {post.status === 'pending' && (
                    <Badge variant="outline" className="text-xs shrink-0">
                      <Clock className="w-3 h-3 mr-1" />
                      Pending Review
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-foreground leading-relaxed mb-3">{post.content}</p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center gap-1 text-xs transition-colors ${
                      post.liked
                        ? 'text-rose-500'
                        : 'text-muted-foreground hover:text-rose-500'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${post.liked ? 'fill-current' : ''}`} />
                    {post.likes}
                  </button>
                  <button
                    onClick={() => handleReport(post.id)}
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Flag className="w-4 h-4" />
                    Report
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Floating Compose Button */}
        {isAuthenticated && (
          <button
            onClick={() => setComposeOpen(true)}
            className="fixed bottom-24 right-6 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:bg-primary/90 transition-colors z-20"
          >
            <Plus className="w-6 h-6" />
          </button>
        )}

        {/* Compose Dialog */}
        <Dialog open={composeOpen} onOpenChange={setComposeOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Share with Community</DialogTitle>
            </DialogHeader>
            <Textarea
              placeholder="Share your spiritual thoughts, experiences, or prayers... (max 280 characters)"
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value.slice(0, 280))}
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground text-right">
              {newPostContent.length}/280
            </p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setComposeOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleSubmitPost}
                disabled={!newPostContent.trim()}
              >
                Submit for Review
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
