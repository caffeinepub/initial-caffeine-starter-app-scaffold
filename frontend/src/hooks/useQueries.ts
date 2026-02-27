import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import {
  UserProfile,
  Mantra,
  DharmaQuote,
  Festival,
  JapStatsInternal,
  JapStats,
  KathaCategory,
  Katha,
  UserApprovalInfo,
  UserRole,
} from '../backend';
import { Principal } from '@dfinity/principal';

// ── User Profile ──────────────────────────────────────────────────────────────

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
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.setUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// ── Jap Counter ───────────────────────────────────────────────────────────────

export function useGetJapStats() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<JapStatsInternal>({
    queryKey: ['japStats'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getJapStats();
    },
    enabled: !!actor && !actorFetching && !!identity,
    retry: false,
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
      // Invalidate japStats so the lifetime count is refreshed from backend
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

export function useGetJapLeaderboard() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<JapStats[]>({
    queryKey: ['japLeaderboard'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getJapLeaderboard();
    },
    enabled: !!actor && !actorFetching,
  });
}

// ── Dharma Quote ──────────────────────────────────────────────────────────────

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

// ── Festivals ─────────────────────────────────────────────────────────────────

export function useGetFestivals() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Festival[]>({
    queryKey: ['festivals'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getFestivals();
    },
    enabled: !!actor && !actorFetching,
  });
}

// ── Kathayen ──────────────────────────────────────────────────────────────────

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

export function useGetKatha(id: bigint) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Katha | null>({
    queryKey: ['katha', id.toString()],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getKatha(id);
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetKathayenByCategory(category: KathaCategory) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Katha[]>({
    queryKey: ['kathayen', category],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listKathayenByCategory(category);
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useAddKatha() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (katha: {
      title: string;
      category: KathaCategory;
      deity: string;
      hindiText: string;
      englishText: string;
      tags: string[];
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addKatha(
        katha.title,
        katha.category,
        katha.deity,
        katha.hindiText,
        katha.englishText,
        katha.tags
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kathayen'] });
    },
  });
}

export function useApproveKatha() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (kathaId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.approveKatha(kathaId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kathayen'] });
    },
  });
}

// ── Admin ─────────────────────────────────────────────────────────────────────

export function useIsCallerAdmin() {
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

export function useGetCallerUserRole() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<UserRole>({
    queryKey: ['callerUserRole'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserRole();
    },
    enabled: !!actor && !actorFetching && !!identity,
  });
}

export function useListApprovals() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<UserApprovalInfo[]>({
    queryKey: ['approvals'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listApprovals();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useSetApproval() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ user, status }: { user: Principal; status: any }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.setApproval(user, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['approvals'] });
    },
  });
}

export function useAssignUserRole() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ user, role }: { user: Principal; role: UserRole }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.assignCallerUserRole(user, role);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['approvals'] });
    },
  });
}

export function useIsCallerApproved() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<boolean>({
    queryKey: ['isCallerApproved'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerApproved();
    },
    enabled: !!actor && !actorFetching && !!identity,
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

export function useGetUserMantra() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<Mantra>({
    queryKey: ['userMantra'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getUserMantra();
    },
    enabled: !!actor && !actorFetching && !!identity,
  });
}
