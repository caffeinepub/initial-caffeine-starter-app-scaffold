import { Skeleton } from "@/components/ui/skeleton";
import { Heart, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import type { CommunityPost } from "../backend";
import { useAuth } from "../hooks/useAuth";
import { getPostMedia } from "../hooks/useQueries";
import { useLikeCommunityPost } from "../hooks/useQueries";

interface ICPCommunityPostCardProps {
  post: CommunityPost;
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

function YoutubeEmbed({ url }: { url: string }) {
  // Extract YouTube video ID
  let videoId: string | null = null;

  try {
    if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1].split(/[?&]/)[0];
    } else if (url.includes("youtube.com/watch")) {
      const u = new URL(url);
      videoId = u.searchParams.get("v");
    } else if (url.includes("youtube.com/embed/")) {
      videoId = url.split("youtube.com/embed/")[1].split(/[?&]/)[0];
    } else if (url.includes("youtube.com/shorts/")) {
      videoId = url.split("youtube.com/shorts/")[1].split(/[?&]/)[0];
    }
  } catch {
    // ignore
  }

  if (!videoId) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-amber-500 underline break-all"
      >
        🎬 {url}
      </a>
    );
  }

  return (
    <div
      className="relative w-full rounded-lg overflow-hidden bg-black"
      style={{ paddingBottom: "56.25%" }}
    >
      <iframe
        className="absolute inset-0 w-full h-full rounded-lg"
        src={`https://www.youtube.com/embed/${videoId}`}
        title="YouTube video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}

// Derive a consistent gradient color from a string (principal)
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

function formatTimeAgo(timestampNs: bigint): string {
  // ICP timestamps are in nanoseconds
  const timestampMs = Number(timestampNs / 1_000_000n);
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

function isYoutubeUrl(url: string): boolean {
  return url.includes("youtube.com") || url.includes("youtu.be");
}

export default function ICPCommunityPostCard({
  post,
  "data-ocid": dataOcid,
}: ICPCommunityPostCardProps) {
  const { isAuthenticated } = useAuth();
  const likeMutation = useLikeCommunityPost();
  const [shareCopied, setShareCopied] = useState(false);

  // Use principal toString as author display
  const authorStr = post.author?.toString?.() ?? "भक्त";
  // Show short version of principal
  const authorDisplay =
    authorStr.length > 12
      ? `${authorStr.slice(0, 5)}...${authorStr.slice(-4)}`
      : authorStr;

  const avatarColor = getAvatarColor(authorStr);
  const timeAgo = formatTimeAgo(post.timestamp);

  // Resolve image URL from ExternalBlob via useEffect
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  // Load media sidecar from localStorage (image/video stored client-side)
  const postMedia = getPostMedia(post.id.toString());
  const localImageDataUrl = postMedia?.imageDataUrl ?? null;
  const localVideoUrl = postMedia?.videoUrl ?? null;

  useEffect(() => {
    if (post.image) {
      try {
        const url = post.image.getDirectURL();
        if (url) setImageUrl(url);
      } catch {
        setImageUrl(null);
      }
    } else {
      setImageUrl(null);
    }
  }, [post.image]);

  // Use ExternalBlob image first, then localStorage base64 fallback
  const displayImageSrc = imageUrl || localImageDataUrl;

  const handleLike = () => {
    if (!isAuthenticated) return;
    likeMutation.mutate(post.id);
  };

  const handleShare = async () => {
    const shareText = `${post.content ? post.content.slice(0, 100) : "भक्ति"} — सनातन प्रो ऐप से`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "सनातन प्रो — भक्ति पोस्ट",
          text: shareText,
          url: window.location.href,
        });
      } catch {
        // User cancelled or not supported
        copyToClipboard(shareText);
      }
    } else {
      copyToClipboard(shareText);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 2000);
      })
      .catch(() => {
        // ignore
      });
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
          🙏
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">
            भक्त {authorDisplay}
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

      {/* Image — from ICP ExternalBlob or localStorage base64 */}
      {displayImageSrc && (
        <div className="mb-3">
          <ImageWithSkeleton src={displayImageSrc} alt="Community post image" />
        </div>
      )}

      {/* Video — YouTube embed or link */}
      {localVideoUrl && (
        <div className="mb-3">
          {isYoutubeUrl(localVideoUrl) ? (
            <YoutubeEmbed url={localVideoUrl} />
          ) : (
            <a
              href={localVideoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-amber-500 hover:text-amber-400 underline break-all"
            >
              🎬 वीडियो देखें
            </a>
          )}
        </div>
      )}

      {/* Footer Actions */}
      <div className="flex items-center gap-4 pt-2 border-t border-border/50">
        <button
          type="button"
          data-ocid="community.post.like_button"
          onClick={handleLike}
          disabled={!isAuthenticated || likeMutation.isPending}
          className={`flex items-center gap-1.5 text-sm transition-colors ${
            isAuthenticated
              ? "text-muted-foreground hover:text-red-500 cursor-pointer"
              : "text-muted-foreground/50 cursor-default"
          }`}
          title={isAuthenticated ? "Like this post" : "Login to like"}
        >
          <Heart className="w-4 h-4" />
          <span>{post.likes.toString()}</span>
        </button>

        {/* Share Button */}
        <button
          type="button"
          data-ocid="community.post.share_button"
          onClick={handleShare}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-amber-500 transition-colors cursor-pointer"
          title="Share this post"
        >
          <Share2 className="w-4 h-4" />
          <span>{shareCopied ? "कॉपी हो गया!" : "शेयर"}</span>
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
