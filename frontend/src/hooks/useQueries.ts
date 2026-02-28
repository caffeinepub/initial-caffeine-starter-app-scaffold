import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserProfile, Katha, KathaCategory, CommunityPost, DharmaQuote, Vrat, Bhajan, Chalisa, JapCounter, ExternalBlob, FileAttachment } from '../backend';
import { Mantra } from '../backend';

const FIRST_USER_ADMIN_TOKEN = 'vdHHsU40C6W3rU2dA4Ncu';

// ─── User Profile ────────────────────────────────────────────────────────────

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
    staleTime: 5 * 60 * 1000,
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
    mutationFn: async ({ profile, token }: { profile: UserProfile; token?: string }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.saveCallerUserProfile(profile, token ?? FIRST_USER_ADMIN_TOKEN);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      queryClient.invalidateQueries({ queryKey: ['isAdmin'] });
    },
  });
}

// ─── Admin ────────────────────────────────────────────────────────────────────

export function useIsAdmin() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !actorFetching,
    staleTime: 2 * 60 * 1000,
  });
}

// Keep legacy alias for any remaining usages
export const useIsCallerAdmin = useIsAdmin;

export function useClaimAdmin() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, token }: { name: string; token: string }) => {
      if (!actor) throw new Error('Actor not available');
      const profile: UserProfile = { name, selectedMantra: Mantra.omNamahShivaya };
      await actor.saveCallerUserProfile(profile, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['isAdmin'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// ─── Dharma Quote ─────────────────────────────────────────────────────────────

export function useGetDharmaQuote() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<DharmaQuote | null>({
    queryKey: ['dharmaQuote'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getDharmaQuoteOfDay();
    },
    enabled: !!actor && !actorFetching,
    staleTime: 60 * 60 * 1000,
  });
}

export function useAddDharmaQuote() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      englishText,
      hindiText,
      author,
    }: {
      id: bigint;
      englishText: string;
      hindiText: string;
      author: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addDharmaQuote(id, englishText, hindiText, author);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dharmaQuote'] });
    },
  });
}

export function useDeleteDharmaQuote() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteDharmaQuote(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dharmaQuote'] });
    },
  });
}

// ─── Kathayen ─────────────────────────────────────────────────────────────────

export function useGetAllKathayen() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Katha[]>({
    queryKey: ['kathayen'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllKathayen();
    },
    enabled: !!actor && !actorFetching,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: true,
  });
}

export function useAddKatha() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      title,
      category,
      deity,
      hindiText,
      englishText,
      tags,
    }: {
      title: string;
      category: KathaCategory;
      deity: string;
      hindiText: string;
      englishText: string;
      tags: string[];
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addKatha(title, category, deity, hindiText, englishText, tags);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kathayen'] });
    },
  });
}

// ─── Community Posts ──────────────────────────────────────────────────────────

export function useGetApprovedCommunityPosts() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<CommunityPost[]>({
    queryKey: ['communityPosts'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getApprovedCommunityPosts();
    },
    enabled: !!actor && !actorFetching,
    staleTime: 15 * 1000,
    refetchOnWindowFocus: true,
  });
}

export function useCreateCommunityPost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      content,
      deityTag,
      image,
      video,
      fileAttachment,
    }: {
      content: string;
      deityTag?: string;
      image?: ExternalBlob;
      video?: ExternalBlob;
      fileAttachment?: FileAttachment;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createCommunityPost(
        content,
        deityTag ?? null,
        image ?? null,
        video ?? null,
        fileAttachment ?? null,
      );
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

// ─── Vrats ────────────────────────────────────────────────────────────────────

export function useGetAllVrats() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Vrat[]>({
    queryKey: ['vrats'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllVrats();
    },
    enabled: !!actor && !actorFetching,
    staleTime: 5 * 60 * 1000,
  });
}

export function useAddVrat() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, date, description }: { name: string; date: string; description: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addVrat(name, date, description);
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

// ─── Bhajans ──────────────────────────────────────────────────────────────────

export function useGetAllBhajans() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Bhajan[]>({
    queryKey: ['bhajans'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllBhajans();
    },
    enabled: !!actor && !actorFetching,
    staleTime: 5 * 60 * 1000,
  });
}

// ─── Chalisa ──────────────────────────────────────────────────────────────────

export function useGetAllChalisa() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Chalisa[]>({
    queryKey: ['chalisa'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllChalisa();
    },
    enabled: !!actor && !actorFetching,
    staleTime: 5 * 60 * 1000,
  });
}

// ─── Jap Counter ──────────────────────────────────────────────────────────────

export function useGetJapStats() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<JapCounter>({
    queryKey: ['japStats'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getJapStats();
    },
    enabled: !!actor && !actorFetching,
    staleTime: 30 * 1000,
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

// ─── Approvals ────────────────────────────────────────────────────────────────

export function useListApprovals() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery({
    queryKey: ['approvals'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listApprovals();
    },
    enabled: !!actor && !actorFetching,
    staleTime: 30 * 1000,
  });
}

export function useSetApproval() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ user, status }: { user: any; status: any }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.setApproval(user, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['approvals'] });
    },
  });
}
