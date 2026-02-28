import React, { useState, useRef, useCallback } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetApprovedCommunityPosts, useCreateCommunityPost } from '../hooks/useQueries';
import CommunityPostCard from '../components/CommunityPostCard';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Image, Video, Paperclip, X, Send, Users } from 'lucide-react';
import { ExternalBlob, type FileAttachment } from '../backend';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';

const DEITY_TAGS = ['Shiva', 'Vishnu', 'Durga', 'Krishna', 'Ganesh', 'Hanuman', 'Lakshmi', 'Saraswati'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

type AttachmentPreview = {
  type: 'image' | 'video' | 'file';
  file: File;
  previewUrl?: string;
  uploadProgress: number;
};

export default function Community() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const { data: posts, isLoading: postsLoading } = useGetApprovedCommunityPosts();
  const createPost = useCreateCommunityPost();

  const [content, setContent] = useState('');
  const [deityTag, setDeityTag] = useState('');
  const [attachment, setAttachment] = useState<AttachmentPreview | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(async (file: File, type: 'image' | 'video' | 'file') => {
    if (file.size > MAX_FILE_SIZE) {
      toast.error('File size 10MB से ज्यादा नहीं होनी चाहिए');
      return;
    }
    const previewUrl = type !== 'file' ? URL.createObjectURL(file) : undefined;
    setAttachment({ type, file, previewUrl, uploadProgress: 0 });
  }, []);

  const removeAttachment = () => {
    if (attachment?.previewUrl) URL.revokeObjectURL(attachment.previewUrl);
    setAttachment(null);
  };

  const handleSubmit = async () => {
    if (!content.trim() && !attachment) {
      toast.error('कुछ लिखें या media attach करें');
      return;
    }
    if (!isAuthenticated) {
      toast.error('Post करने के लिए login करें');
      return;
    }

    setIsUploading(true);
    try {
      let image: ExternalBlob | undefined;
      let video: ExternalBlob | undefined;
      let fileAttachment: FileAttachment | undefined;

      if (attachment) {
        const bytes = new Uint8Array(await attachment.file.arrayBuffer());
        const uploadedBlob = ExternalBlob.fromBytes(bytes).withUploadProgress((pct) => {
          setAttachment(prev => prev ? { ...prev, uploadProgress: pct } : null);
        });
        if (attachment.type === 'image') image = uploadedBlob;
        else if (attachment.type === 'video') video = uploadedBlob;
        else fileAttachment = { blob: uploadedBlob, filename: attachment.file.name };
      }

      await createPost.mutateAsync({
        content: content.trim(),
        deityTag: deityTag || undefined,
        image,
        video,
        fileAttachment,
      });

      setContent('');
      setDeityTag('');
      if (attachment?.previewUrl) URL.revokeObjectURL(attachment.previewUrl);
      setAttachment(null);
      toast.success('Post हो गई! 🙏');
    } catch (e: any) {
      toast.error(e?.message || 'Post करने में error आई');
    } finally {
      setIsUploading(false);
    }
  };

  const sortedPosts = React.useMemo(() => {
    if (!posts) return [];
    return [...posts].sort((a, b) => Number(b.timestamp) - Number(a.timestamp));
  }, [posts]);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-700 to-orange-600 p-6 text-white">
        <div className="flex items-center gap-3">
          <Users className="w-7 h-7" />
          <div>
            <h1 className="text-2xl font-bold">समुदाय</h1>
            <p className="text-amber-100 text-sm">भक्तों का परिवार</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Create Post */}
        {isAuthenticated ? (
          <div className="bg-card border border-border rounded-2xl p-4 space-y-3">
            <Textarea
              placeholder="अपने विचार, भजन, या अनुभव share करें... 🙏"
              value={content}
              onChange={e => setContent(e.target.value)}
              className="bg-background border-border resize-none min-h-[80px]"
              disabled={isUploading}
            />

            {/* Deity Tag */}
            <div className="flex flex-wrap gap-2">
              {DEITY_TAGS.map(tag => (
                <button
                  key={tag}
                  onClick={() => setDeityTag(deityTag === tag ? '' : tag)}
                  className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                    deityTag === tag
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'border-border text-muted-foreground hover:border-primary/50'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Attachment Preview */}
            {attachment && (
              <div className="relative bg-muted rounded-xl overflow-hidden">
                {attachment.type === 'image' && attachment.previewUrl && (
                  <img
                    src={attachment.previewUrl}
                    alt="preview"
                    className="w-full max-h-48 object-cover"
                  />
                )}
                {attachment.type === 'video' && attachment.previewUrl && (
                  <video
                    src={attachment.previewUrl}
                    className="w-full max-h-48"
                    controls
                  />
                )}
                {attachment.type === 'file' && (
                  <div className="p-3 flex items-center gap-2">
                    <Paperclip className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-foreground truncate">{attachment.file.name}</span>
                  </div>
                )}
                {isUploading && attachment.uploadProgress > 0 && (
                  <div className="p-2">
                    <Progress value={attachment.uploadProgress} className="h-1" />
                    <p className="text-xs text-muted-foreground mt-1 text-center">
                      Upload: {Math.round(attachment.uploadProgress)}%
                    </p>
                  </div>
                )}
                <button
                  onClick={removeAttachment}
                  disabled={isUploading}
                  className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 hover:bg-black/80"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}

            {/* Action Row */}
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={e => e.target.files?.[0] && handleFileSelect(e.target.files[0], 'image')}
                />
                <input
                  ref={videoInputRef}
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={e => e.target.files?.[0] && handleFileSelect(e.target.files[0], 'video')}
                />
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={e => e.target.files?.[0] && handleFileSelect(e.target.files[0], 'file')}
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => imageInputRef.current?.click()}
                  disabled={isUploading || !!attachment}
                  className="gap-1"
                >
                  <Image className="w-4 h-4" />
                  <span className="hidden sm:inline text-xs">Photo</span>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => videoInputRef.current?.click()}
                  disabled={isUploading || !!attachment}
                  className="gap-1"
                >
                  <Video className="w-4 h-4" />
                  <span className="hidden sm:inline text-xs">Video</span>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading || !!attachment}
                  className="gap-1"
                >
                  <Paperclip className="w-4 h-4" />
                  <span className="hidden sm:inline text-xs">File</span>
                </Button>
              </div>

              <Button
                size="sm"
                onClick={handleSubmit}
                disabled={isUploading || createPost.isPending || (!content.trim() && !attachment)}
                className="bg-gradient-to-r from-amber-600 to-orange-500 text-white gap-2"
              >
                {isUploading || createPost.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                {isUploading ? 'Upload...' : 'Post करें'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-2xl p-4 text-center">
            <p className="text-muted-foreground text-sm">Post करने के लिए login करें 🙏</p>
          </div>
        )}

        {/* Posts Feed */}
        {postsLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : sortedPosts.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p>अभी कोई post नहीं है</p>
            <p className="text-sm mt-1">पहली post करें! 🙏</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedPosts.map(post => (
              <CommunityPostCard
                key={post.id.toString()}
                post={post}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
