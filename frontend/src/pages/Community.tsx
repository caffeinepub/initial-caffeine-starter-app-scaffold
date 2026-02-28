import { useState, useRef } from 'react';
import { useGetApprovedCommunityPosts, useCreateCommunityPost } from '../hooks/useQueries';
import { ExternalBlob, FileAttachment } from '../backend';
import CommunityPostCard from '../components/CommunityPostCard';
import { Image, Video, Paperclip, X, Loader2 } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

const DEITY_TAGS = ['शिव', 'कृष्ण', 'राम', 'दुर्गा', 'गणेश', 'हनुमान', 'लक्ष्मी', 'सरस्वती'];

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/ogg'];

type MediaType = 'image' | 'video' | 'file' | null;

interface SelectedMedia {
  type: MediaType;
  file: File;
  previewUrl?: string;
}

export default function Community() {
  const { data: posts, isLoading } = useGetApprovedCommunityPosts();
  const createPost = useCreateCommunityPost();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const [showForm, setShowForm] = useState(false);
  const [content, setContent] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [selectedMedia, setSelectedMedia] = useState<SelectedMedia | null>(null);
  const [mediaError, setMediaError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleMediaSelect = (type: MediaType, file: File) => {
    setMediaError('');

    if (type === 'image') {
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        setMediaError('केवल JPG, PNG, GIF, WebP छवियाँ स्वीकार हैं।');
        return;
      }
      if (file.size > MAX_IMAGE_SIZE) {
        setMediaError('छवि का आकार 5MB से कम होना चाहिए।');
        return;
      }
      const previewUrl = URL.createObjectURL(file);
      setSelectedMedia({ type: 'image', file, previewUrl });
    } else if (type === 'video') {
      if (!ALLOWED_VIDEO_TYPES.includes(file.type)) {
        setMediaError('केवल MP4, WebM, OGG वीडियो स्वीकार हैं।');
        return;
      }
      if (file.size > MAX_VIDEO_SIZE) {
        setMediaError('वीडियो का आकार 50MB से कम होना चाहिए।');
        return;
      }
      const previewUrl = URL.createObjectURL(file);
      setSelectedMedia({ type: 'video', file, previewUrl });
    } else if (type === 'file') {
      if (file.size > MAX_FILE_SIZE) {
        setMediaError('फ़ाइल का आकार 10MB से कम होना चाहिए।');
        return;
      }
      setSelectedMedia({ type: 'file', file });
    }
  };

  const clearMedia = () => {
    if (selectedMedia?.previewUrl) {
      URL.revokeObjectURL(selectedMedia.previewUrl);
    }
    setSelectedMedia(null);
    setMediaError('');
    setUploadProgress(0);
    if (imageInputRef.current) imageInputRef.current.value = '';
    if (videoInputRef.current) videoInputRef.current.value = '';
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async () => {
    if (!content.trim()) return;

    let image: ExternalBlob | null = null;
    let video: ExternalBlob | null = null;
    let fileAttachment: FileAttachment | null = null;

    if (selectedMedia) {
      const bytes = new Uint8Array(await selectedMedia.file.arrayBuffer());

      if (selectedMedia.type === 'image') {
        image = ExternalBlob.fromBytes(bytes).withUploadProgress((pct) => setUploadProgress(pct));
      } else if (selectedMedia.type === 'video') {
        video = ExternalBlob.fromBytes(bytes).withUploadProgress((pct) => setUploadProgress(pct));
      } else if (selectedMedia.type === 'file') {
        const blob = ExternalBlob.fromBytes(bytes).withUploadProgress((pct) => setUploadProgress(pct));
        fileAttachment = { blob, filename: selectedMedia.file.name };
      }
    }

    try {
      await createPost.mutateAsync({
        content: content.trim(),
        deityTag: selectedTag || null,
        image,
        video,
        fileAttachment,
      });
      setContent('');
      setSelectedTag('');
      clearMedia();
      setShowForm(false);
    } catch {
      // error handled by mutation state
    }
  };

  const resetForm = () => {
    setContent('');
    setSelectedTag('');
    clearMedia();
    setShowForm(false);
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-b from-indigo-900 to-background px-4 pt-6 pb-4 text-center">
        <h1 className="text-2xl font-bold text-white mb-1">🤝 भक्त समुदाय</h1>
        <p className="text-indigo-200 text-sm">अपने जाप और भक्ति अनुभव साझा करें</p>
      </div>

      <div className="px-4 py-4">
        {/* Share Prompt */}
        <div className="bg-gradient-to-r from-saffron-800/50 to-gold-800/30 border border-gold-500/30 rounded-2xl p-4 mb-4">
          <p className="text-amber-200 text-sm font-medium mb-2">🙏 अपना जाप लक्ष्य साझा करें</p>
          {isAuthenticated ? (
            <button
              onClick={() => setShowForm(true)}
              className="w-full bg-gradient-to-r from-saffron-600 to-gold-500 text-white py-2 rounded-xl text-sm font-medium hover:scale-[1.02] transition-all duration-200 hover:shadow-lg"
            >
              + नई पोस्ट बनाएं
            </button>
          ) : (
            <p className="text-amber-300/70 text-xs text-center">पोस्ट करने के लिए Login करें</p>
          )}
        </div>

        {/* Create Post Form */}
        {showForm && (
          <div className="bg-card border border-gold-500/30 rounded-2xl p-4 mb-4 animate-fade-in">
            <h3 className="text-foreground font-bold mb-3">नई पोस्ट</h3>

            {/* Text area */}
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="अपने भक्ति अनुभव साझा करें..."
              className="w-full bg-muted border border-border rounded-xl px-3 py-2 text-foreground text-sm resize-none h-24 focus:outline-none focus:ring-2 focus:ring-gold-500 mb-3"
            />

            {/* Deity tags */}
            <div className="flex flex-wrap gap-2 mb-3">
              {DEITY_TAGS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(selectedTag === tag ? '' : tag)}
                  className={`px-3 py-1 rounded-full text-xs transition-all duration-200 hover:scale-105 ${
                    selectedTag === tag
                      ? 'bg-saffron-600 text-white'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Media attachment buttons */}
            <div className="flex gap-2 mb-3">
              <button
                type="button"
                onClick={() => imageInputRef.current?.click()}
                disabled={!!selectedMedia}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-muted text-muted-foreground text-xs hover:bg-amber-500/10 hover:text-amber-400 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed border border-border/50"
              >
                <Image size={13} />
                फ़ोटो
              </button>
              <button
                type="button"
                onClick={() => videoInputRef.current?.click()}
                disabled={!!selectedMedia}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-muted text-muted-foreground text-xs hover:bg-amber-500/10 hover:text-amber-400 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed border border-border/50"
              >
                <Video size={13} />
                वीडियो
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={!!selectedMedia}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-muted text-muted-foreground text-xs hover:bg-amber-500/10 hover:text-amber-400 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed border border-border/50"
              >
                <Paperclip size={13} />
                फ़ाइल
              </button>
            </div>

            {/* Hidden file inputs */}
            <input
              ref={imageInputRef}
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleMediaSelect('image', file);
              }}
            />
            <input
              ref={videoInputRef}
              type="file"
              accept="video/mp4,video/webm,video/ogg"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleMediaSelect('video', file);
              }}
            />
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleMediaSelect('file', file);
              }}
            />

            {/* Media error */}
            {mediaError && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-3 py-2 mb-3">
                <p className="text-red-400 text-xs">{mediaError}</p>
              </div>
            )}

            {/* Media preview */}
            {selectedMedia && (
              <div className="mb-3 relative">
                <div className="rounded-xl overflow-hidden border border-gold-500/20 bg-muted/30">
                  {selectedMedia.type === 'image' && selectedMedia.previewUrl && (
                    <img
                      src={selectedMedia.previewUrl}
                      alt="Preview"
                      className="w-full max-h-48 object-cover"
                    />
                  )}
                  {selectedMedia.type === 'video' && selectedMedia.previewUrl && (
                    <video
                      src={selectedMedia.previewUrl}
                      controls
                      className="w-full max-h-48"
                      preload="metadata"
                    />
                  )}
                  {selectedMedia.type === 'file' && (
                    <div className="flex items-center gap-2 px-3 py-3">
                      <Paperclip size={16} className="text-amber-400 flex-shrink-0" />
                      <span className="text-foreground text-sm truncate">{selectedMedia.file.name}</span>
                      <span className="text-muted-foreground text-xs ml-auto flex-shrink-0">
                        {(selectedMedia.file.size / 1024).toFixed(0)} KB
                      </span>
                    </div>
                  )}
                </div>
                <button
                  onClick={clearMedia}
                  className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center hover:bg-black/80 transition-all"
                >
                  <X size={12} className="text-white" />
                </button>
              </div>
            )}

            {/* Upload progress */}
            {createPost.isPending && uploadProgress > 0 && uploadProgress < 100 && (
              <div className="mb-3">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>अपलोड हो रहा है...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-1.5">
                  <div
                    className="bg-gradient-to-r from-saffron-600 to-gold-500 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-2">
              <button
                onClick={handleSubmit}
                disabled={createPost.isPending || !content.trim()}
                className="flex-1 bg-gradient-to-r from-saffron-600 to-gold-500 text-white py-2 rounded-xl text-sm font-medium hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {createPost.isPending ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    पोस्ट हो रहा है...
                  </>
                ) : (
                  '📤 पोस्ट करें'
                )}
              </button>
              <button
                onClick={resetForm}
                disabled={createPost.isPending}
                className="px-4 py-2 rounded-xl bg-muted text-muted-foreground text-sm hover:bg-muted/80 transition-all duration-200 disabled:opacity-50"
              >
                रद्द
              </button>
            </div>
          </div>
        )}

        {/* Posts Feed */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card border border-border rounded-2xl p-4 animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : posts && posts.length > 0 ? (
          <div className="space-y-4">
            {posts.map((post) => (
              <CommunityPostCard key={Number(post.id)} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-4xl mb-3">🙏</p>
            <p className="text-foreground font-medium">अभी कोई पोस्ट नहीं है</p>
            <p className="text-muted-foreground text-sm mt-1">पहले भक्त बनें और अपना अनुभव साझा करें</p>
          </div>
        )}
      </div>
    </div>
  );
}
