import React, { useState, useRef } from 'react';
import { Shield, Plus, Edit2, Trash2, Check, X, Users, BookOpen, Loader2, Music, Upload } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from '@tanstack/react-router';
import {
  useGetAllKathayen,
  useAddKatha,
  useUpdateKatha,
  useDeleteKatha,
  useGetAllCommunityPosts,
  useApproveCommunityPost,
  useRejectCommunityPost,
  useDeleteCommunityPost,
} from '../hooks/useQueries';
import { KathaCategory, ExternalBlob } from '../backend';
import type { Katha } from '../backend';

interface KathaForm {
  title: string;
  deity: string;
  category: KathaCategory;
  hindiText: string;
  englishText: string;
  tags: string;
}

const emptyForm: KathaForm = {
  title: '',
  deity: '',
  category: KathaCategory.puranik,
  hindiText: '',
  englishText: '',
  tags: '',
};

type AdminTab = 'kathayen' | 'community';

export default function AdminPanel() {
  const { isAdmin, user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<AdminTab>('kathayen');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<bigint | null>(null);
  const [form, setForm] = useState<KathaForm>(emptyForm);
  const [formError, setFormError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // MP3 upload state
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioUploadProgress, setAudioUploadProgress] = useState(0);
  const audioInputRef = useRef<HTMLInputElement>(null);

  // All hooks must be called unconditionally before any early return
  const { data: kathas = [], isLoading: kathasLoading } = useGetAllKathayen();
  const { data: posts = [], isLoading: postsLoading } = useGetAllCommunityPosts();

  const addKatha = useAddKatha();
  const updateKatha = useUpdateKatha();
  const deleteKatha = useDeleteKatha();
  const approvePost = useApproveCommunityPost();
  const rejectPost = useRejectCommunityPost();
  const deletePost = useDeleteCommunityPost();

  // Early return AFTER all hooks
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 px-4">
        <div className="text-6xl">🚫</div>
        <h2 className="text-xl font-bold text-foreground">Access Denied</h2>
        <p className="text-muted-foreground text-center text-sm">
          यह पेज केवल Admin के लिए है।<br />
          कृपया Admin account से login करें।
        </p>
        <button
          onClick={() => navigate({ to: '/' })}
          className="mt-2 px-6 py-2 bg-primary text-primary-foreground rounded-full font-medium"
        >
          होम पर जाएँ
        </button>
      </div>
    );
  }

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const resetForm = () => {
    setForm(emptyForm);
    setAudioFile(null);
    setAudioUploadProgress(0);
    setEditingId(null);
    setShowForm(false);
    setFormError('');
    if (audioInputRef.current) audioInputRef.current.value = '';
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!form.title.trim() || !form.deity.trim() || !form.hindiText.trim()) {
      setFormError('Title, Deity और Hindi Text आवश्यक हैं।');
      return;
    }
    const tags = form.tags.split(',').map(t => t.trim()).filter(Boolean);

    // Build audioBlob from uploaded file if any
    let audioBlob: ExternalBlob | null = null;
    if (audioFile) {
      try {
        const bytes = new Uint8Array(await audioFile.arrayBuffer());
        audioBlob = ExternalBlob.fromBytes(bytes).withUploadProgress(p => setAudioUploadProgress(p));
      } catch {
        setFormError('Audio file पढ़ने में समस्या आई।');
        return;
      }
    }

    try {
      if (editingId !== null) {
        await updateKatha.mutateAsync({
          id: editingId,
          title: form.title,
          category: form.category,
          deity: form.deity,
          hindiText: form.hindiText,
          englishText: form.englishText,
          tags,
          audioBlob,
        });
        showSuccess('कथा अपडेट हो गई! ✅');
      } else {
        await addKatha.mutateAsync({
          title: form.title,
          category: form.category,
          deity: form.deity,
          hindiText: form.hindiText,
          englishText: form.englishText,
          tags,
          audioBlob,
        });
        showSuccess('नई कथा जोड़ी गई! ✅');
      }
      resetForm();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'कुछ गलत हुआ।';
      setFormError(`Error: ${msg}`);
    }
  };

  const handleEdit = (katha: Katha) => {
    const cat = typeof katha.category === 'object'
      ? (Object.keys(katha.category)[0] as KathaCategory)
      : katha.category as KathaCategory;
    setForm({
      title: katha.title,
      deity: katha.deity,
      category: cat,
      hindiText: katha.hindiText,
      englishText: katha.englishText,
      tags: katha.tags.join(', '),
    });
    setEditingId(katha.id);
    setAudioFile(null);
    setAudioUploadProgress(0);
    setShowForm(true);
    setFormError('');
    if (audioInputRef.current) audioInputRef.current.value = '';
  };

  const handleDelete = async (id: bigint) => {
    if (!confirm('क्या आप इस कथा को हटाना चाहते हैं?')) return;
    try {
      await deleteKatha.mutateAsync(id);
      showSuccess('कथा हटा दी गई! ✅');
    } catch {
      setFormError('Delete में समस्या आई।');
    }
  };

  const handleAudioFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file && !file.type.includes('audio')) {
      setFormError('केवल audio file (MP3) upload करें।');
      return;
    }
    setAudioFile(file);
    setAudioUploadProgress(0);
    setFormError('');
  };

  const isPending = addKatha.isPending || updateKatha.isPending;

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-accent px-4 py-5">
        <div className="flex items-center gap-3">
          <Shield size={24} className="text-primary-foreground" />
          <div>
            <h1 className="text-xl font-bold text-primary-foreground">Admin Panel</h1>
            <p className="text-primary-foreground/80 text-xs">Welcome, {user?.username}</p>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {successMsg && (
        <div className="mx-4 mt-3 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-xl px-4 py-2 text-green-800 dark:text-green-300 text-sm font-medium">
          {successMsg}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 px-4 pt-4">
        <button
          onClick={() => setActiveTab('kathayen')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeTab === 'kathayen'
              ? 'bg-primary text-primary-foreground'
              : 'bg-card border border-border text-foreground hover:bg-muted'
          }`}
        >
          <BookOpen size={14} />
          कथाएँ
        </button>
        <button
          onClick={() => setActiveTab('community')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeTab === 'community'
              ? 'bg-primary text-primary-foreground'
              : 'bg-card border border-border text-foreground hover:bg-muted'
          }`}
        >
          <Users size={14} />
          Community
        </button>
      </div>

      <div className="max-w-2xl mx-auto px-4 pt-4">
        {/* KATHAYEN TAB */}
        {activeTab === 'kathayen' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-foreground">कथाएँ प्रबंधन</h2>
              <button
                onClick={() => {
                  if (showForm) {
                    resetForm();
                  } else {
                    setShowForm(true);
                    setEditingId(null);
                    setForm(emptyForm);
                    setFormError('');
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground rounded-full text-sm font-medium"
              >
                <Plus size={14} />
                नई कथा
              </button>
            </div>

            {/* Add/Edit Form */}
            {showForm && (
              <form onSubmit={handleFormSubmit} className="bg-card border border-border rounded-2xl p-4 mb-4 space-y-3">
                <h3 className="font-semibold text-foreground text-sm">
                  {editingId !== null ? 'कथा संपादित करें' : 'नई कथा जोड़ें'}
                </h3>

                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Title *</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                    placeholder="कथा का शीर्षक"
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Deity *</label>
                  <input
                    type="text"
                    value={form.deity}
                    onChange={e => setForm(f => ({ ...f, deity: e.target.value }))}
                    placeholder="जैसे: श्री राम, श्री कृष्ण"
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Category *</label>
                  <select
                    value={form.category}
                    onChange={e => setForm(f => ({ ...f, category: e.target.value as KathaCategory }))}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value={KathaCategory.puranik}>पौराणिक (Puranik)</option>
                    <option value={KathaCategory.vrat}>व्रत (Vrat)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Hindi Text *</label>
                  <textarea
                    value={form.hindiText}
                    onChange={e => setForm(f => ({ ...f, hindiText: e.target.value }))}
                    placeholder="हिंदी में कथा लिखें..."
                    rows={5}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">English Text</label>
                  <textarea
                    value={form.englishText}
                    onChange={e => setForm(f => ({ ...f, englishText: e.target.value }))}
                    placeholder="English story text..."
                    rows={4}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={form.tags}
                    onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
                    placeholder="राम, अयोध्या, रामायण"
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* MP3 Audio Upload */}
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    <span className="flex items-center gap-1">
                      <Music size={12} />
                      Audio (MP3) — वैकल्पिक
                    </span>
                  </label>
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-border bg-background hover:bg-muted cursor-pointer transition-colors flex-1">
                      <Upload size={14} className="text-muted-foreground" />
                      <span className="text-sm text-muted-foreground truncate">
                        {audioFile ? audioFile.name : 'MP3 file चुनें...'}
                      </span>
                      <input
                        ref={audioInputRef}
                        type="file"
                        accept="audio/mpeg,audio/mp3,audio/*"
                        className="hidden"
                        onChange={handleAudioFileChange}
                      />
                    </label>
                    {audioFile && (
                      <button
                        type="button"
                        onClick={() => {
                          setAudioFile(null);
                          setAudioUploadProgress(0);
                          if (audioInputRef.current) audioInputRef.current.value = '';
                        }}
                        className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                  {audioFile && (
                    <p className="text-xs text-green-600 dark:text-green-400 mt-1 flex items-center gap-1">
                      <Music size={10} />
                      {(audioFile.size / (1024 * 1024)).toFixed(2)} MB — upload होगा submit पर
                    </p>
                  )}
                  {audioUploadProgress > 0 && audioUploadProgress < 100 && (
                    <div className="mt-2">
                      <div className="w-full bg-muted rounded-full h-1.5">
                        <div
                          className="bg-primary h-1.5 rounded-full transition-all"
                          style={{ width: `${audioUploadProgress}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">Uploading... {audioUploadProgress}%</p>
                    </div>
                  )}
                </div>

                {formError && (
                  <div className="text-destructive text-xs bg-destructive/10 rounded-lg px-3 py-2">{formError}</div>
                )}

                <div className="flex gap-2 pt-1">
                  <button
                    type="submit"
                    disabled={isPending}
                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium disabled:opacity-60"
                  >
                    {isPending && <Loader2 size={14} className="animate-spin" />}
                    {editingId !== null ? 'अपडेट करें' : 'जोड़ें'}
                  </button>
                  <button
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
            {kathasLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 size={24} className="animate-spin text-primary" />
              </div>
            ) : kathas.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                <BookOpen size={32} className="mx-auto mb-2 opacity-40" />
                <p>कोई कथा नहीं है। नई कथा जोड़ें।</p>
              </div>
            ) : (
              <div className="space-y-3">
                {kathas.map(katha => (
                  <div key={katha.id.toString()} className="bg-card border border-border rounded-xl p-3 flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground text-sm truncate">{katha.title}</p>
                      <p className="text-xs text-muted-foreground">{katha.deity}</p>
                      {katha.audioBlob && (
                        <span className="inline-flex items-center gap-1 text-xs text-green-600 dark:text-green-400 mt-0.5">
                          <Music size={10} />
                          Audio available
                        </span>
                      )}
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button
                        onClick={() => handleEdit(katha)}
                        className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(katha.id)}
                        disabled={deleteKatha.isPending}
                        className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive disabled:opacity-50"
                      >
                        {deleteKatha.isPending
                          ? <Loader2 size={14} className="animate-spin" />
                          : <Trash2 size={14} />
                        }
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* COMMUNITY TAB */}
        {activeTab === 'community' && (
          <div>
            <h2 className="font-bold text-foreground mb-4">Community Posts</h2>
            {postsLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 size={24} className="animate-spin text-primary" />
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                <Users size={32} className="mx-auto mb-2 opacity-40" />
                <p>कोई post नहीं है।</p>
              </div>
            ) : (
              <div className="space-y-3">
                {posts.map(post => (
                  <div key={post.id.toString()} className="bg-card border border-border rounded-xl p-3">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground mb-1 truncate">
                          👤 {post.author.toString().slice(0, 12)}...
                        </p>
                        <p className="text-sm text-foreground line-clamp-2">{post.content}</p>
                      </div>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full shrink-0 font-medium ${
                          post.status === 'approved'
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : post.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        }`}
                      >
                        {post.status === 'approved'
                          ? 'Approved'
                          : post.status === 'pending'
                          ? 'Pending'
                          : 'Rejected'}
                      </span>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {post.status !== 'approved' && (
                        <button
                          onClick={() => approvePost.mutate(post.id)}
                          disabled={approvePost.isPending}
                          className="flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg text-xs font-medium hover:bg-green-200 transition-colors disabled:opacity-50"
                        >
                          <Check size={12} />
                          Approve
                        </button>
                      )}
                      {post.status !== 'rejected' && (
                        <button
                          onClick={() => rejectPost.mutate(post.id)}
                          disabled={rejectPost.isPending}
                          className="flex items-center gap-1 px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-lg text-xs font-medium hover:bg-yellow-200 transition-colors disabled:opacity-50"
                        >
                          <X size={12} />
                          Reject
                        </button>
                      )}
                      <button
                        onClick={() => deletePost.mutate(post.id)}
                        disabled={deletePost.isPending}
                        className="flex items-center gap-1 px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg text-xs font-medium hover:bg-red-200 transition-colors disabled:opacity-50"
                      >
                        <Trash2 size={12} />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
