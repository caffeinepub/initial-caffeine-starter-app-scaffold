import { Skeleton } from "@/components/ui/skeleton";
import { Heart } from "lucide-react";
import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import type { LocalCommunityPost } from "../hooks/useCommunityPosts";
import { useCommunityPosts } from "../hooks/useCommunityPosts";

interface CommunityPostCardProps {
  post: LocalCommunityPost;
  "data-ocid"?: string;
}

function ImageWithSkeleton({ src, alt }: { src: string; alt: string }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div
      className="relative w-full rounded-lg overflow-hidden bg-muted"
      style={{ minHeight: 180 }}
    >
      {!loaded && !error && (
        <Skeleton className="absolute inset-0 w-full h-full rounded-lg" />
      )}
      {!error && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          className={`w-full object-cover rounded-lg transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
          style={{ maxHeight: 320 }}
          onLoad={() => setLoaded(true)}
          onError={() => {
            setError(true);
            setLoaded(true);
          }}
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

// Derive a consistent gradient color from a string (username)
function getAvatarColor(str: string): string {
  const colors = [
    "from-amber-400 to-orange-500",
    "from-rose-400 to-pink-500",
    "from-violet-400 to-purple-500",
    "from-teal-400 to-cyan-500",
    "from-green-400 to-emerald-500",
    "from-blue-400 to-indigo-500",
  ];
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) % colors.length;
  }
  return colors[Math.abs(hash) % colors.length];
}

function formatTimeAgo(timestampMs: number): string {
  const now = Date.now();
  const diff = now - timestampMs;
  if (diff < 0) return "अभी";
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return "अभी";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} मिनट पहले`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} घंटे पहले`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} दिन पहले`;
  return new Date(timestampMs).toLocaleDateString("hi-IN");
}

export default function CommunityPostCard({
  post,
  "data-ocid": dataOcid,
}: CommunityPostCardProps) {
  const { isAuthenticated } = useAuth();
  const { likePost } = useCommunityPosts();

  const avatarColor = getAvatarColor(post.author);
  const avatarLetter = post.author[0]?.toUpperCase() ?? "?";
  const timeAgo = formatTimeAgo(post.timestamp);

  const handleLike = () => {
    if (!isAuthenticated) return;
    likePost(post.id);
  };

  return (
    <article
      data-ocid={dataOcid}
      className="bg-card border border-border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <div
          className={`w-10 h-10 rounded-full bg-gradient-to-br ${avatarColor} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}
        >
          {avatarLetter}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">
            भक्त {post.author}
          </p>
          <p className="text-xs text-muted-foreground">{timeAgo}</p>
        </div>
        {post.deityTag && (
          <span className="text-xs bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 px-2 py-0.5 rounded-full font-medium shrink-0">
            🙏 {post.deityTag}
          </span>
        )}
      </div>

      {/* Content */}
      {post.content && (
        <p className="text-foreground text-sm leading-relaxed mb-3 whitespace-pre-wrap">
          {post.content}
        </p>
      )}

      {/* Image — base64 dataURL works in APK WebView */}
      {post.imageDataUrl && (
        <div className="mb-3">
          <ImageWithSkeleton
            src={post.imageDataUrl}
            alt="Community post image"
          />
        </div>
      )}

      {/* Footer Actions */}
      <div className="flex items-center gap-4 pt-2 border-t border-border/50">
        <button
          type="button"
          data-ocid="community.post.like_button"
          onClick={handleLike}
          disabled={!isAuthenticated}
          className={`flex items-center gap-1.5 text-sm transition-colors ${
            isAuthenticated
              ? "text-muted-foreground hover:text-red-500 cursor-pointer"
              : "text-muted-foreground/50 cursor-default"
          }`}
          title={isAuthenticated ? "Like this post" : "Login to like"}
        >
          <Heart className="w-4 h-4" />
          <span>{post.likes}</span>
        </button>

        {!isAuthenticated && (
          <span className="text-xs text-muted-foreground ml-auto">
            Like के लिए Login करें
          </span>
        )}
      </div>
    </article>
  );
}
