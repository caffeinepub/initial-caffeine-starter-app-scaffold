import { useState } from 'react';
import { CommunityPost } from '../backend';
import { useLikeCommunityPost } from '../hooks/useQueries';
import { Download, FileText } from 'lucide-react';

interface CommunityPostCardProps {
  post: CommunityPost;
}

export default function CommunityPostCard({ post }: CommunityPostCardProps) {
  const likeMutation = useLikeCommunityPost();
  const [liked, setLiked] = useState(false);

  const handleLike = () => {
    if (!liked) {
      setLiked(true);
      likeMutation.mutate(post.id);
    }
  };

  const timeAgo = (timestamp: bigint) => {
    const now = Date.now();
    const postTime = Number(timestamp) / 1_000_000;
    const diff = now - postTime;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (days > 0) return `${days} दिन पहले`;
    if (hours > 0) return `${hours} घंटे पहले`;
    if (minutes > 0) return `${minutes} मिनट पहले`;
    return 'अभी';
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-4 hover:border-gold-500/30 hover:scale-[1.01] transition-all duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-saffron-600 to-gold-500 flex items-center justify-center text-white text-sm font-bold">
            🙏
          </div>
          <div>
            <p className="text-foreground text-sm font-medium">भक्त</p>
            <p className="text-muted-foreground text-xs">{timeAgo(post.timestamp)}</p>
          </div>
        </div>
        {post.deityTag && (
          <span className="bg-saffron-700/30 text-amber-300 text-xs px-2 py-1 rounded-full border border-amber-500/30">
            🕉️ {post.deityTag}
          </span>
        )}
      </div>

      {/* Content text */}
      {post.content && (
        <p className="text-foreground text-sm leading-relaxed mb-3">{post.content}</p>
      )}

      {/* Image attachment */}
      {post.image && (
        <div className="mb-3 rounded-xl overflow-hidden border border-border/50">
          <img
            src={post.image.getDirectURL()}
            alt="पोस्ट की छवि"
            className="w-full max-h-72 object-cover"
            loading="lazy"
          />
        </div>
      )}

      {/* Video attachment */}
      {post.video && (
        <div className="mb-3 rounded-xl overflow-hidden border border-border/50">
          <video
            src={post.video.getDirectURL()}
            controls
            className="w-full max-h-72"
            preload="metadata"
          >
            आपका ब्राउज़र वीडियो नहीं चला सकता।
          </video>
        </div>
      )}

      {/* File attachment */}
      {post.fileAttachment && (
        <div className="mb-3">
          <a
            href={post.fileAttachment.blob.getDirectURL()}
            download={post.fileAttachment.filename}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-muted/60 border border-border/50 rounded-xl px-3 py-2 hover:bg-muted transition-all duration-200 group"
          >
            <div className="w-8 h-8 rounded-lg bg-saffron-700/30 flex items-center justify-center flex-shrink-0">
              <FileText size={16} className="text-amber-400" />
            </div>
            <span className="text-foreground text-sm truncate flex-1">{post.fileAttachment.filename}</span>
            <Download size={14} className="text-muted-foreground group-hover:text-amber-400 transition-colors flex-shrink-0" />
          </a>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleLike}
          disabled={liked || likeMutation.isPending}
          className={`flex items-center gap-1 text-sm transition-all duration-200 hover:scale-110 ${
            liked ? 'text-red-400' : 'text-muted-foreground hover:text-red-400'
          }`}
        >
          {liked ? '❤️' : '🤍'} {Number(post.likes) + (liked ? 1 : 0)}
        </button>
        <span className="text-muted-foreground text-xs">💬 {Number(post.comments)}</span>
      </div>
    </div>
  );
}
