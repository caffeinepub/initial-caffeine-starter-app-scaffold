import React, { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useIsAdmin, useClaimAdmin, useListApprovals, useSetApproval, useGetApprovedCommunityPosts, useDeleteCommunityPost, useGetAllVrats, useAddVrat, useDeleteVrat, useGetDharmaQuote, useAddDharmaQuote, useDeleteDharmaQuote, useAddKatha } from '../hooks/useQueries';
import { ApprovalStatus, KathaCategory } from '../backend';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Loader2, Shield, Users, MessageSquare, BookOpen, Calendar, Quote, Plus, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminPanel() {
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();
  const isAuthenticated = !!identity;

  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();
  const claimAdmin = useClaimAdmin();

  const [claimName, setClaimName] = useState('');
  const [claimToken, setClaimToken] = useState('');
  const [claimError, setClaimError] = useState('');

  const handleClaimAdmin = async () => {
    if (!claimName.trim() || !claimToken.trim()) {
      setClaimError('नाम और token दोनों जरूरी हैं');
      return;
    }
    setClaimError('');
    try {
      await claimAdmin.mutateAsync({ name: claimName, token: claimToken });
      toast.success('Admin access मिल गया! 🙏');
    } catch (e: any) {
      setClaimError(e?.message || 'Invalid token');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <Shield className="w-16 h-16 text-primary mx-auto" />
          <h2 className="text-2xl font-bold text-foreground">Admin Panel</h2>
          <p className="text-muted-foreground">Login करें Admin Panel access करने के लिए</p>
          <Button onClick={() => navigate({ to: '/' })}>Home पर जाएं</Button>
        </div>
      </div>
    );
  }

  if (adminLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-card border border-border rounded-2xl p-8 max-w-md w-full space-y-6">
          <div className="text-center">
            <Shield className="w-12 h-12 text-primary mx-auto mb-3" />
            <h2 className="text-xl font-bold text-foreground">Admin Access Claim करें</h2>
            <p className="text-muted-foreground text-sm mt-1">Admin token enter करें</p>
          </div>
          <div className="space-y-3">
            <Input
              placeholder="आपका नाम"
              value={claimName}
              onChange={e => setClaimName(e.target.value)}
              className="bg-background"
            />
            <Input
              type="password"
              placeholder="Admin Token"
              value={claimToken}
              onChange={e => setClaimToken(e.target.value)}
              className="bg-background"
            />
            {claimError && <p className="text-destructive text-sm">{claimError}</p>}
            <Button
              className="w-full"
              onClick={handleClaimAdmin}
              disabled={claimAdmin.isPending}
            >
              {claimAdmin.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Admin बनें
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="bg-gradient-to-r from-amber-700 to-orange-600 p-6 text-white">
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8" />
          <div>
            <h1 className="text-2xl font-bold">Admin Panel</h1>
            <p className="text-amber-100 text-sm">Manage your devotional app</p>
          </div>
        </div>
      </div>

      <div className="p-4">
        <Tabs defaultValue="kathayen">
          <TabsList className="grid grid-cols-5 w-full mb-6 bg-muted">
            <TabsTrigger value="kathayen" className="text-xs">
              <BookOpen className="w-3 h-3 mr-1" />कथाएं
            </TabsTrigger>
            <TabsTrigger value="users" className="text-xs">
              <Users className="w-3 h-3 mr-1" />Users
            </TabsTrigger>
            <TabsTrigger value="posts" className="text-xs">
              <MessageSquare className="w-3 h-3 mr-1" />Posts
            </TabsTrigger>
            <TabsTrigger value="vrats" className="text-xs">
              <Calendar className="w-3 h-3 mr-1" />Vrats
            </TabsTrigger>
            <TabsTrigger value="quotes" className="text-xs">
              <Quote className="w-3 h-3 mr-1" />Quotes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="kathayen">
            <KathayenTab />
          </TabsContent>

          <TabsContent value="users">
            <UsersTab />
          </TabsContent>

          <TabsContent value="posts">
            <PostsTab />
          </TabsContent>

          <TabsContent value="vrats">
            <VratsTab />
          </TabsContent>

          <TabsContent value="quotes">
            <QuotesTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// ─── Kathayen Tab ─────────────────────────────────────────────────────────────

function KathayenTab() {
  const addKatha = useAddKatha();
  const [form, setForm] = useState({
    title: '',
    category: 'puranik' as 'puranik' | 'vrat',
    deity: '',
    hindiText: '',
    englishText: '',
    tags: '',
  });
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.deity.trim() || !form.hindiText.trim()) {
      toast.error('Title, Deity और Hindi Text जरूरी हैं');
      return;
    }
    try {
      const tags = form.tags.split(',').map(t => t.trim()).filter(Boolean);
      const category = form.category === 'puranik' ? KathaCategory.puranik : KathaCategory.vrat;
      await addKatha.mutateAsync({
        title: form.title,
        category,
        deity: form.deity,
        hindiText: form.hindiText,
        englishText: form.englishText,
        tags,
      });
      setSuccess(true);
      setForm({ title: '', category: 'puranik', deity: '', hindiText: '', englishText: '', tags: '' });
      toast.success('कथा सफलतापूर्वक add हो गई! 🙏');
      setTimeout(() => setSuccess(false), 3000);
    } catch (e: any) {
      toast.error(e?.message || 'कथा add करने में error आई');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Plus className="w-5 h-5 text-primary" />
          <h3 className="font-bold text-foreground text-lg">नई कथा Add करें</h3>
        </div>
        <p className="text-muted-foreground text-sm mb-4">
          यहाँ add की गई कथा सीधे Kathayen section में दिखेगी और TTS narration automatically available होगा।
        </p>

        {success && (
          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-3 mb-4 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-green-600 text-sm font-medium">कथा Kathayen section में add हो गई!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">कथा का शीर्षक *</label>
            <Input
              placeholder="जैसे: श्री राम कथा, सत्यनारायण व्रत कथा..."
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              className="bg-background"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Category *</label>
              <select
                value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value as 'puranik' | 'vrat' }))}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
              >
                <option value="puranik">पौराणिक</option>
                <option value="vrat">व्रत कथा</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">देवता *</label>
              <Input
                placeholder="जैसे: Shiva, Vishnu, Durga..."
                value={form.deity}
                onChange={e => setForm(f => ({ ...f, deity: e.target.value }))}
                className="bg-background"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">हिंदी पाठ * (TTS इसी से बोलेगा)</label>
            <Textarea
              placeholder="यहाँ कथा का हिंदी पाठ लिखें..."
              value={form.hindiText}
              onChange={e => setForm(f => ({ ...f, hindiText: e.target.value }))}
              className="bg-background min-h-[150px]"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">English Text (वैकल्पिक)</label>
            <Textarea
              placeholder="English translation (optional)..."
              value={form.englishText}
              onChange={e => setForm(f => ({ ...f, englishText: e.target.value }))}
              className="bg-background min-h-[100px]"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Tags (comma separated)</label>
            <Input
              placeholder="जैसे: shiva, parvati, kailash"
              value={form.tags}
              onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
              className="bg-background"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-amber-600 to-orange-500 text-white"
            disabled={addKatha.isPending}
          >
            {addKatha.isPending ? (
              <><Loader2 className="w-4 h-4 animate-spin mr-2" />कथा add हो रही है...</>
            ) : (
              <><Plus className="w-4 h-4 mr-2" />कथा Add करें (Kathayen में सीधे दिखेगी)</>
            )}
          </Button>
        </form>
      </div>

      <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
        <h4 className="font-semibold text-amber-700 dark:text-amber-400 mb-2">ℹ️ TTS के बारे में</h4>
        <p className="text-sm text-muted-foreground">
          हर कथा में automatically Text-to-Speech (TTS) narration available होता है। 
          Users कथा detail page पर जाकर ▶️ बटन दबाकर कथा सुन सकते हैं। 
          Hindi text के लिए Hindi voice automatically select होती है।
        </p>
      </div>
    </div>
  );
}

// ─── Users Tab ────────────────────────────────────────────────────────────────

function UsersTab() {
  const { data: approvals, isLoading } = useListApprovals();
  const setApproval = useSetApproval();

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="font-bold text-foreground text-lg">User Management</h3>
      {!approvals || approvals.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Users className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p>कोई user नहीं मिला</p>
        </div>
      ) : (
        approvals.map((approval) => (
          <div key={approval.principal.toString()} className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-mono text-muted-foreground truncate max-w-[180px]">
                  {approval.principal.toString().slice(0, 20)}...
                </p>
                <Badge
                  variant={approval.status === ApprovalStatus.approved ? 'default' : 'secondary'}
                  className="mt-1"
                >
                  {approval.status}
                </Badge>
              </div>
              <div className="flex gap-2">
                {approval.status !== ApprovalStatus.approved && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-green-600 border-green-600"
                    onClick={() => setApproval.mutate({ user: approval.principal, status: ApprovalStatus.approved })}
                    disabled={setApproval.isPending}
                  >
                    <CheckCircle className="w-4 h-4" />
                  </Button>
                )}
                {approval.status !== ApprovalStatus.rejected && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-destructive border-destructive"
                    onClick={() => setApproval.mutate({ user: approval.principal, status: ApprovalStatus.rejected })}
                    disabled={setApproval.isPending}
                  >
                    <XCircle className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

// ─── Posts Tab ────────────────────────────────────────────────────────────────

function PostsTab() {
  const { data: posts, isLoading } = useGetApprovedCommunityPosts();
  const deletePost = useDeleteCommunityPost();

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="font-bold text-foreground text-lg">Community Posts ({posts?.length ?? 0})</h3>
      {!posts || posts.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p>कोई post नहीं मिली</p>
        </div>
      ) : (
        posts.map((post) => (
          <div key={post.id.toString()} className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground line-clamp-2">{post.content}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  👍 {post.likes.toString()} • 🚩 {post.reports.toString()}
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="text-destructive border-destructive shrink-0"
                onClick={() => deletePost.mutate(post.id)}
                disabled={deletePost.isPending}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

// ─── Vrats Tab ────────────────────────────────────────────────────────────────

function VratsTab() {
  const { data: vrats, isLoading } = useGetAllVrats();
  const addVrat = useAddVrat();
  const deleteVrat = useDeleteVrat();
  const [form, setForm] = useState({ name: '', date: '', description: '' });

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.date.trim()) {
      toast.error('नाम और तारीख जरूरी हैं');
      return;
    }
    try {
      await addVrat.mutateAsync(form);
      setForm({ name: '', date: '', description: '' });
      toast.success('Vrat add हो गया!');
    } catch (e: any) {
      toast.error(e?.message || 'Error');
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-card border border-border rounded-2xl p-4">
        <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
          <Plus className="w-4 h-4" />नया Vrat Add करें
        </h3>
        <form onSubmit={handleAdd} className="space-y-3">
          <Input
            placeholder="Vrat का नाम"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            className="bg-background"
          />
          <Input
            type="date"
            value={form.date}
            onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
            className="bg-background"
          />
          <Textarea
            placeholder="विवरण (वैकल्पिक)"
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            className="bg-background"
          />
          <Button type="submit" className="w-full" disabled={addVrat.isPending}>
            {addVrat.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Add Vrat
          </Button>
        </form>
      </div>

      <div className="space-y-2">
        <h3 className="font-bold text-foreground">Vrats ({vrats?.length ?? 0})</h3>
        {isLoading ? (
          <div className="flex justify-center py-4"><Loader2 className="w-5 h-5 animate-spin text-primary" /></div>
        ) : vrats?.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">कोई vrat नहीं मिला</p>
        ) : (
          vrats?.map(vrat => (
            <div key={vrat.id.toString()} className="bg-card border border-border rounded-xl p-3 flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground text-sm">{vrat.name}</p>
                <p className="text-xs text-muted-foreground">{vrat.date}</p>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="text-destructive border-destructive"
                onClick={() => deleteVrat.mutate(vrat.id)}
                disabled={deleteVrat.isPending}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ─── Quotes Tab ───────────────────────────────────────────────────────────────

function QuotesTab() {
  const { data: quote } = useGetDharmaQuote();
  const addQuote = useAddDharmaQuote();
  const deleteQuote = useDeleteDharmaQuote();
  const [form, setForm] = useState({ englishText: '', hindiText: '', author: '' });

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.englishText.trim() && !form.hindiText.trim()) {
      toast.error('कम से कम एक text जरूरी है');
      return;
    }
    try {
      const id = BigInt(Date.now());
      await addQuote.mutateAsync({ id, ...form });
      setForm({ englishText: '', hindiText: '', author: '' });
      toast.success('Quote add हो गया!');
    } catch (e: any) {
      toast.error(e?.message || 'Error');
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-card border border-border rounded-2xl p-4">
        <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
          <Plus className="w-4 h-4" />नया Dharma Quote Add करें
        </h3>
        <form onSubmit={handleAdd} className="space-y-3">
          <Textarea
            placeholder="Hindi quote..."
            value={form.hindiText}
            onChange={e => setForm(f => ({ ...f, hindiText: e.target.value }))}
            className="bg-background"
          />
          <Textarea
            placeholder="English quote..."
            value={form.englishText}
            onChange={e => setForm(f => ({ ...f, englishText: e.target.value }))}
            className="bg-background"
          />
          <Input
            placeholder="Author (जैसे: Bhagavad Gita)"
            value={form.author}
            onChange={e => setForm(f => ({ ...f, author: e.target.value }))}
            className="bg-background"
          />
          <Button type="submit" className="w-full" disabled={addQuote.isPending}>
            {addQuote.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Add Quote
          </Button>
        </form>
      </div>

      {quote && (
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-sm font-medium text-foreground mb-1">आज का Quote:</p>
          <p className="text-sm text-muted-foreground italic">"{quote.hindiText || quote.englishText}"</p>
          <p className="text-xs text-muted-foreground mt-1">— {quote.author}</p>
          <Button
            size="sm"
            variant="outline"
            className="text-destructive border-destructive mt-2"
            onClick={() => deleteQuote.mutate(quote.id)}
            disabled={deleteQuote.isPending}
          >
            <Trash2 className="w-4 h-4 mr-1" />Delete
          </Button>
        </div>
      )}
    </div>
  );
}
