import React, { useState } from 'react';
import { Shield, Users, Quote, CheckCircle, XCircle, Loader2, AlertTriangle, LogIn } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  useIsCallerAdmin,
  useListApprovals,
  useSetApproval,
  useAssignUserRole,
  useAddDharmaQuote,
} from '../hooks/useQueries';
import { UserRole } from '../backend';

type ApprovalStatus = 'approved' | 'rejected' | 'pending';

export default function AdminPanel() {
  const { identity, login, loginStatus } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const { data: approvals = [], isLoading: approvalsLoading, refetch: refetchApprovals } = useListApprovals();
  const setApprovalMutation = useSetApproval();
  const assignRoleMutation = useAssignUserRole();
  const addQuoteMutation = useAddDharmaQuote();

  const [quoteForm, setQuoteForm] = useState({
    englishText: '',
    hindiText: '',
    author: '',
  });
  const [quoteSuccess, setQuoteSuccess] = useState(false);

  const handleApprove = async (principal: { toString(): string }, status: ApprovalStatus) => {
    try {
      await setApprovalMutation.mutateAsync({ principal: principal as any, status });
      refetchApprovals();
    } catch (err) {
      console.error('Approval action failed:', err);
    }
  };

  const handleAssignRole = async (principal: { toString(): string }, role: UserRole) => {
    try {
      await assignRoleMutation.mutateAsync({ principal: principal as any, role });
      refetchApprovals();
    } catch (err) {
      console.error('Role assignment failed:', err);
    }
  };

  const handleAddQuote = async () => {
    if (!quoteForm.englishText.trim() || !quoteForm.hindiText.trim() || !quoteForm.author.trim()) return;
    try {
      await addQuoteMutation.mutateAsync({
        id: BigInt(Date.now()),
        englishText: quoteForm.englishText.trim(),
        hindiText: quoteForm.hindiText.trim(),
        author: quoteForm.author.trim(),
      });
      setQuoteForm({ englishText: '', hindiText: '', author: '' });
      setQuoteSuccess(true);
      setTimeout(() => setQuoteSuccess(false), 3000);
    } catch (err) {
      console.error('Add quote failed:', err);
    }
  };

  // Not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <Shield className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-bold text-foreground mb-2">एडमिन पैनल</h2>
          <p className="text-muted-foreground text-sm mb-6">
            एडमिन पैनल तक पहुँचने के लिए लॉगिन करें।
          </p>
          <Button
            onClick={login}
            disabled={loginStatus === 'logging-in'}
            className="bg-amber-600 hover:bg-amber-500 text-white"
          >
            {loginStatus === 'logging-in' ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> लॉगिन हो रहा है...</>
            ) : (
              <><LogIn className="w-4 h-4 mr-2" /> लॉगिन करें</>
            )}
          </Button>
        </div>
      </div>
    );
  }

  // Loading admin status
  if (adminLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  // Not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <AlertTriangle className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-bold text-foreground mb-2">पहुँच अस्वीकृत</h2>
          <p className="text-muted-foreground text-sm">
            आपके पास एडमिन पैनल तक पहुँचने की अनुमति नहीं है।
          </p>
        </div>
      </div>
    );
  }

  const pendingApprovals = approvals.filter(a => {
    const s = a.status as any;
    return s === 'pending' || s?.__kind__ === 'pending' || JSON.stringify(s).includes('pending');
  });

  const getStatusLabel = (status: any): string => {
    const s = JSON.stringify(status);
    if (s.includes('approved')) return 'approved';
    if (s.includes('rejected')) return 'rejected';
    return 'pending';
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-900 to-orange-900 px-4 pt-6 pb-8">
        <div className="flex items-center gap-3">
          <Shield className="w-7 h-7 text-amber-300" />
          <div>
            <h1 className="text-2xl font-bold text-white">एडमिन पैनल</h1>
            <p className="text-amber-200 text-sm">व्यवस्थापक नियंत्रण केंद्र</p>
          </div>
        </div>
      </div>

      <div className="px-4 -mt-4">
        <Tabs defaultValue="approvals" className="w-full">
          <TabsList className="w-full grid grid-cols-2 mb-4">
            <TabsTrigger value="approvals">
              <Users className="w-4 h-4 mr-1" />
              उपयोगकर्ता ({pendingApprovals.length})
            </TabsTrigger>
            <TabsTrigger value="quotes">
              <Quote className="w-4 h-4 mr-1" />
              धर्म उद्धरण
            </TabsTrigger>
          </TabsList>

          {/* User Approvals Tab */}
          <TabsContent value="approvals" className="space-y-3">
            {approvalsLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
              </div>
            ) : approvals.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="w-10 h-10 mx-auto mb-2 opacity-40" />
                <p className="text-sm">कोई उपयोगकर्ता नहीं मिला</p>
              </div>
            ) : (
              approvals.map((approval, idx) => {
                const statusLabel = getStatusLabel(approval.status);
                const principalStr = approval.principal.toString();
                const shortPrincipal = principalStr.length > 16
                  ? principalStr.slice(0, 8) + '...' + principalStr.slice(-6)
                  : principalStr;

                return (
                  <div key={idx} className="bg-card border border-border rounded-xl p-4">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <p className="font-mono text-xs text-foreground">{shortPrincipal}</p>
                        <Badge
                          variant={statusLabel === 'approved' ? 'default' : statusLabel === 'rejected' ? 'destructive' : 'secondary'}
                          className="mt-1 text-xs"
                        >
                          {statusLabel === 'approved' ? 'अनुमोदित' : statusLabel === 'rejected' ? 'अस्वीकृत' : 'लंबित'}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleApprove(approval.principal, 'approved')}
                          disabled={setApprovalMutation.isPending || statusLabel === 'approved'}
                          className="text-green-600 border-green-600 hover:bg-green-50 text-xs"
                        >
                          {setApprovalMutation.isPending ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <><CheckCircle className="w-3 h-3 mr-1" /> अनुमोदित</>
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleApprove(approval.principal, 'rejected')}
                          disabled={setApprovalMutation.isPending || statusLabel === 'rejected'}
                          className="text-red-600 border-red-600 hover:bg-red-50 text-xs"
                        >
                          <XCircle className="w-3 h-3 mr-1" /> अस्वीकृत
                        </Button>
                      </div>
                    </div>

                    {/* Role assignment */}
                    <div className="flex items-center gap-2 pt-2 border-t border-border">
                      <span className="text-xs text-muted-foreground">भूमिका:</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleAssignRole(approval.principal, UserRole.admin)}
                        disabled={assignRoleMutation.isPending}
                        className="text-xs h-7 px-2"
                      >
                        एडमिन बनाएं
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleAssignRole(approval.principal, UserRole.user)}
                        disabled={assignRoleMutation.isPending}
                        className="text-xs h-7 px-2"
                      >
                        उपयोगकर्ता बनाएं
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </TabsContent>

          {/* Dharma Quotes Tab */}
          <TabsContent value="quotes" className="space-y-4">
            <div className="bg-card border border-border rounded-xl p-4 space-y-3">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <Quote className="w-4 h-4 text-amber-500" />
                नया धर्म उद्धरण जोड़ें
              </h3>

              <div className="space-y-2">
                <label className="text-xs text-muted-foreground font-medium">हिंदी पाठ *</label>
                <Textarea
                  value={quoteForm.hindiText}
                  onChange={(e) => setQuoteForm(f => ({ ...f, hindiText: e.target.value }))}
                  placeholder="हिंदी में उद्धरण लिखें..."
                  className="min-h-[80px] resize-none text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs text-muted-foreground font-medium">English Text *</label>
                <Textarea
                  value={quoteForm.englishText}
                  onChange={(e) => setQuoteForm(f => ({ ...f, englishText: e.target.value }))}
                  placeholder="Write quote in English..."
                  className="min-h-[80px] resize-none text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs text-muted-foreground font-medium">लेखक / Author *</label>
                <Input
                  value={quoteForm.author}
                  onChange={(e) => setQuoteForm(f => ({ ...f, author: e.target.value }))}
                  placeholder="जैसे: भगवद्गीता, अध्याय 2"
                  className="text-sm"
                />
              </div>

              {quoteSuccess && (
                <p className="text-green-500 text-sm font-medium flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" /> उद्धरण सफलतापूर्वक जोड़ा गया!
                </p>
              )}

              <Button
                onClick={handleAddQuote}
                disabled={
                  addQuoteMutation.isPending ||
                  !quoteForm.englishText.trim() ||
                  !quoteForm.hindiText.trim() ||
                  !quoteForm.author.trim()
                }
                className="w-full bg-amber-600 hover:bg-amber-500 text-white"
              >
                {addQuoteMutation.isPending ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> जोड़ा जा रहा है...</>
                ) : (
                  'उद्धरण जोड़ें'
                )}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
