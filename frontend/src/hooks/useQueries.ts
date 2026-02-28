import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import { UserRole, Variant_hindi_english, ExternalBlob, FileAttachment, Mantra } from '../backend';
import type { Principal } from '@dfinity/principal';

// The admin token is passed on first profile save so the first user becomes admin automatically
const FIRST_USER_ADMIN_TOKEN = 'vdHHsU40C6W3rU2dA4Ncu';

// ─── User Profile ────────────────────────────────────────────────────────────

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  const query = useQuery({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching && !!identity,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSetUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: { name: string; selectedMantra: any }) => {
      if (!actor) throw new Error('Actor not available');
      // Pass the admin token so the first user automatically becomes admin
      return actor.saveCallerUserProfile(profile, FIRST_USER_ADMIN_TOKEN);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      queryClient.invalidateQueries({ queryKey: ['isCallerAdmin'] });
    },
  });
}

// ─── Jap Counter ─────────────────────────────────────────────────────────────

export function useGetJapStats() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery({
    queryKey: ['japStats'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getJapStats();
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

export function useIncrementJap() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (count: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.incrementJap(count);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['japStats'] });
    },
  });
}

export function useResetJapStats() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.resetJapStats();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['japStats'] });
    },
  });
}

// ─── Dharma Quote ─────────────────────────────────────────────────────────────

export function useGetDharmaQuote() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['dharmaQuote'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getDharmaQuoteOfDay();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddDharmaQuote() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { id: bigint; englishText: string; hindiText: string; author: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addDharmaQuote(params.id, params.englishText, params.hindiText, params.author);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dharmaQuote'] });
      queryClient.invalidateQueries({ queryKey: ['allDharmaQuotes'] });
    },
  });
}

// ─── Festivals ────────────────────────────────────────────────────────────────

export function useGetFestivals() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['festivals'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getFestivals();
    },
    enabled: !!actor && !isFetching,
  });
}

// ─── Community Posts ──────────────────────────────────────────────────────────

export function useGetApprovedCommunityPosts() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['approvedCommunityPosts'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getApprovedCommunityPosts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllCommunityPosts() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery({
    queryKey: ['allCommunityPosts'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAllCommunityPosts();
    },
    enabled: !!actor && !isFetching && !!identity,
    retry: false,
  });
}

export interface CreatePostParams {
  content: string;
  deityTag: string | null;
  image?: ExternalBlob | null;
  video?: ExternalBlob | null;
  fileAttachment?: FileAttachment | null;
}

export function useCreateCommunityPost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: CreatePostParams) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createCommunityPost(
        params.content,
        params.deityTag,
        params.image ?? null,
        params.video ?? null,
        params.fileAttachment ?? null,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['approvedCommunityPosts'] });
      queryClient.invalidateQueries({ queryKey: ['allCommunityPosts'] });
    },
  });
}

export function useLikeCommunityPost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.likeCommunityPost(postId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['approvedCommunityPosts'] });
    },
  });
}

export function useReportCommunityPost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.reportCommunityPost(postId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['approvedCommunityPosts'] });
    },
  });
}

export function useApproveCommunityPost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.approveCommunityPost(postId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allCommunityPosts'] });
      queryClient.invalidateQueries({ queryKey: ['approvedCommunityPosts'] });
    },
  });
}

export function useRejectCommunityPost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.rejectCommunityPost(postId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allCommunityPosts'] });
    },
  });
}

export function useDeleteCommunityPost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteCommunityPost(postId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allCommunityPosts'] });
      queryClient.invalidateQueries({ queryKey: ['approvedCommunityPosts'] });
    },
  });
}

// ─── Admin ────────────────────────────────────────────────────────────────────

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  const query = useQuery({
    queryKey: ['isCallerAdmin'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching && !!identity,
    retry: false,
  });

  return {
    ...query,
    isLoading: isFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

/**
 * "Claim admin" by calling saveCallerUserProfile with the provided token.
 * The backend assigns admin to the first user who calls this with the correct token.
 * Subsequent calls with the correct token will just update the profile without granting admin.
 */
export function useClaimAdmin() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (token: string) => {
      if (!actor) throw new Error('Actor not available');
      // Get existing profile name if available, otherwise use a placeholder
      let existingName = 'Admin';
      try {
        const profile = await actor.getCallerUserProfile();
        if (profile && profile.name) {
          existingName = profile.name;
        }
      } catch {
        // ignore, use default
      }
      return actor.saveCallerUserProfile(
        { name: existingName, selectedMantra: Mantra.omNamahShivaya },
        token,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['isCallerAdmin'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      queryClient.invalidateQueries({ queryKey: ['listApprovals'] });
    },
  });
}

export function useListApprovals() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery({
    queryKey: ['listApprovals'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.listApprovals();
    },
    enabled: !!actor && !isFetching && !!identity,
    retry: false,
  });
}

export function useSetApproval() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { principal: Principal; status: 'approved' | 'rejected' | 'pending' }) => {
      if (!actor) throw new Error('Actor not available');
      const statusEnum = { [params.status]: null } as any;
      return actor.setApproval(params.principal, statusEnum);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listApprovals'] });
    },
  });
}

export function useAssignUserRole() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { principal: Principal; role: UserRole }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.assignCallerUserRole(params.principal, params.role);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listApprovals'] });
    },
  });
}

// ─── Approval ─────────────────────────────────────────────────────────────────

export function useIsCallerApproved() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery({
    queryKey: ['isCallerApproved'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.isCallerApproved();
    },
    enabled: !!actor && !isFetching && !!identity,
    retry: false,
  });
}

export function useRequestApproval() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.requestApproval();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['isCallerApproved'] });
    },
  });
}

// ─── Kathayen ─────────────────────────────────────────────────────────────────

export function useGetAllKathayen() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['allKathayen'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAllKathayen();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetKatha(id: bigint) {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['katha', id.toString()],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getKatha(id);
    },
    enabled: !!actor && !isFetching,
  });
}

// ─── Leaderboard ──────────────────────────────────────────────────────────────

export function useGetJapLeaderboard() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['japLeaderboard'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getJapLeaderboard();
    },
    enabled: !!actor && !isFetching,
  });
}

// ─── Vrats ────────────────────────────────────────────────────────────────────

export function useGetAllVrats() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['allVrats'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAllVrats();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddVrat() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { name: string; date: string; description: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addVrat(params.name, params.date, params.description);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allVrats'] });
    },
  });
}

export function useDeleteVrat() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteVrat(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allVrats'] });
    },
  });
}

// ─── Bhajans ──────────────────────────────────────────────────────────────────

export function useGetAllBhajans() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['allBhajans'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAllBhajans();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddBhajan() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { title: string; lyrics: string; language: Variant_hindi_english }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addBhajan(params.title, params.lyrics, params.language);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allBhajans'] });
    },
  });
}

export function useDeleteBhajan() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteBhajan(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allBhajans'] });
    },
  });
}

// ─── Chalisa ──────────────────────────────────────────────────────────────────

export function useGetAllChalisa() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['allChalisa'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAllChalisa();
    },
    enabled: !!actor && !isFetching,
  });
}
