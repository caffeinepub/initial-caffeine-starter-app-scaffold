import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  Bell,
  BookOpen,
  Edit2,
  Loader2,
  Music,
  Plus,
  Send,
  Shield,
  Trash2,
  Upload,
  Users,
  X,
} from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { ExternalBlob, KathaCategory } from "../backend";
import { useActor } from "../hooks/useActor";
import { useAuth } from "../hooks/useAuth";
import { addAnnouncement } from "../hooks/useNotifications";
import {
  useAddKatha,
  useDeleteCommunityPost,
  useDeleteKatha,
  useGetAllCommunityPosts,
  useGetAllKathayen,
  useUpdateKatha,
} from "../hooks/useQueries";
import { getSecretParameter } from "../utils/urlParams";

interface KathaForm {
  title: string;
  deity: string;
  category: KathaCategory;
  hindiText: string;
  englishText: string;
  tags: string;
}

const emptyForm: KathaForm = {
  title: "",
  deity: "",
  category: KathaCategory.puranik,
  hindiText: "",
  englishText: "",
  tags: "",
};

type AdminTab = "kathayen" | "community" | "notifications";

// Normalize KathaCategory from ICP (may come as object variant)
function normalizeCategory(category: KathaCategory): KathaCategory {
  if (typeof category === "object") {
    const key = Object.keys(category as object)[0];
    if (key === "vrat") return KathaCategory.vrat;
    return KathaCategory.puranik;
  }
  return category;
}

export default function AdminPanel() {
  const { isAdmin, user } = useAuth();
  const navigate = useNavigate();
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const adminInitialized = useRef(false);

  const [activeTab, setActiveTab] = useState<AdminTab>("kathayen");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<bigint | null>(null);
  const [form, setForm] = useState<KathaForm>(emptyForm);
  const [formError, setFormError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Announcement state
  const [announcementText, setAnnouncementText] = useState("");
  const [announcementSent, setAnnouncementSent] = useState(false);

  // MP3 upload state
  const [audioFile, setAudioFile] = useState<File | null>(null);

  // Initialize admin access control when actor and admin status are confirmed
  // This is needed because local username/password auth doesn't use Internet Identity
  // so the actor is anonymous and needs admin token injected manually
  useEffect(() => {
    if (actor && isAdmin && !adminInitialized.current) {
      const adminToken = getSecretParameter("caffeineAdminToken") || "";
      actor
        ._initializeAccessControlWithSecret(adminToken)
        .then(() => {
          adminInitialized.current = true;
          // Invalidate all queries so they re-fetch with admin access
          queryClient.invalidateQueries({ queryKey: ["kathayen"] });
          queryClient.invalidateQueries({ queryKey: ["communityPosts"] });
        })
        .catch(() => {
          // Silently fail — some deployments may not require this
          adminInitialized.current = true;
          queryClient.invalidateQueries({ queryKey: ["kathayen"] });
          queryClient.invalidateQueries({ queryKey: ["communityPosts"] });
        });
    }
  }, [actor, isAdmin, queryClient]);

  // ICP backend hooks
  const { data: icpKathayen, isLoading: kathayenLoading } = useGetAllKathayen();
  const addKathaMutation = useAddKatha();
  const updateKathaMutation = useUpdateKatha();
  const deleteKathaMutation = useDeleteKatha();

  const { data: allPosts, isLoading: postsLoading } = useGetAllCommunityPosts();
  const deletePostMutation = useDeleteCommunityPost();

  // Early return AFTER all hooks
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 px-4">
        <div className="text-6xl">🚫</div>
        <h2 className="text-xl font-bold text-foreground">Access Denied</h2>
        <p className="text-muted-foreground text-center text-sm">
          यह पेज केवल Admin के लिए है।
          <br />
          कृपया Admin account से login करें।
        </p>
        <button
          type="button"
          onClick={() => navigate({ to: "/" })}
          className="mt-2 px-6 py-2 bg-primary text-primary-foreground rounded-full font-medium"
        >
          होम पर जाएँ
        </button>
      </div>
    );
  }

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const resetForm = () => {
    setForm(emptyForm);
    setAudioFile(null);
    setEditingId(null);
    setShowForm(false);
    setFormError("");
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (!form.title.trim() || !form.deity.trim() || !form.hindiText.trim()) {
      setFormError("Title, Deity और Hindi Text आवश्यक हैं।");
      return;
    }
    const tags = form.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    setIsSubmitting(true);
    try {
      // Convert audio file to ExternalBlob if provided
      let audioBlob: ExternalBlob | null = null;
      if (audioFile) {
        const arrayBuffer = await audioFile.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        audioBlob = ExternalBlob.fromBytes(uint8Array);
      }

      if (editingId !== null) {
        await updateKathaMutation.mutateAsync({
          id: editingId,
          title: form.title,
          category: form.category,
          deity: form.deity,
          hindiText: form.hindiText,
          englishText: form.englishText,
          tags,
          audioBlob,
        });
        showSuccess("कथा अपडेट हो गई! ✅");
      } else {
        await addKathaMutation.mutateAsync({
          title: form.title,
          category: form.category,
          deity: form.deity,
          hindiText: form.hindiText,
          englishText: form.englishText,
          tags,
          audioBlob,
        });
        showSuccess("नई कथा जोड़ी गई! सभी users को दिखेगी ✅");
      }
      resetForm();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "कुछ गलत हुआ।";
      setFormError(`Error: ${msg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (katha: {
    id: bigint;
    title: string;
    deity: string;
    category: KathaCategory;
    hindiText: string;
    englishText: string;
    tags: string[];
  }) => {
    setForm({
      title: katha.title,
      deity: katha.deity,
      category: normalizeCategory(katha.category),
      hindiText: katha.hindiText,
      englishText: katha.englishText,
      tags: katha.tags.join(", "),
    });
    setEditingId(katha.id);
    setAudioFile(null);
    setShowForm(true);
    setFormError("");
  };

  const handleDelete = (id: bigint) => {
    if (!confirm("क्या आप इस कथा को हटाना चाहते हैं?")) return;
    deleteKathaMutation.mutate(id, {
      onSuccess: () => showSuccess("कथा हटा दी गई! ✅"),
      onError: (err) =>
        setFormError(
          `Error: ${err instanceof Error ? err.message : "कुछ गलत हुआ।"}`,
        ),
    });
  };

  const handleAudioFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file && !file.type.includes("audio")) {
      setFormError("केवल audio file (MP3) upload करें।");
      return;
    }
    setAudioFile(file);
    setFormError("");
  };

  const handleDeletePost = (postId: bigint) => {
    if (!confirm("Post delete करें?")) return;
    deletePostMutation.mutate(postId, {
      onSuccess: () => showSuccess("Post delete हो गई! ✅"),
    });
  };

  const kathaList = icpKathayen ?? [];
  const posts = allPosts ?? [];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-700 via-orange-600 to-red-700 px-4 py-5">
        <div className="flex items-center gap-3">
          <Shield size={24} className="text-yellow-200" />
          <div>
            <h1 className="text-xl font-bold text-white">Admin Panel</h1>
            <p className="text-yellow-200 text-xs">
              Welcome, {user?.username} 👑
            </p>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {successMsg && (
        <div
          data-ocid="admin.success_state"
          className="mx-4 mt-3 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-xl px-4 py-2 text-green-800 dark:text-green-300 text-sm font-medium"
        >
          {successMsg}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 px-4 pt-4">
        <button
          type="button"
          data-ocid="admin.kathayen.tab"
          onClick={() => setActiveTab("kathayen")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeTab === "kathayen"
              ? "bg-amber-600 text-white"
              : "bg-card border border-border text-foreground hover:bg-muted"
          }`}
        >
          <BookOpen size={14} />
          कथाएँ
        </button>
        <button
          type="button"
          data-ocid="admin.community.tab"
          onClick={() => setActiveTab("community")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeTab === "community"
              ? "bg-amber-600 text-white"
              : "bg-card border border-border text-foreground hover:bg-muted"
          }`}
        >
          <Users size={14} />
          Community
          {posts.length > 0 && (
            <span className="ml-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
              {posts.length > 9 ? "9+" : posts.length}
            </span>
          )}
        </button>
        <button
          type="button"
          data-ocid="admin.notifications.tab"
          onClick={() => setActiveTab("notifications")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeTab === "notifications"
              ? "bg-amber-600 text-white"
              : "bg-card border border-border text-foreground hover:bg-muted"
          }`}
        >
          <Bell size={14} />
          सूचनाएं
        </button>
      </div>

      <div className="max-w-2xl mx-auto px-4 pt-4">
        {/* KATHAYEN TAB */}
        {activeTab === "kathayen" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-foreground">कथाएँ प्रबंधन</h2>
              <button
                type="button"
                data-ocid="admin.kathayen.open_modal_button"
                onClick={() => {
                  if (showForm) {
                    resetForm();
                  } else {
                    setShowForm(true);
                    setEditingId(null);
                    setForm(emptyForm);
                    setFormError("");
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 text-white rounded-full text-sm font-medium hover:bg-amber-700 transition-colors"
              >
                <Plus size={14} />
                नई कथा
              </button>
            </div>

            {/* Add/Edit Form */}
            {showForm && (
              <form
                onSubmit={handleFormSubmit}
                className="bg-card border border-amber-200 dark:border-amber-800/40 rounded-2xl p-4 mb-4 space-y-3"
              >
                <h3 className="font-semibold text-foreground text-sm">
                  {editingId !== null ? "कथा संपादित करें" : "नई कथा जोड़ें"}
                </h3>

                <div>
                  <label
                    htmlFor="katha-title"
                    className="block text-xs font-medium text-muted-foreground mb-1"
                  >
                    Title *
                  </label>
                  <input
                    id="katha-title"
                    data-ocid="admin.katha_title.input"
                    type="text"
                    value={form.title}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, title: e.target.value }))
                    }
                    placeholder="कथा का शीर्षक"
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="katha-deity"
                    className="block text-xs font-medium text-muted-foreground mb-1"
                  >
                    Deity *
                  </label>
                  <input
                    id="katha-deity"
                    data-ocid="admin.katha_deity.input"
                    type="text"
                    value={form.deity}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, deity: e.target.value }))
                    }
                    placeholder="जैसे: श्री राम, श्री कृष्ण"
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="katha-category"
                    className="block text-xs font-medium text-muted-foreground mb-1"
                  >
                    Category *
                  </label>
                  <select
                    id="katha-category"
                    data-ocid="admin.katha_category.select"
                    value={form.category}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        category: e.target.value as KathaCategory,
                      }))
                    }
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value={KathaCategory.puranik}>
                      पौराणिक (Puranik)
                    </option>
                    <option value={KathaCategory.vrat}>व्रत (Vrat)</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="katha-hindi"
                    className="block text-xs font-medium text-muted-foreground mb-1"
                  >
                    Hindi Text *
                  </label>
                  <textarea
                    id="katha-hindi"
                    data-ocid="admin.katha_hindi.textarea"
                    value={form.hindiText}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, hindiText: e.target.value }))
                    }
                    placeholder="हिंदी में कथा लिखें..."
                    rows={5}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="katha-english"
                    className="block text-xs font-medium text-muted-foreground mb-1"
                  >
                    English Text (optional)
                  </label>
                  <textarea
                    id="katha-english"
                    data-ocid="admin.katha_english.textarea"
                    value={form.englishText}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, englishText: e.target.value }))
                    }
                    placeholder="English story text..."
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="katha-tags"
                    className="block text-xs font-medium text-muted-foreground mb-1"
                  >
                    Tags (comma separated)
                  </label>
                  <input
                    id="katha-tags"
                    data-ocid="admin.katha_tags.input"
                    type="text"
                    value={form.tags}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, tags: e.target.value }))
                    }
                    placeholder="राम, अयोध्या, रामायण"
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                {/* MP3 Audio Upload */}
                <div>
                  <p className="block text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
                    <Music size={12} />
                    Audio (MP3) — वैकल्पिक (TTS auto-narration भी उपलब्ध है)
                  </p>
                  <div className="flex items-center gap-2">
                    <label
                      data-ocid="admin.katha_audio.upload_button"
                      className="flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-amber-400/50 bg-background hover:bg-amber-50 dark:hover:bg-amber-900/10 cursor-pointer transition-colors flex-1"
                    >
                      <Upload size={14} className="text-amber-600" />
                      <span className="text-sm text-muted-foreground truncate">
                        {audioFile ? audioFile.name : "MP3 file चुनें..."}
                      </span>
                      <input
                        type="file"
                        accept="audio/mpeg,audio/mp3,audio/*"
                        className="hidden"
                        onChange={handleAudioFileChange}
                      />
                    </label>
                    {audioFile && (
                      <button
                        type="button"
                        onClick={() => setAudioFile(null)}
                        className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                  {audioFile && (
                    <p className="text-xs text-green-600 dark:text-green-400 mt-1 flex items-center gap-1">
                      <Music size={10} />
                      {(audioFile.size / (1024 * 1024)).toFixed(2)} MB — submit
                      पर save होगा
                    </p>
                  )}
                </div>

                {formError && (
                  <div
                    data-ocid="admin.katha_form.error_state"
                    className="text-destructive text-xs bg-destructive/10 rounded-lg px-3 py-2"
                  >
                    {formError}
                  </div>
                )}

                <div className="flex gap-2 pt-1">
                  <button
                    data-ocid="admin.katha_form.submit_button"
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium disabled:opacity-60 hover:bg-amber-700 transition-colors"
                  >
                    {isSubmitting && (
                      <Loader2 size={14} className="animate-spin" />
                    )}
                    {editingId !== null ? "अपडेट करें" : "जोड़ें"}
                  </button>
                  <button
                    data-ocid="admin.katha_form.cancel_button"
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 bg-muted text-foreground rounded-lg text-sm font-medium"
                  >
                    रद्द करें
                  </button>
                </div>
              </form>
            )}

            {/* Katha List */}
            {kathayenLoading ? (
              <div
                data-ocid="admin.kathayen.loading_state"
                className="flex items-center justify-center py-8 gap-2 text-muted-foreground"
              >
                <Loader2 size={18} className="animate-spin" />
                <span className="text-sm">कथाएँ लोड हो रही हैं...</span>
              </div>
            ) : kathaList.length === 0 ? (
              <div
                className="text-center py-8 text-muted-foreground text-sm"
                data-ocid="admin.kathayen.empty_state"
              >
                <BookOpen size={32} className="mx-auto mb-2 opacity-40" />
                <p>कोई कथा नहीं है। नई कथा जोड़ें।</p>
              </div>
            ) : (
              <div className="space-y-3" data-ocid="admin.kathayen.list">
                {kathaList.map((katha, idx) => (
                  <div
                    key={katha.id.toString()}
                    data-ocid={`admin.kathayen.item.${idx + 1}`}
                    className="bg-card border border-border rounded-xl p-3 flex items-start gap-3"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground text-sm truncate">
                        {katha.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {katha.deity} •{" "}
                        {normalizeCategory(katha.category) ===
                        KathaCategory.puranik
                          ? "पौराणिक"
                          : "व्रत"}
                      </p>
                      {katha.audioBlob && (
                        <span className="inline-flex items-center gap-1 text-xs text-green-600 dark:text-green-400 mt-0.5">
                          <Music size={10} />
                          Audio available
                        </span>
                      )}
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button
                        type="button"
                        data-ocid={`admin.kathayen.edit_button.${idx + 1}`}
                        onClick={() => handleEdit(katha)}
                        className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        type="button"
                        data-ocid={`admin.kathayen.delete_button.${idx + 1}`}
                        onClick={() => handleDelete(katha.id)}
                        className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* NOTIFICATIONS TAB */}
        {activeTab === "notifications" && (
          <div>
            <h2 className="font-bold text-foreground mb-4">
              सूचना भेजें (Broadcast)
            </h2>
            <p className="text-xs text-muted-foreground mb-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg px-3 py-2">
              ℹ️ यहाँ से सभी users को in-app notification भेज सकते हैं। यह notification
              app खोलने पर bell icon में दिखेगी।
            </p>

            <div className="space-y-3">
              <textarea
                data-ocid="admin.announcement.textarea"
                value={announcementText}
                onChange={(e) => setAnnouncementText(e.target.value)}
                placeholder="सूचना लिखें... जैसे: 'नई रामायण कथा उपलब्ध है! अभी पढ़ें।'"
                rows={4}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
              />

              {announcementSent && (
                <div
                  data-ocid="admin.announcement.success_state"
                  className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg"
                >
                  <span className="text-sm">✅</span>
                  <p className="text-xs text-green-700 dark:text-green-300 font-medium">
                    सूचना broadcast हो गई! Users को bell icon में दिखेगी।
                  </p>
                </div>
              )}

              <button
                type="button"
                data-ocid="admin.announcement.submit_button"
                onClick={() => {
                  if (!announcementText.trim()) return;
                  addAnnouncement(`📢 Admin: ${announcementText.trim()}`);
                  setAnnouncementText("");
                  setAnnouncementSent(true);
                  setTimeout(() => setAnnouncementSent(false), 3000);
                }}
                disabled={!announcementText.trim()}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-amber-600 text-white rounded-lg text-sm font-medium disabled:opacity-50 hover:bg-amber-700 transition-colors"
              >
                <Send size={14} />
                सूचना भेजें
              </button>
            </div>

            <div className="mt-6 p-3 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/40 rounded-xl">
              <p className="text-xs font-semibold text-amber-800 dark:text-amber-300 mb-1">
                💡 उपयोग
              </p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• नई कथा available होने पर notify करें</li>
                <li>• पर्व/त्योहार की जानकारी share करें</li>
                <li>• Community updates भेजें</li>
              </ul>
            </div>
          </div>
        )}

        {/* COMMUNITY TAB */}
        {activeTab === "community" && (
          <div>
            <h2 className="font-bold text-foreground mb-4">
              Community Posts प्रबंधन
            </h2>
            <p className="text-xs text-muted-foreground mb-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg px-3 py-2">
              ℹ️ Posts अब ICP backend में हैं — submit होते ही सभी users को दिखती हैं।
              Admin सिर्फ Delete कर सकता है।
            </p>

            {postsLoading ? (
              <div
                data-ocid="admin.community.loading_state"
                className="flex items-center justify-center py-8 gap-2 text-muted-foreground"
              >
                <Loader2 size={18} className="animate-spin" />
                <span className="text-sm">Posts लोड हो रहे हैं...</span>
              </div>
            ) : posts.length === 0 ? (
              <div
                className="text-center py-8 text-muted-foreground text-sm"
                data-ocid="admin.community.empty_state"
              >
                <Users size={32} className="mx-auto mb-2 opacity-40" />
                <p>कोई post नहीं है।</p>
              </div>
            ) : (
              <div className="space-y-3" data-ocid="admin.community.list">
                {posts.map((post, idx) => {
                  const authorStr = post.author?.toString?.() ?? "भक्त";
                  const authorDisplay =
                    authorStr.length > 12
                      ? `${authorStr.slice(0, 5)}...${authorStr.slice(-4)}`
                      : authorStr;

                  // Format timestamp (ICP ns to ms)
                  const tsMs = Number(post.timestamp / 1_000_000n);
                  const dateStr = new Date(tsMs).toLocaleString("hi-IN");

                  return (
                    <div
                      key={post.id.toString()}
                      data-ocid={`admin.community.item.${idx + 1}`}
                      className="bg-card border border-border rounded-xl p-3"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-muted-foreground mb-1 truncate font-medium">
                            👤 भक्त {authorDisplay}
                          </p>
                          {post.content && (
                            <p className="text-sm text-foreground line-clamp-2">
                              {post.content}
                            </p>
                          )}
                          {post.deityTag && (
                            <span className="text-xs text-amber-600 bg-amber-50 dark:bg-amber-900/20 px-1.5 py-0.5 rounded-full mt-1 inline-block">
                              🙏 {post.deityTag}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-xs text-muted-foreground">
                          {dateStr}
                        </p>
                        <button
                          type="button"
                          data-ocid={`admin.community.delete_button.${idx + 1}`}
                          onClick={() => handleDeletePost(post.id)}
                          disabled={deletePostMutation.isPending}
                          className="flex items-center gap-1 px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg text-xs font-medium hover:bg-red-200 transition-colors disabled:opacity-50"
                        >
                          <Trash2 size={12} />
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
