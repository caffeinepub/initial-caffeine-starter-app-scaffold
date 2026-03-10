import { Image, Loader2, LogIn, Plus, Users, Video, X } from "lucide-react";
import type React from "react";
import { useRef, useState } from "react";
import ICPCommunityPostCard from "../components/ICPCommunityPostCard";
import { useAuth } from "../hooks/useAuth";
import {
  useCreateCommunityPost,
  useGetApprovedCommunityPosts,
} from "../hooks/useQueries";

export default function Community() {
  const { isAuthenticated, user } = useAuth();

  // ICP backend — approved posts visible to ALL users (public query)
  const { data: icpPosts, isLoading, isError } = useGetApprovedCommunityPosts();
  const createPostMutation = useCreateCommunityPost();

  const [showForm, setShowForm] = useState(false);
  const [content, setContent] = useState("");
  const [deityTag, setDeityTag] = useState("");
  const [postError, setPostError] = useState("");
  const [postSuccess, setPostSuccess] = useState(false);

  // Image upload state
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [imagePreviewName, setImagePreviewName] = useState<string>("");
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Video URL state
  const [videoUrl, setVideoUrl] = useState("");
  const [showVideoInput, setShowVideoInput] = useState(false);

  // Sort posts newest-first using bigint timestamp
  const sortedPosts = (icpPosts ?? []).slice().sort((a, b) => {
    const diff = b.timestamp - a.timestamp;
    return diff > 0n ? 1 : diff < 0n ? -1 : 0;
  });

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setPostError("केवल image file (JPG, PNG, etc.) upload करें।");
      return;
    }

    // Max 5MB
    if (file.size > 5 * 1024 * 1024) {
      setPostError("Image 5MB से छोटी होनी चाहिए।");
      return;
    }

    setImagePreviewName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result;
      if (typeof result === "string") {
        setImageDataUrl(result);
        setPostError("");
      }
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageDataUrl(null);
    setImagePreviewName("");
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  const resetForm = () => {
    setShowForm(false);
    setContent("");
    setDeityTag("");
    setPostError("");
    setImageDataUrl(null);
    setImagePreviewName("");
    setVideoUrl("");
    setShowVideoInput(false);
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !imageDataUrl) {
      setPostError("कुछ लिखें या image add करें।");
      return;
    }
    setPostError("");
    try {
      await createPostMutation.mutateAsync({
        content: content.trim(),
        deityTag: deityTag.trim() || undefined,
        imageDataUrl: imageDataUrl || undefined,
        videoUrl: videoUrl.trim() || undefined,
      });
      resetForm();
      setPostSuccess(true);
      setTimeout(() => setPostSuccess(false), 4000);
    } catch {
      setPostError("पोस्ट नहीं हो पाई। कृपया पुनः प्रयास करें।");
    }
  };

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
            <p className="text-white/90 text-sm">भक्तों का परिवार</p>
          </div>
        </div>
        <p className="text-white/90 text-sm mt-2">
          अपनी भक्ति, अनुभव और प्रेरणा यहाँ साझा करें
        </p>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Post Success Banner */}
        {postSuccess && (
          <div
            data-ocid="community.post_form.success_state"
            className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl"
          >
            <span className="text-lg">✅</span>
            <p className="text-sm text-green-700 dark:text-green-300 font-medium">
              पोस्ट सफलतापूर्वक submit हो गई! सभी को दिखेगी।
            </p>
          </div>
        )}

        {/* Post Creation — only for authenticated users */}
        {isAuthenticated ? (
          <div className="bg-card border border-border rounded-xl p-4">
            {!showForm ? (
              <button
                type="button"
                data-ocid="community.create_post.button"
                onClick={() => setShowForm(true)}
                className="w-full flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-sm">
                  {user?.username?.[0]?.toUpperCase() ?? "🙏"}
                </div>
                <span className="flex-1 text-left text-sm bg-muted rounded-full px-4 py-2">
                  अपनी भक्ति साझा करें...
                </span>
                <Plus className="w-5 h-5" />
              </button>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <textarea
                  data-ocid="community.post.textarea"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="अपनी भक्ति, अनुभव या प्रेरणा लिखें..."
                  className="w-full bg-muted rounded-lg p-3 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-amber-500"
                  rows={3}
                />

                <input
                  data-ocid="community.deity_tag.input"
                  type="text"
                  value={deityTag}
                  onChange={(e) => setDeityTag(e.target.value)}
                  placeholder="देवता tag (जैसे: श्री राम, कृष्ण)"
                  className="w-full bg-muted rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber-500"
                />

                {/* Image Upload */}
                <div>
                  {imageDataUrl ? (
                    <div className="relative rounded-lg overflow-hidden bg-muted">
                      <img
                        src={imageDataUrl}
                        alt="Preview"
                        className="w-full object-cover rounded-lg"
                        style={{ maxHeight: 200 }}
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                      <div className="absolute bottom-2 left-2 bg-black/60 rounded px-2 py-0.5">
                        <p className="text-xs text-white truncate max-w-[160px]">
                          {imagePreviewName}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <label
                      data-ocid="community.image.upload_button"
                      className="flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-amber-400/50 bg-muted hover:bg-amber-50 dark:hover:bg-amber-900/10 cursor-pointer transition-colors"
                    >
                      <Image className="w-4 h-4 text-amber-600 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">
                        📷 Photo जोड़ें (optional, max 5MB)
                      </span>
                      <input
                        ref={imageInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageSelect}
                      />
                    </label>
                  )}
                </div>

                {/* Video URL */}
                {showVideoInput ? (
                  <div className="flex items-center gap-2">
                    <input
                      data-ocid="community.video_url.input"
                      type="url"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      placeholder="YouTube link paste करें..."
                      className="flex-1 bg-muted rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setShowVideoInput(false);
                        setVideoUrl("");
                      }}
                      className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowVideoInput(true)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-amber-400/50 bg-muted hover:bg-amber-50 dark:hover:bg-amber-900/10 cursor-pointer transition-colors w-full text-left"
                  >
                    <Video className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">
                      🎬 YouTube Video जोड़ें (optional)
                    </span>
                  </button>
                )}

                <div className="flex gap-2">
                  <button
                    data-ocid="community.post_form.cancel_button"
                    type="button"
                    onClick={resetForm}
                    className="flex-1 py-2 rounded-lg bg-muted text-muted-foreground text-sm hover:bg-muted/80 transition-colors"
                  >
                    रद्द करें
                  </button>
                  <button
                    data-ocid="community.post_form.submit_button"
                    type="submit"
                    disabled={
                      createPostMutation.isPending ||
                      (!content.trim() && !imageDataUrl)
                    }
                    className="flex-1 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {createPostMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : null}
                    पोस्ट करें
                  </button>
                </div>

                {postError && (
                  <div
                    data-ocid="community.post_form.error_state"
                    className="flex items-center gap-2 p-2 bg-red-50 dark:bg-red-900/20 rounded-lg"
                  >
                    <p className="text-xs text-red-700 dark:text-red-300">
                      {postError}
                    </p>
                  </div>
                )}

                <div className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <span className="text-xs">✅</span>
                  <p className="text-xs text-green-700 dark:text-green-300">
                    पोस्ट submit होते ही सभी को तुरंत दिखेगी
                  </p>
                </div>
              </form>
            )}
          </div>
        ) : (
          /* Login prompt — non-blocking, users can still read posts below */
          <div
            data-ocid="community.login.card"
            className="bg-card border border-amber-200 dark:border-amber-800 rounded-xl p-4 flex items-center gap-3"
          >
            <div className="text-2xl">🙏</div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">
                पोस्ट करने के लिए Login करें
              </p>
              <p className="text-xs text-muted-foreground">
                नीचे के पोस्ट बिना login के पढ़ सकते हैं
              </p>
            </div>
            <button
              type="button"
              data-ocid="community.login.button"
              onClick={() => {
                window.location.hash = "#/profile";
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full text-xs font-medium hover:opacity-90 transition-opacity"
            >
              <LogIn className="w-3.5 h-3.5" />
              Login
            </button>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div
            data-ocid="community.posts.loading_state"
            className="flex items-center justify-center py-8 gap-3 text-muted-foreground"
          >
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">पोस्ट लोड हो रही हैं...</span>
          </div>
        )}

        {/* Error State */}
        {isError && !isLoading && (
          <div
            data-ocid="community.posts.error_state"
            className="text-center py-8"
          >
            <div className="text-3xl mb-2">⚠️</div>
            <p className="text-sm text-muted-foreground">
              पोस्ट लोड नहीं हो पाईं। कृपया पुनः प्रयास करें।
            </p>
          </div>
        )}

        {/* Posts Feed — visible to ALL users (public, no login required) */}
        {!isLoading &&
          !isError &&
          (sortedPosts.length > 0 ? (
            <div className="space-y-4" data-ocid="community.posts.list">
              {sortedPosts.map((post, idx) => (
                <ICPCommunityPostCard
                  key={post.id.toString()}
                  post={post}
                  data-ocid={`community.posts.item.${idx + 1}`}
                />
              ))}
            </div>
          ) : (
            <div
              className="text-center py-12"
              data-ocid="community.posts.empty_state"
            >
              <div className="text-4xl mb-3">🙏</div>
              <p className="text-foreground font-medium">अभी कोई पोस्ट नहीं है</p>
              <p className="text-muted-foreground text-sm mt-1">
                {isAuthenticated
                  ? "पहले पोस्ट बनाएं और अपनी भक्ति साझा करें"
                  : "Login करके पहली पोस्ट करें"}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
}
