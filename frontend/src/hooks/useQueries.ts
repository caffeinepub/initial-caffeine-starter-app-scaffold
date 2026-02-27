import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import { UserRole } from '../backend';
import type { Principal } from '@dfinity/principal';

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
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
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
    mutationFn: async (count: number) => {
      if (!actor) throw new Error('Actor not available');
      return actor.incrementJap(BigInt(count));
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

export function useCreateCommunityPost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (content: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createCommunityPost(content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['approvedCommunityPosts'] });
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

// ─── Admin ────────────────────────────────────────────────────────────────────

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery({
    queryKey: ['isCallerAdmin'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching && !!identity,
    retry: false,
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
