import { Clock, Image, Loader2, LogIn, Plus, Users, X } from "lucide-react";
import type React from "react";
import { useMemo, useState } from "react";
import CommunityPostCard from "../components/CommunityPostCard";
import { useAuth } from "../hooks/useAuth";
import { useCommunityPosts } from "../hooks/useCommunityPosts";

export default function Community() {
  const { isAuthenticated, user } = useAuth();
  const { getPosts, createPost, version } = useCommunityPosts();

  const [showForm, setShowForm] = useState(false);
  const [content, setContent] = useState("");
  const [deityTag, setDeityTag] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isPosting, setIsPosting] = useState(false);
  const [postError, setPostError] = useState("");
  const [postSuccess, setPostSuccess] = useState(false);

  // Re-derive approved posts whenever version or getPosts changes
  // biome-ignore lint/correctness/useExhaustiveDependencies: version triggers re-read of localStorage
  const sortedPosts = useMemo(
    () => getPosts().sort((a, b) => b.timestamp - a.timestamp),
    [version, getPosts],
  );

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setImageFile(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    } else {
      setImagePreview(null);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !imageFile) return;
    setPostError("");
    setIsPosting(true);
    try {
      await createPost(content, deityTag, imageFile ?? undefined);
      setContent("");
      setDeityTag("");
      removeImage();
      setShowForm(false);
      setPostSuccess(true);
      setTimeout(() => setPostSuccess(false), 4000);
    } catch {
      setPostError("पोस्ट नहीं हो पाई। कृपया पुनः प्रयास करें।");
    } finally {
      setIsPosting(false);
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
            <p className="text-amber-100 text-sm">भक्तों का परिवार</p>
          </div>
        </div>
        <p className="text-amber-100 text-sm mt-2">
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
              पोस्ट submit हो गई! Admin approval के बाद दिखेगी।
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
                <div className="space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <label
                      data-ocid="community.image.upload_button"
                      className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-amber-600 cursor-pointer transition-colors"
                    >
                      <Image className="w-4 h-4" />
                      <span>Photo जोड़ें</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                    </label>

                    {imageFile && (
                      <span className="text-xs text-amber-600 flex items-center gap-1">
                        📷 {imageFile.name.slice(0, 18)}
                        <button type="button" onClick={removeImage}>
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                  </div>

                  {/* Image preview */}
                  {imagePreview && (
                    <div className="relative rounded-lg overflow-hidden">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full max-h-48 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 bg-black/50 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-black/70 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    data-ocid="community.post_form.cancel_button"
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setContent("");
                      setDeityTag("");
                      removeImage();
                      setPostError("");
                    }}
                    className="flex-1 py-2 rounded-lg bg-muted text-muted-foreground text-sm hover:bg-muted/80 transition-colors"
                  >
                    रद्द करें
                  </button>
                  <button
                    data-ocid="community.post_form.submit_button"
                    type="submit"
                    disabled={isPosting || (!content.trim() && !imageFile)}
                    className="flex-1 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isPosting ? (
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

                <div className="flex items-center gap-2 p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                  <Clock className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                  <p className="text-xs text-amber-700 dark:text-amber-300">
                    आपकी पोस्ट Admin approval के बाद दिखेगी
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

        {/* Posts Feed — visible to ALL users (public, no login required) */}
        {sortedPosts.length > 0 ? (
          <div className="space-y-4" data-ocid="community.posts.list">
            {sortedPosts.map((post, idx) => (
              <CommunityPostCard
                key={post.id}
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
        )}
      </div>
    </div>
  );
}
