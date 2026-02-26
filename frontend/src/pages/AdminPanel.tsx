import React, { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import {
  useIsCallerAdmin,
  useListApprovals,
  useSetApproval,
  useAssignCallerUserRole,
  useAddDharmaQuote,
  useAddPanchang,
  type ApprovalStatus,
} from '../hooks/useQueries';
import { UserRole } from '../backend';
import type { UserApprovalInfo } from '../backend';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Shield, Users, BookOpen, Calendar, Loader2 } from 'lucide-react';
import type { Principal } from '@dfinity/principal';

export default function AdminPanel() {
  const { identity } = useInternetIdentity();
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const { data: approvals, isLoading: approvalsLoading } = useListApprovals();
  const setApprovalMutation = useSetApproval();
  const assignRoleMutation = useAssignCallerUserRole();
  const addQuoteMutation = useAddDharmaQuote();
  const addPanchangMutation = useAddPanchang();

  // Dharma Quote form
  const [quoteId, setQuoteId] = useState('');
  const [quoteEnglish, setQuoteEnglish] = useState('');
  const [quoteHindi, setQuoteHindi] = useState('');
  const [quoteAuthor, setQuoteAuthor] = useState('');

  // Panchang form
  const [panchangDay, setPanchangDay] = useState('');
  const [panchangTithi, setPanchangTithi] = useState('');
  const [panchangNakshatra, setPanchangNakshatra] = useState('');
  const [panchangRahu, setPanchangRahu] = useState('');
  const [panchangMuhurat, setPanchangMuhurat] = useState('');
  const [panchangSunrise, setPanchangSunrise] = useState('');
  const [panchangSunset, setPanchangSunset] = useState('');

  if (!identity) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Please log in to access the admin panel.</p>
          </CardContent>
        </Card>
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <Shield className="w-12 h-12 text-destructive mx-auto mb-4" />
            <p className="text-foreground font-semibold">Access Denied</p>
            <p className="text-muted-foreground text-sm mt-1">You do not have admin privileges.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleApprove = (principal: Principal) => {
    const status: ApprovalStatus = { approved: null };
    setApprovalMutation.mutate(
      { user: principal, status },
      {
        onSuccess: () => toast.success('User approved'),
        onError: () => toast.error('Failed to approve user'),
      }
    );
  };

  const handleReject = (principal: Principal) => {
    const status: ApprovalStatus = { rejected: null };
    setApprovalMutation.mutate(
      { user: principal, status },
      {
        onSuccess: () => toast.success('User rejected'),
        onError: () => toast.error('Failed to reject user'),
      }
    );
  };

  const handleAssignRole = (principal: Principal, role: UserRole) => {
    assignRoleMutation.mutate(
      { user: principal, role },
      {
        onSuccess: () => toast.success('Role assigned'),
        onError: () => toast.error('Failed to assign role'),
      }
    );
  };

  const handleAddQuote = async () => {
    if (!quoteId || !quoteEnglish || !quoteHindi || !quoteAuthor) {
      toast.error('Please fill all fields');
      return;
    }
    addQuoteMutation.mutate(
      {
        id: BigInt(quoteId),
        englishText: quoteEnglish,
        hindiText: quoteHindi,
        author: quoteAuthor,
      },
      {
        onSuccess: () => {
          toast.success('Quote added successfully');
          setQuoteId('');
          setQuoteEnglish('');
          setQuoteHindi('');
          setQuoteAuthor('');
        },
        onError: () => toast.error('Failed to add quote'),
      }
    );
  };

  const handleAddPanchang = async () => {
    if (!panchangDay || !panchangTithi) {
      toast.error('Please fill required fields');
      return;
    }
    addPanchangMutation.mutate(
      {
        day: BigInt(panchangDay),
        tithi: panchangTithi,
        nakshatra: panchangNakshatra,
        rahuKaal: panchangRahu,
        muhurat: panchangMuhurat,
        sunrise: panchangSunrise,
        sunset: panchangSunset,
      },
      {
        onSuccess: () => {
          toast.success('Panchang data added');
          setPanchangDay('');
          setPanchangTithi('');
          setPanchangNakshatra('');
          setPanchangRahu('');
          setPanchangMuhurat('');
          setPanchangSunrise('');
          setPanchangSunset('');
        },
        onError: () => toast.error('Failed to add panchang data'),
      }
    );
  };

  const getStatusBadge = (approval: UserApprovalInfo) => {
    const statusStr = typeof approval.status === 'string'
      ? approval.status
      : Object.keys(approval.status as object)[0];

    switch (statusStr) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-7 h-7 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Admin Panel</h1>
        </div>

        <Tabs defaultValue="users">
          <TabsList className="mb-6 w-full">
            <TabsTrigger value="users" className="flex-1 gap-1">
              <Users className="w-4 h-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="quotes" className="flex-1 gap-1">
              <BookOpen className="w-4 h-4" />
              Quotes
            </TabsTrigger>
            <TabsTrigger value="panchang" className="flex-1 gap-1">
              <Calendar className="w-4 h-4" />
              Panchang
            </TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Approvals</CardTitle>
              </CardHeader>
              <CardContent>
                {approvalsLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  </div>
                ) : !approvals || approvals.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No approval requests yet.</p>
                ) : (
                  <div className="space-y-4">
                    {approvals.map((approval) => (
                      <div
                        key={approval.principal.toString()}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border border-border rounded-lg"
                      >
                        <div className="space-y-1">
                          <p className="font-mono text-xs text-muted-foreground break-all">
                            {approval.principal.toString()}
                          </p>
                          {getStatusBadge(approval)}
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-green-700 border-green-300 hover:bg-green-50"
                            onClick={() => handleApprove(approval.principal)}
                            disabled={setApprovalMutation.isPending}
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-700 border-red-300 hover:bg-red-50"
                            onClick={() => handleReject(approval.principal)}
                            disabled={setApprovalMutation.isPending}
                          >
                            Reject
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleAssignRole(approval.principal, UserRole.admin)}
                            disabled={assignRoleMutation.isPending}
                          >
                            Make Admin
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Quotes Tab */}
          <TabsContent value="quotes">
            <Card>
              <CardHeader>
                <CardTitle>Add Dharma Quote</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label>ID</Label>
                    <Input
                      type="number"
                      placeholder="Quote ID"
                      value={quoteId}
                      onChange={(e) => setQuoteId(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>Author</Label>
                    <Input
                      placeholder="Author name"
                      value={quoteAuthor}
                      onChange={(e) => setQuoteAuthor(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label>English Text</Label>
                  <Textarea
                    placeholder="Quote in English"
                    value={quoteEnglish}
                    onChange={(e) => setQuoteEnglish(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label>Hindi Text</Label>
                  <Textarea
                    placeholder="Quote in Hindi"
                    value={quoteHindi}
                    onChange={(e) => setQuoteHindi(e.target.value)}
                  />
                </div>
                <Button
                  onClick={handleAddQuote}
                  disabled={addQuoteMutation.isPending}
                  className="w-full"
                >
                  {addQuoteMutation.isPending ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Adding...</>
                  ) : (
                    'Add Quote'
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Panchang Tab */}
          <TabsContent value="panchang">
            <Card>
              <CardHeader>
                <CardTitle>Add Panchang Data</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label>Day (0-364)</Label>
                    <Input
                      type="number"
                      placeholder="Day number"
                      value={panchangDay}
                      onChange={(e) => setPanchangDay(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>Tithi</Label>
                    <Input
                      placeholder="e.g. Pratipada"
                      value={panchangTithi}
                      onChange={(e) => setPanchangTithi(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>Nakshatra</Label>
                    <Input
                      placeholder="e.g. Ashwini"
                      value={panchangNakshatra}
                      onChange={(e) => setPanchangNakshatra(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>Rahu Kaal</Label>
                    <Input
                      placeholder="e.g. 7:30 - 9:00"
                      value={panchangRahu}
                      onChange={(e) => setPanchangRahu(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>Muhurat</Label>
                    <Input
                      placeholder="e.g. 12:00 - 12:48"
                      value={panchangMuhurat}
                      onChange={(e) => setPanchangMuhurat(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>Sunrise</Label>
                    <Input
                      placeholder="e.g. 6:15 AM"
                      value={panchangSunrise}
                      onChange={(e) => setPanchangSunrise(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>Sunset</Label>
                    <Input
                      placeholder="e.g. 6:45 PM"
                      value={panchangSunset}
                      onChange={(e) => setPanchangSunset(e.target.value)}
                    />
                  </div>
                </div>
                <Button
                  onClick={handleAddPanchang}
                  disabled={addPanchangMutation.isPending}
                  className="w-full"
                >
                  {addPanchangMutation.isPending ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Adding...</>
                  ) : (
                    'Add Panchang Data'
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
