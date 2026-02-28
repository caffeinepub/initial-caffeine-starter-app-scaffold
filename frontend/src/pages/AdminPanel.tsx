import { useState } from 'react';
import {
  useIsCallerAdmin,
  useClaimAdmin,
  useListApprovals,
  useSetApproval,
  useAssignUserRole,
  useGetAllCommunityPosts,
  useApproveCommunityPost,
  useRejectCommunityPost,
  useDeleteCommunityPost,
  useAddDharmaQuote,
  useAddVrat,
  useGetAllVrats,
  useDeleteVrat,
  useAddBhajan,
  useGetAllBhajans,
  useDeleteBhajan,
} from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { UserRole, Variant_hindi_english } from '../backend';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

export default function AdminPanel() {
  const { identity } = useInternetIdentity();
  const { data: isAdmin, isLoading: adminLoading, isFetched: adminFetched } = useIsCallerAdmin();
  const { data: approvals } = useListApprovals();
  const { data: allPosts } = useGetAllCommunityPosts();
  const { data: allVrats } = useGetAllVrats();
  const { data: allBhajans } = useGetAllBhajans();

  const setApproval = useSetApproval();
  const assignRole = useAssignUserRole();
  const approveCommunityPost = useApproveCommunityPost();
  const rejectCommunityPost = useRejectCommunityPost();
  const deleteCommunityPost = useDeleteCommunityPost();
  const addDharmaQuote = useAddDharmaQuote();
  const addVrat = useAddVrat();
  const deleteVrat = useDeleteVrat();
  const addBhajan = useAddBhajan();
  const deleteBhajan = useDeleteBhajan();
  const claimAdmin = useClaimAdmin();

  // Dharma Quote form
  const [quoteHindi, setQuoteHindi] = useState('');
  const [quoteEnglish, setQuoteEnglish] = useState('');
  const [quoteAuthor, setQuoteAuthor] = useState('');

  // Vrat form
  const [vratName, setVratName] = useState('');
  const [vratDate, setVratDate] = useState('');
  const [vratDesc, setVratDesc] = useState('');

  // Bhajan form
  const [bhajanTitle, setBhajanTitle] = useState('');
  const [bhajanLyrics, setBhajanLyrics] = useState('');

  // Claim admin form
  const [adminToken, setAdminToken] = useState('');
  const [claimError, setClaimError] = useState('');
  const [claimSuccess, setClaimSuccess] = useState(false);

  const isAuthenticated = !!identity;

  // Show loading while actor/identity is initializing
  if (adminLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-4xl mb-3 animate-spin">🕉️</div>
          <p className="text-muted-foreground">Admin status जाँच रहे हैं...</p>
        </div>
      </div>
    );
  }

  // Not logged in
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="text-center bg-card border border-border rounded-2xl p-8 max-w-sm">
          <p className="text-5xl mb-4">🔐</p>
          <h2 className="text-foreground font-bold text-xl mb-2">Login आवश्यक है</h2>
          <p className="text-muted-foreground text-sm">Admin Panel देखने के लिए पहले Login करें।</p>
        </div>
      </div>
    );
  }

  // Logged in but not admin — show claim admin form
  if (adminFetched && !isAdmin) {
    const handleClaimAdmin = async () => {
      if (!adminToken.trim()) {
        setClaimError('कृपया Admin Token दर्ज करें।');
        return;
      }
      setClaimError('');
      try {
        await claimAdmin.mutateAsync(adminToken.trim());
        setClaimSuccess(true);
        setAdminToken('');
      } catch (err: any) {
        const msg = err?.message || String(err);
        if (msg.includes('already been initialized')) {
          setClaimError('Admin पहले से set हो चुका है। आप Admin नहीं बन सकते।');
        } else if (msg.includes('Invalid token') || msg.includes('Unauthorized')) {
          setClaimError('गलत Token! सही Admin Token दर्ज करें।');
        } else {
          setClaimError('कुछ गलत हुआ: ' + msg);
        }
      }
    };

    if (claimSuccess) {
      return (
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="text-center bg-card border border-green-500/30 rounded-2xl p-8 max-w-sm">
            <p className="text-5xl mb-4">✅</p>
            <h2 className="text-foreground font-bold text-xl mb-2">Admin बन गए!</h2>
            <p className="text-muted-foreground text-sm mb-4">आप अब Admin हैं। Page refresh करें।</p>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-gradient-to-r from-saffron-600 to-gold-500 text-white py-2 rounded-xl text-sm font-medium hover:scale-[1.02] transition-all duration-200"
            >
              🔄 Page Refresh करें
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="bg-card border border-border rounded-2xl p-8 max-w-sm w-full">
          <div className="text-center mb-6">
            <p className="text-5xl mb-3">👑</p>
            <h2 className="text-foreground font-bold text-xl mb-1">Admin Access</h2>
            <p className="text-muted-foreground text-sm">
              Admin बनने के लिए Secret Token दर्ज करें।
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-foreground text-sm font-medium mb-1 block">
                Admin Token
              </label>
              <input
                type="password"
                value={adminToken}
                onChange={(e) => {
                  setAdminToken(e.target.value);
                  setClaimError('');
                }}
                placeholder="Secret token यहाँ दर्ज करें..."
                className="w-full bg-muted border border-border rounded-xl px-3 py-2 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
                onKeyDown={(e) => e.key === 'Enter' && handleClaimAdmin()}
              />
            </div>

            {claimError && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-3 py-2">
                <p className="text-red-400 text-xs">{claimError}</p>
              </div>
            )}

            <button
              onClick={handleClaimAdmin}
              disabled={claimAdmin.isPending}
              className="w-full bg-gradient-to-r from-saffron-600 to-gold-500 text-white py-2.5 rounded-xl text-sm font-medium hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {claimAdmin.isPending ? (
                <>
                  <span className="animate-spin text-base">🕉️</span>
                  <span>Processing...</span>
                </>
              ) : (
                '👑 Admin बनें'
              )}
            </button>
          </div>

          <div className="mt-4 bg-amber-500/10 border border-amber-500/20 rounded-xl px-3 py-2">
            <p className="text-amber-400 text-xs text-center">
              ⚠️ यह केवल पहली बार काम करता है। Token गलत होने पर access नहीं मिलेगा।
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Not yet fetched (edge case)
  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-4xl mb-3 animate-spin">🕉️</div>
          <p className="text-muted-foreground">लोड हो रहा है...</p>
        </div>
      </div>
    );
  }

  const handleAddQuote = async () => {
    if (!quoteHindi || !quoteEnglish) return;
    const id = BigInt(Date.now());
    await addDharmaQuote.mutateAsync({ id, hindiText: quoteHindi, englishText: quoteEnglish, author: quoteAuthor });
    setQuoteHindi(''); setQuoteEnglish(''); setQuoteAuthor('');
  };

  const handleAddVrat = async () => {
    if (!vratName || !vratDate) return;
    await addVrat.mutateAsync({ name: vratName, date: vratDate, description: vratDesc });
    setVratName(''); setVratDate(''); setVratDesc('');
  };

  const handleAddBhajan = async () => {
    if (!bhajanTitle || !bhajanLyrics) return;
    await addBhajan.mutateAsync({ title: bhajanTitle, lyrics: bhajanLyrics, language: Variant_hindi_english.hindi });
    setBhajanTitle(''); setBhajanLyrics('');
  };

  return (
    <div className="animate-slide-up">
      <div className="bg-gradient-to-b from-gray-900 to-background px-4 pt-6 pb-4 text-center">
        <h1 className="text-2xl font-bold text-white mb-1">⚙️ Admin Panel</h1>
        <p className="text-gray-300 text-sm">सामग्री और उपयोगकर्ता प्रबंधन</p>
        <div className="mt-2 inline-block bg-gold-500/20 border border-gold-500/30 rounded-full px-3 py-1">
          <p className="text-gold-400 text-xs">👑 Admin Access</p>
        </div>
      </div>

      <div className="px-4 pb-8">
        <Tabs defaultValue="users">
          <TabsList className="w-full grid grid-cols-4 mb-4 bg-muted rounded-xl">
            <TabsTrigger value="users" className="text-xs rounded-lg">👥 Users</TabsTrigger>
            <TabsTrigger value="posts" className="text-xs rounded-lg">📝 Posts</TabsTrigger>
            <TabsTrigger value="content" className="text-xs rounded-lg">📚 Content</TabsTrigger>
            <TabsTrigger value="vrats" className="text-xs rounded-lg">🙏 Vrats</TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users">
            <div className="space-y-3">
              <h2 className="text-foreground font-bold">उपयोगकर्ता अनुमोदन</h2>
              {approvals && approvals.length > 0 ? (
                approvals.map((approval) => (
                  <div key={approval.principal.toString()} className="bg-card border border-border rounded-2xl p-4">
                    <p className="text-foreground text-xs font-mono mb-2 truncate">{approval.principal.toString()}</p>
                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={() => setApproval.mutate({ principal: approval.principal as any, status: 'approved' })}
                        disabled={setApproval.isPending}
                        className="px-3 py-1 bg-green-600/20 text-green-400 border border-green-500/30 rounded-lg text-xs hover:bg-green-600/30 transition-all hover:scale-105"
                      >
                        ✅ Approve
                      </button>
                      <button
                        onClick={() => setApproval.mutate({ principal: approval.principal as any, status: 'rejected' })}
                        disabled={setApproval.isPending}
                        className="px-3 py-1 bg-red-600/20 text-red-400 border border-red-500/30 rounded-lg text-xs hover:bg-red-600/30 transition-all hover:scale-105"
                      >
                        ❌ Reject
                      </button>
                      <button
                        onClick={() => assignRole.mutate({ principal: approval.principal as any, role: UserRole.admin })}
                        disabled={assignRole.isPending}
                        className="px-3 py-1 bg-gold-500/20 text-gold-400 border border-gold-500/30 rounded-lg text-xs hover:bg-gold-500/30 transition-all hover:scale-105"
                      >
                        👑 Make Admin
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-sm text-center py-8">कोई अनुरोध नहीं है</p>
              )}
            </div>
          </TabsContent>

          {/* Posts Tab */}
          <TabsContent value="posts">
            <div className="space-y-3">
              <h2 className="text-foreground font-bold">Community Posts</h2>
              {allPosts && allPosts.length > 0 ? (
                allPosts.map((post) => (
                  <div key={Number(post.id)} className="bg-card border border-border rounded-2xl p-4">
                    <p className="text-foreground text-sm mb-2 line-clamp-3">{post.content}</p>
                    <p className="text-muted-foreground text-xs mb-3">
                      स्थिति: <span className={`font-medium ${
                        post.status === 'approved' ? 'text-green-400' :
                        post.status === 'rejected' ? 'text-red-400' : 'text-amber-400'
                      }`}>{String(post.status)}</span>
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => approveCommunityPost.mutate(post.id)}
                        disabled={approveCommunityPost.isPending}
                        className="px-3 py-1 bg-green-600/20 text-green-400 border border-green-500/30 rounded-lg text-xs hover:bg-green-600/30 transition-all hover:scale-105"
                      >
                        ✅ Approve
                      </button>
                      <button
                        onClick={() => rejectCommunityPost.mutate(post.id)}
                        disabled={rejectCommunityPost.isPending}
                        className="px-3 py-1 bg-amber-600/20 text-amber-400 border border-amber-500/30 rounded-lg text-xs hover:bg-amber-600/30 transition-all hover:scale-105"
                      >
                        ⚠️ Reject
                      </button>
                      <button
                        onClick={() => deleteCommunityPost.mutate(post.id)}
                        disabled={deleteCommunityPost.isPending}
                        className="px-3 py-1 bg-red-600/20 text-red-400 border border-red-500/30 rounded-lg text-xs hover:bg-red-600/30 transition-all hover:scale-105"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-sm text-center py-8">कोई पोस्ट नहीं है</p>
              )}
            </div>
          </TabsContent>

          {/* Content Tab */}
          <TabsContent value="content">
            <div className="space-y-6">
              {/* Add Dharma Quote */}
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-foreground font-bold mb-3">📜 धर्म उद्धरण जोड़ें</h3>
                <div className="space-y-2">
                  <textarea
                    value={quoteHindi}
                    onChange={(e) => setQuoteHindi(e.target.value)}
                    placeholder="हिंदी उद्धरण..."
                    className="w-full bg-muted border border-border rounded-xl px-3 py-2 text-foreground text-sm resize-none h-16 focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                  <textarea
                    value={quoteEnglish}
                    onChange={(e) => setQuoteEnglish(e.target.value)}
                    placeholder="English quote..."
                    className="w-full bg-muted border border-border rounded-xl px-3 py-2 text-foreground text-sm resize-none h-16 focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                  <input
                    value={quoteAuthor}
                    onChange={(e) => setQuoteAuthor(e.target.value)}
                    placeholder="लेखक / Author"
                    className="w-full bg-muted border border-border rounded-xl px-3 py-2 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                  <button
                    onClick={handleAddQuote}
                    disabled={addDharmaQuote.isPending}
                    className="w-full bg-gradient-to-r from-saffron-600 to-gold-500 text-white py-2 rounded-xl text-sm font-medium hover:scale-[1.02] transition-all duration-200 disabled:opacity-50"
                  >
                    {addDharmaQuote.isPending ? '...' : '+ उद्धरण जोड़ें'}
                  </button>
                </div>
              </div>

              {/* Add Bhajan */}
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-foreground font-bold mb-3">🎵 भजन जोड़ें</h3>
                <div className="space-y-2">
                  <input
                    value={bhajanTitle}
                    onChange={(e) => setBhajanTitle(e.target.value)}
                    placeholder="भजन का नाम"
                    className="w-full bg-muted border border-border rounded-xl px-3 py-2 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                  <textarea
                    value={bhajanLyrics}
                    onChange={(e) => setBhajanLyrics(e.target.value)}
                    placeholder="भजन के बोल..."
                    className="w-full bg-muted border border-border rounded-xl px-3 py-2 text-foreground text-sm resize-none h-24 focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                  <button
                    onClick={handleAddBhajan}
                    disabled={addBhajan.isPending}
                    className="w-full bg-gradient-to-r from-pink-700 to-pink-500 text-white py-2 rounded-xl text-sm font-medium hover:scale-[1.02] transition-all duration-200 disabled:opacity-50"
                  >
                    {addBhajan.isPending ? '...' : '+ भजन जोड़ें'}
                  </button>
                </div>

                {/* Bhajan List */}
                {allBhajans && allBhajans.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-muted-foreground text-xs">Backend भजन:</p>
                    {allBhajans.map((b) => (
                      <div key={Number(b.id)} className="flex items-center justify-between bg-muted/50 rounded-xl px-3 py-2">
                        <p className="text-foreground text-sm">{b.title}</p>
                        <button
                          onClick={() => deleteBhajan.mutate(b.id)}
                          disabled={deleteBhajan.isPending}
                          className="text-red-400 text-xs hover:text-red-300 transition-colors"
                        >
                          🗑️
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Vrats Tab */}
          <TabsContent value="vrats">
            <div className="space-y-4">
              <div className="bg-card border border-border rounded-2xl p-4">
                <h3 className="text-foreground font-bold mb-3">🙏 व्रत जोड़ें</h3>
                <div className="space-y-2">
                  <input
                    value={vratName}
                    onChange={(e) => setVratName(e.target.value)}
                    placeholder="व्रत का नाम"
                    className="w-full bg-muted border border-border rounded-xl px-3 py-2 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                  <input
                    type="date"
                    value={vratDate}
                    onChange={(e) => setVratDate(e.target.value)}
                    className="w-full bg-muted border border-border rounded-xl px-3 py-2 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                  <textarea
                    value={vratDesc}
                    onChange={(e) => setVratDesc(e.target.value)}
                    placeholder="व्रत का विवरण..."
                    className="w-full bg-muted border border-border rounded-xl px-3 py-2 text-foreground text-sm resize-none h-16 focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                  <button
                    onClick={handleAddVrat}
                    disabled={addVrat.isPending}
                    className="w-full bg-gradient-to-r from-amber-700 to-amber-500 text-white py-2 rounded-xl text-sm font-medium hover:scale-[1.02] transition-all duration-200 disabled:opacity-50"
                  >
                    {addVrat.isPending ? '...' : '+ व्रत जोड़ें'}
                  </button>
                </div>
              </div>

              {/* Vrat List */}
              {allVrats && allVrats.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-foreground font-bold">Backend व्रत सूची</h3>
                  {allVrats.map((vrat) => (
                    <div key={Number(vrat.id)} className="bg-card border border-border rounded-2xl p-4 flex items-start justify-between">
                      <div>
                        <p className="text-foreground font-medium text-sm">{vrat.name}</p>
                        <p className="text-muted-foreground text-xs">{vrat.date}</p>
                        <p className="text-muted-foreground text-xs mt-1">{vrat.description}</p>
                      </div>
                      <button
                        onClick={() => deleteVrat.mutate(vrat.id)}
                        disabled={deleteVrat.isPending}
                        className="text-red-400 text-sm hover:text-red-300 transition-colors ml-2"
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
