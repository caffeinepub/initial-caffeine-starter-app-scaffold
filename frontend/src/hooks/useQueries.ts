import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserProfile, Katha, KathaCategory, DharmaQuote, Festival, JapStatsInternal, JapStats, KrishnaLeela, VratKatha } from '../backend';
import { UserRole } from '../backend';
import type { Principal } from '@dfinity/principal';

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
  const { actor, isFetching } = useActor();

  return useQuery<JapStatsInternal>({
    queryKey: ['japStats'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getJapStats();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30000, // Don't refetch too often
  });
}

export function useIncrementJap() {
  const { actor } = useActor();
  // Do NOT invalidate japStats on success to avoid overwriting optimistic UI state

  return useMutation({
    mutationFn: async (count: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.incrementJap(count);
    },
    onError: (err) => {
      console.error('Failed to sync jap count to backend:', err);
    },
  });
}

export function useGetJapLeaderboard() {
  const { actor, isFetching } = useActor();

  return useQuery<JapStats[]>({
    queryKey: ['japLeaderboard'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getJapLeaderboard();
    },
    enabled: !!actor && !isFetching,
  });
}

// ── Dharma Quote ──────────────────────────────────────────────────────────────

export function useGetDharmaQuote() {
  const { actor, isFetching } = useActor();

  return useQuery<DharmaQuote | null>({
    queryKey: ['dharmaQuote'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getDharmaQuoteOfDay();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddDharmaQuote() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (quote: { id: bigint; englishText: string; hindiText: string; author: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addDharmaQuote(quote.id, quote.englishText, quote.hindiText, quote.author);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dharmaQuote'] });
    },
  });
}

// ── Festivals ─────────────────────────────────────────────────────────────────

export function useGetFestivals() {
  const { actor, isFetching } = useActor();

  return useQuery<Festival[]>({
    queryKey: ['festivals'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getFestivals();
    },
    enabled: !!actor && !isFetching,
  });
}

// ── Kathayen ──────────────────────────────────────────────────────────────────

export function useGetAllKathayen() {
  const { actor, isFetching } = useActor();

  return useQuery<Katha[]>({
    queryKey: ['kathayen'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllKathayen();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetKatha(id: bigint) {
  const { actor, isFetching } = useActor();

  return useQuery<Katha | null>({
    queryKey: ['katha', id.toString()],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getKatha(id);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetKathayenByCategory(category: KathaCategory) {
  const { actor, isFetching } = useActor();

  return useQuery<Katha[]>({
    queryKey: ['kathayen', category],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listKathayenByCategory(category);
    },
    enabled: !!actor && !isFetching,
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
      return actor.addKatha(katha.title, katha.category, katha.deity, katha.hindiText, katha.englishText, katha.tags);
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

// ── Krishna Leela ─────────────────────────────────────────────────────────────

export function useGetKrishnaLeelaStory() {
  const { actor, isFetching } = useActor();

  return useQuery<KrishnaLeela>({
    queryKey: ['krishnaLeela'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getKrishnaLeelaStory();
    },
    enabled: !!actor && !isFetching,
  });
}

// ── Vrat Kathas ───────────────────────────────────────────────────────────────

export function useGetAllVratKathas() {
  const { actor, isFetching } = useActor();

  return useQuery<VratKatha[]>({
    queryKey: ['vratKathas'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllVratKathas();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetVratKathaById(id: bigint) {
  const { actor, isFetching } = useActor();

  return useQuery<VratKatha | null>({
    queryKey: ['vratKatha', id.toString()],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getVratKathaById(id);
    },
    enabled: !!actor && !isFetching,
  });
}

// ── Admin ─────────────────────────────────────────────────────────────────────

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
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

export function useListApprovals() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['approvals'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listApprovals();
    },
    enabled: !!actor && !isFetching,
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

export function useIsCallerApproved() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isApproved'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerApproved();
    },
    enabled: !!actor && !isFetching,
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
      queryClient.invalidateQueries({ queryKey: ['isApproved'] });
    },
  });
}
