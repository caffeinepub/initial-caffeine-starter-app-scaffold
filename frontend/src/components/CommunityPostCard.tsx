import React, { useState, useMemo } from 'react';
import { Heart, Flag, FileText, Play, Pause } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { CommunityPost } from '../backend';
import { useLikeCommunityPost } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

interface CommunityPostCardProps {
  post: CommunityPost;
}

function ImageWithSkeleton({ src, alt }: { src: string; alt: string }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className="relative w-full rounded-lg overflow-hidden bg-muted" style={{ minHeight: 180 }}>
      {!loaded && !error && (
        <Skeleton className="absolute inset-0 w-full h-full rounded-lg" />
      )}
      {!error && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          className={`w-full object-cover rounded-lg transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          style={{ maxHeight: 320 }}
          onLoad={() => setLoaded(true)}
          onError={() => { setError(true); setLoaded(true); }}
        />
      )}
      {error && (
        <div className="flex items-center justify-center h-44 text-muted-foreground text-sm">
          Image load failed
        </div>
      )}
    </div>
  );
}

export default function CommunityPostCard({ post }: CommunityPostCardProps) {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const likeMutation = useLikeCommunityPost();

  // Cache direct URLs using useMemo to avoid recreating on every render
  const imageUrl = useMemo(() => {
    if (!post.image) return null;
    return post.image.getDirectURL();
  }, [post.image]);

  const videoUrl = useMemo(() => {
    if (!post.video) return null;
    return post.video.getDirectURL();
  }, [post.video]);

  const fileUrl = useMemo(() => {
    if (!post.fileAttachment) return null;
    return post.fileAttachment.blob.getDirectURL();
  }, [post.fileAttachment]);

  const handleLike = () => {
    if (!isAuthenticated) return;
    likeMutation.mutate(post.id);
  };

  const authorShort = post.author.toString().slice(0, 8) + '...';
  const timeAgo = formatTimeAgo(Number(post.timestamp));

  return (
    <article className="bg-card border border-border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
          {authorShort[0]?.toUpperCase() ?? '?'}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">{authorShort}</p>
          <p className="text-xs text-muted-foreground">{timeAgo}</p>
        </div>
        {post.deityTag && (
          <span className="text-xs bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 px-2 py-0.5 rounded-full font-medium">
            {post.deityTag}
          </span>
        )}
      </div>

      {/* Content */}
      {post.content && (
        <p className="text-foreground text-sm leading-relaxed mb-3 whitespace-pre-wrap">
          {post.content}
        </p>
      )}

      {/* Image — lazy loaded with skeleton */}
      {imageUrl && (
        <div className="mb-3">
          <ImageWithSkeleton src={imageUrl} alt="Community post image" />
        </div>
      )}

      {/* Video */}
      {videoUrl && (
        <div className="mb-3">
          <video
            src={videoUrl}
            controls
            preload="metadata"
            className="w-full rounded-lg max-h-72 bg-black"
            style={{ display: 'block' }}
          />
        </div>
      )}

      {/* File Attachment */}
      {fileUrl && post.fileAttachment && (
        <div className="mb-3">
          <a
            href={fileUrl}
            download={post.fileAttachment.filename}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 p-2 bg-muted rounded-lg text-sm text-foreground hover:bg-muted/80 transition-colors"
          >
            <FileText className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span className="truncate">{post.fileAttachment.filename}</span>
          </a>
        </div>
      )}

      {/* Footer Actions */}
      <div className="flex items-center gap-4 pt-2 border-t border-border/50">
        <button
          onClick={handleLike}
          disabled={!isAuthenticated || likeMutation.isPending}
          className={`flex items-center gap-1.5 text-sm transition-colors ${
            isAuthenticated
              ? 'text-muted-foreground hover:text-red-500 cursor-pointer'
              : 'text-muted-foreground/50 cursor-default'
          }`}
          title={isAuthenticated ? 'Like this post' : 'Login to like'}
        >
          <Heart
            className={`w-4 h-4 ${likeMutation.isPending ? 'animate-pulse' : ''}`}
          />
          <span>{Number(post.likes)}</span>
        </button>

        {!isAuthenticated && (
          <span className="text-xs text-muted-foreground ml-auto">
            Login करें like करने के लिए
          </span>
        )}
      </div>
    </article>
  );
}

function formatTimeAgo(timestamp: number): string {
  // timestamp is in nanoseconds from IC
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
  if (days < 30) return `${days} दिन पहले`;
  return new Date(ms).toLocaleDateString('hi-IN');
}
