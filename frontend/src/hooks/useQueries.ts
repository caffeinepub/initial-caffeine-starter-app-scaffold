import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { KathaCategory, KathaApprovalStatus, UserRole, type Katha, type DharmaQuote, type Festival, type JapStats, type JapStatsInternal, type UserProfile, type UserApprovalInfo } from '../backend';
import type { Principal } from '@dfinity/principal';

// Local ApprovalStatus type since it may not be exported from backend interface
export type ApprovalStatus = { approved: null } | { rejected: null } | { pending: null };

// ─── User Profile ────────────────────────────────────────────────────────────

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      const result = await actor.getCallerUserProfile();
      return result ?? null;
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

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      await actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// ─── Dharma Quote ────────────────────────────────────────────────────────────

export function useGetDharmaQuoteOfDay() {
  const { actor, isFetching } = useActor();

  return useQuery<DharmaQuote | null>({
    queryKey: ['dharmaQuoteOfDay'],
    queryFn: async () => {
      if (!actor) return null;
      const result = await actor.getDharmaQuoteOfDay();
      return result ?? null;
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
      await actor.addDharmaQuote(params.id, params.englishText, params.hindiText, params.author);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dharmaQuoteOfDay'] });
    },
  });
}

// ─── Festivals ───────────────────────────────────────────────────────────────

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

// ─── Panchang ────────────────────────────────────────────────────────────────

export function useGetPanchang(day: bigint) {
  const { actor, isFetching } = useActor();

  return useQuery<{ tithi?: string; muhurat?: string }>({
    queryKey: ['panchang', day.toString()],
    queryFn: async () => {
      if (!actor) return {};
      return actor.getPanchang(day);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddPanchang() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      day: bigint;
      tithi: string;
      nakshatra: string;
      rahuKaal: string;
      muhurat: string;
      sunrise: string;
      sunset: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.addPanchang(
        params.day,
        params.tithi,
        params.nakshatra,
        params.rahuKaal,
        params.muhurat,
        params.sunrise,
        params.sunset
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['panchang'] });
    },
  });
}

// ─── Jap Counter ─────────────────────────────────────────────────────────────

export function useGetJapStats() {
  const { actor, isFetching } = useActor();

  return useQuery<JapStatsInternal>({
    queryKey: ['japStats'],
    queryFn: async () => {
      if (!actor) return { daily: BigInt(0), weekly: BigInt(0), lifetime: BigInt(0), lastReset: BigInt(0) };
      return actor.getJapStats();
    },
    enabled: !!actor && !isFetching,
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

export function useIncrementJap() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (count: bigint) => {
      if (!actor) throw new Error('Actor not available');
      await actor.incrementJap(count);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['japStats'] });
      queryClient.invalidateQueries({ queryKey: ['japLeaderboard'] });
    },
  });
}

// ─── Admin ───────────────────────────────────────────────────────────────────

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isCallerAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsCallerApproved() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isCallerApproved'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerApproved();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useListApprovals() {
  const { actor, isFetching } = useActor();

  return useQuery<UserApprovalInfo[]>({
    queryKey: ['listApprovals'],
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
    mutationFn: async (params: { user: Principal; status: ApprovalStatus }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.setApproval(params.user, params.status as any);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listApprovals'] });
    },
  });
}

export function useRequestApproval() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      await actor.requestApproval();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['isCallerApproved'] });
    },
  });
}

export function useGetCallerUserRole() {
  const { actor, isFetching } = useActor();

  return useQuery<UserRole>({
    queryKey: ['callerUserRole'],
    queryFn: async () => {
      if (!actor) return UserRole.guest;
      return actor.getCallerUserRole();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAssignCallerUserRole() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { user: Principal; role: UserRole }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.assignCallerUserRole(params.user, params.role);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['callerUserRole'] });
      queryClient.invalidateQueries({ queryKey: ['listApprovals'] });
    },
  });
}

// ─── Kathayen ────────────────────────────────────────────────────────────────

export function useGetAllKathayen() {
  const { actor, isFetching } = useActor();

  return useQuery<Katha[]>({
    queryKey: ['allKathayen'],
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
      const result = await actor.getKatha(id);
      return result ?? null;
    },
    enabled: !!actor && !isFetching,
  });
}

export function useListKathayenByCategory(category: KathaCategory) {
  const { actor, isFetching } = useActor();

  return useQuery<Katha[]>({
    queryKey: ['kathayenByCategory', category],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listKathayenByCategory(category);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSearchKathayenByTitle(search: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Katha[]>({
    queryKey: ['kathayenByTitle', search],
    queryFn: async () => {
      if (!actor || !search) return [];
      return actor.searchKathayenByTitle(search);
    },
    enabled: !!actor && !isFetching && search.length > 0,
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
      queryClient.invalidateQueries({ queryKey: ['allKathayen'] });
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
      queryClient.invalidateQueries({ queryKey: ['allKathayen'] });
    },
  });
}

export { KathaCategory, KathaApprovalStatus, UserRole };
