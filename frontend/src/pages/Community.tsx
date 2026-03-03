import React, { useState } from 'react';
import { Users, Plus, Image, Video, X, Loader2, Clock, LogIn } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import CommunityPostCard from '../components/CommunityPostCard';
import {
  useGetApprovedCommunityPosts,
  useCreateCommunityPost,
} from '../hooks/useQueries';
import { useAuth } from '../hooks/useAuth';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { ExternalBlob } from '../backend';

export default function Community() {
  const { isAuthenticated, user } = useAuth();
  const { login, loginStatus } = useInternetIdentity();

  const { data: posts, isLoading } = useGetApprovedCommunityPosts();

  const [showForm, setShowForm] = useState(false);
  const [content, setContent] = useState('');
  const [deityTag, setDeityTag] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const createPost = useCreateCommunityPost();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !imageFile && !videoFile) return;

    let imageBlob: ExternalBlob | undefined;
    let videoBlob: ExternalBlob | undefined;

    if (imageFile) {
      const bytes = new Uint8Array(await imageFile.arrayBuffer());
      imageBlob = ExternalBlob.fromBytes(bytes).withUploadProgress(p => setUploadProgress(p));
    }
    if (videoFile) {
      const bytes = new Uint8Array(await videoFile.arrayBuffer());
      videoBlob = ExternalBlob.fromBytes(bytes).withUploadProgress(p => setUploadProgress(p));
    }

    createPost.mutate(
      {
        content: content.trim(),
        deityTag: deityTag.trim() || undefined,
        image: imageBlob,
        video: videoBlob,
      },
      {
        onSuccess: () => {
          setContent('');
          setDeityTag('');
          setImageFile(null);
          setVideoFile(null);
          setUploadProgress(0);
          setShowForm(false);
        },
      }
    );
  };

  const sortedPosts = posts
    ? [...posts].sort((a, b) => Number(b.timestamp) - Number(a.timestamp))
    : [];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="bg-gradient-to-br from-amber-600 to-orange-500 px-4 pt-6 pb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-white font-bold text-xl">समुदाय</h1>
            <p className="text-amber-100 text-sm">भक्तों का परिवार</p>
          </div>
        </div>
        <p className="text-amber-100 text-sm mt-2">
          अपनी भक्ति, अनुभव और प्रेरणा यहाँ साझा करें
        </p>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Auth Guard — show login prompt if not authenticated */}
        {!isAuthenticated ? (
          <div className="bg-card border border-border rounded-2xl p-6 text-center space-y-4">
            <div className="text-4xl">🙏</div>
            <div>
              <h3 className="font-bold text-foreground text-lg mb-1">Login करें</h3>
              <p className="text-muted-foreground text-sm">
                Community posts देखने और share करने के लिए Login आवश्यक है।
              </p>
            </div>
            <button
              onClick={() => login()}
              disabled={loginStatus === 'logging-in'}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {loginStatus === 'logging-in' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <LogIn className="w-4 h-4" />
              )}
              {loginStatus === 'logging-in' ? 'Logging in...' : 'Login करें'}
            </button>
          </div>
        ) : (
          <>
            {/* Post Creation — only for authenticated users */}
            <div className="bg-card border border-border rounded-xl p-4">
              {!showForm ? (
                <button
                  onClick={() => setShowForm(true)}
                  className="w-full flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-sm">
                    {user?.username?.[0]?.toUpperCase() ?? '🙏'}
                  </div>
                  <span className="flex-1 text-left text-sm bg-muted rounded-full px-4 py-2">
                    अपनी भक्ति साझा करें...
                  </span>
                  <Plus className="w-5 h-5" />
                </button>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3">
                  <textarea
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    placeholder="अपनी भक्ति, अनुभव या प्रेरणा लिखें..."
                    className="w-full bg-muted rounded-lg p-3 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-amber-500"
                    rows={3}
                    autoFocus
                  />

                  <input
                    type="text"
                    value={deityTag}
                    onChange={e => setDeityTag(e.target.value)}
                    placeholder="देवता tag (जैसे: श्री राम, कृष्ण)"
                    className="w-full bg-muted rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />

                  {/* Media Buttons */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <label className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-amber-600 cursor-pointer transition-colors">
                      <Image className="w-4 h-4" />
                      <span>Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={e => setImageFile(e.target.files?.[0] ?? null)}
                      />
                    </label>
                    <label className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-amber-600 cursor-pointer transition-colors">
                      <Video className="w-4 h-4" />
                      <span>Video</span>
                      <input
                        type="file"
                        accept="video/*"
                        className="hidden"
                        onChange={e => setVideoFile(e.target.files?.[0] ?? null)}
                      />
                    </label>

                    {imageFile && (
                      <span className="text-xs text-amber-600 flex items-center gap-1">
                        📷 {imageFile.name.slice(0, 15)}
                        <button type="button" onClick={() => setImageFile(null)}>
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                    {videoFile && (
                      <span className="text-xs text-amber-600 flex items-center gap-1">
                        🎥 {videoFile.name.slice(0, 15)}
                        <button type="button" onClick={() => setVideoFile(null)}>
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                  </div>

                  {uploadProgress > 0 && uploadProgress < 100 && (
                    <div className="w-full bg-muted rounded-full h-1.5">
                      <div
                        className="bg-amber-500 h-1.5 rounded-full transition-all"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="flex-1 py-2 rounded-lg bg-muted text-muted-foreground text-sm hover:bg-muted/80 transition-colors"
                    >
                      रद्द करें
                    </button>
                    <button
                      type="submit"
                      disabled={createPost.isPending || (!content.trim() && !imageFile && !videoFile)}
                      className="flex-1 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {createPost.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                      पोस्ट करें
                    </button>
                  </div>

                  <div className="flex items-center gap-2 p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                    <Clock className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                    <p className="text-xs text-amber-700 dark:text-amber-300">
                      आपकी पोस्ट Admin approval के बाद दिखेगी
                    </p>
                  </div>
                </form>
              )}
            </div>

            {/* Posts Feed */}
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-card border border-border rounded-xl p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <Skeleton className="w-10 h-10 rounded-full" />
                      <div className="space-y-1">
                        <Skeleton className="h-3 w-24" />
                        <Skeleton className="h-2 w-16" />
                      </div>
                    </div>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                ))}
              </div>
            ) : sortedPosts.length > 0 ? (
              <div className="space-y-4">
                {sortedPosts.map(post => (
                  <CommunityPostCard key={post.id.toString()} post={post} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-4xl mb-3">🙏</div>
                <p className="text-foreground font-medium">अभी कोई पोस्ट नहीं है</p>
                <p className="text-muted-foreground text-sm mt-1">पहले भक्त बनें और अपनी भक्ति साझा करें</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
