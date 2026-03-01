import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type {
  UserProfile,
  Katha,
  KathaCategory,
  DharmaQuote,
  CommunityPost,
  JapCounter,
  Vrat,
  Bhajan,
  Chalisa,
  UserApprovalInfo,
} from '../backend';
import { ExternalBlob } from '../backend';

// ─── Auth ────────────────────────────────────────────────────────────────────

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
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
    mutationFn: async ({ profile, token }: { profile: UserProfile; token: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.setUserProfile(profile, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useIsAdmin() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !actorFetching && !!identity,
  });
}

// Legacy alias
export const useIsCallerAdmin = useIsAdmin;

// ─── Dharma Quote ────────────────────────────────────────────────────────────

export function useGetDharmaQuote() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<DharmaQuote | null>({
    queryKey: ['dharmaQuote'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getDharmaQuoteOfDay();
    },
    enabled: !!actor && !actorFetching,
  });
}

// Legacy alias
export const useGetDharmaQuoteOfDay = useGetDharmaQuote;

// ─── Kathayen ────────────────────────────────────────────────────────────────

export function useGetAllKathayen() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Katha[]>({
    queryKey: ['kathayen'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllKathayen();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetKatha(id: bigint | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Katha | null>({
    queryKey: ['katha', id?.toString()],
    queryFn: async () => {
      if (!actor || id === null) return null;
      return actor.getKatha(id);
    },
    enabled: !!actor && !actorFetching && id !== null,
  });
}

export function useAddKatha() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      title: string;
      category: KathaCategory;
      deity: string;
      hindiText: string;
      englishText: string;
      tags: string[];
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addKatha(
        params.title,
        params.category,
        params.deity,
        params.hindiText,
        params.englishText,
        params.tags
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kathayen'] });
    },
  });
}

// ─── Community Posts ─────────────────────────────────────────────────────────

// Public query — works for unauthenticated users too
export function useGetApprovedCommunityPosts() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<CommunityPost[]>({
    queryKey: ['communityPosts', 'approved'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getApprovedCommunityPosts();
    },
    enabled: !!actor && !actorFetching,
  });
}

// Admin only — all posts
export function useGetAllCommunityPosts() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<CommunityPost[]>({
    queryKey: ['communityPosts', 'all'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllCommunityPosts();
    },
    enabled: !!actor && !actorFetching && !!identity,
  });
}

// Admin only — pending posts
export function useGetPendingCommunityPosts() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<CommunityPost[]>({
    queryKey: ['communityPosts', 'pending'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPendingCommunityPosts();
    },
    enabled: !!actor && !actorFetching && !!identity,
  });
}

export function useCreateCommunityPost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      content: string;
      deityTag?: string;
      image?: ExternalBlob;
      video?: ExternalBlob;
      fileAttachment?: { blob: ExternalBlob; filename: string };
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createCommunityPost(
        params.content,
        params.deityTag ?? null,
        params.image ?? null,
        params.video ?? null,
        params.fileAttachment ?? null
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['communityPosts'] });
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
      queryClient.invalidateQueries({ queryKey: ['communityPosts'] });
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
      queryClient.invalidateQueries({ queryKey: ['communityPosts'] });
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
      queryClient.invalidateQueries({ queryKey: ['communityPosts'] });
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
      queryClient.invalidateQueries({ queryKey: ['communityPosts'] });
    },
  });
}

// ─── Vrats ───────────────────────────────────────────────────────────────────

export function useGetAllVrats() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Vrat[]>({
    queryKey: ['vrats'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllVrats();
    },
    enabled: !!actor && !actorFetching,
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
      queryClient.invalidateQueries({ queryKey: ['vrats'] });
    },
  });
}

export function useUpdateVrat() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { id: bigint; name: string; date: string; description: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateVrat(params.id, params.name, params.date, params.description);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vrats'] });
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
      queryClient.invalidateQueries({ queryKey: ['vrats'] });
    },
  });
}

// ─── Bhajans ─────────────────────────────────────────────────────────────────

export function useGetAllBhajans() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Bhajan[]>({
    queryKey: ['bhajans'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllBhajans();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useAddBhajan() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      title: string;
      lyrics: string;
      language: 'hindi' | 'english';
    }) => {
      if (!actor) throw new Error('Actor not available');
      const lang = params.language === 'hindi'
        ? { hindi: null } as any
        : { english: null } as any;
      return actor.addBhajan(params.title, params.lyrics, lang);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bhajans'] });
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
      queryClient.invalidateQueries({ queryKey: ['bhajans'] });
    },
  });
}

// ─── Chalisa ─────────────────────────────────────────────────────────────────

export function useGetAllChalisa() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Chalisa[]>({
    queryKey: ['chalisa'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllChalisa();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useAddChalisa() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { title: string; fullText: string; meaning: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addChalisa(params.title, params.fullText, params.meaning);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chalisa'] });
    },
  });
}

export function useDeleteChalisa() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteChalisa(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chalisa'] });
    },
  });
}

// ─── Jap Counter ─────────────────────────────────────────────────────────────

export function useGetJapStats() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<JapCounter | null>({
    queryKey: ['japStats'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getJapStats();
    },
    enabled: !!actor && !actorFetching && !!identity,
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

// ─── User Approvals ──────────────────────────────────────────────────────────

export function useListApprovals() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<UserApprovalInfo[]>({
    queryKey: ['approvals'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listApprovals();
    },
    enabled: !!actor && !actorFetching && !!identity,
  });
}

export function useSetApproval() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { user: any; status: any }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.setApproval(params.user, params.status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['approvals'] });
    },
  });
}
