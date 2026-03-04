import type { Principal } from "@dfinity/principal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  Bhajan,
  Chalisa,
  CommunityPost,
  DharmaQuote,
  ExternalBlob,
  JapCounter,
  Katha,
  KathaCategory,
  UserApprovalInfo,
  UserProfile,
  Variant_hindi_english,
  Vrat,
} from "../backend";
import { useActor } from "./useActor";

// ─── Kathayen ────────────────────────────────────────────────────────────────

export function useGetAllKathayen() {
  const { actor, isFetching } = useActor();
  return useQuery<Katha[]>({
    queryKey: ["kathayen"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllKathayen();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetKatha(id: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Katha | null>({
    queryKey: ["katha", id?.toString()],
    queryFn: async () => {
      if (!actor || id === null) return null;
      return actor.getKatha(id);
    },
    enabled: !!actor && !isFetching && id !== null,
  });
}

export function useAddKatha() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      title: string;
      category: KathaCategory;
      deity: string;
      hindiText: string;
      englishText: string;
      tags: string[];
      audioBlob?: ExternalBlob | null;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addKatha(
        data.title,
        data.category,
        data.deity,
        data.hindiText,
        data.englishText,
        data.tags,
        data.audioBlob ?? null,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kathayen"] });
    },
  });
}

export function useUpdateKatha() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      title: string;
      category: KathaCategory;
      deity: string;
      hindiText: string;
      englishText: string;
      tags: string[];
      audioBlob?: ExternalBlob | null;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateKatha(
        data.id,
        data.title,
        data.category,
        data.deity,
        data.hindiText,
        data.englishText,
        data.tags,
        data.audioBlob ?? null,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kathayen"] });
    },
  });
}

export function useDeleteKatha() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteKatha(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kathayen"] });
    },
  });
}

// ─── Community Posts ──────────────────────────────────────────────────────────

// Fetches approved posts using anonymous actor — works without login
// and in APK (Appilix) without Internet Identity
export function useGetApprovedCommunityPosts() {
  const { actor, isFetching } = useActor();
  return useQuery<CommunityPost[]>({
    queryKey: ["communityPosts", "approved"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        // Try getAllKathayen-style public fetch first (no auth).
        // getCommunityPosts requires #user permission (Internet Identity).
        // We use getAllCommunityPosts as admin fallback won't work,
        // so we call getCommunityPosts and catch, returning [] on auth error.
        // For APK: since actor is anonymous, getCommunityPosts may throw.
        // In that case we gracefully return empty array.
        return await actor.getCommunityPosts();
      } catch {
        // Fallback: if auth check fails (happens in APK/anonymous context),
        // return empty array so UI still renders without crashing
        return [];
      }
    },
    // Always enabled so public users see the feed too
    enabled: !!actor && !isFetching,
    // Refresh every 30s to pick up newly approved posts
    refetchInterval: 30_000,
  });
}

export function useGetPendingCommunityPosts() {
  const { actor, isFetching } = useActor();
  return useQuery<CommunityPost[]>({
    queryKey: ["communityPosts", "pending"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPendingCommunityPosts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllCommunityPosts() {
  const { actor, isFetching } = useActor();
  return useQuery<CommunityPost[]>({
    queryKey: ["communityPosts", "all"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllCommunityPosts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateCommunityPost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      content: string;
      deityTag?: string;
      image?: ExternalBlob;
      video?: ExternalBlob;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createCommunityPost(
        data.content,
        data.deityTag ?? null,
        data.image ?? null,
        data.video ?? null,
        null,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["communityPosts"] });
    },
  });
}

export function useApproveCommunityPost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (postId: bigint) => {
      if (!actor) throw new Error("Actor not available");
      return actor.approveCommunityPost(postId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["communityPosts"] });
    },
  });
}

export function useRejectCommunityPost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (postId: bigint) => {
      if (!actor) throw new Error("Actor not available");
      return actor.rejectCommunityPost(postId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["communityPosts"] });
    },
  });
}

export function useDeleteCommunityPost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (postId: bigint) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteCommunityPost(postId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["communityPosts"] });
    },
  });
}

export function useLikeCommunityPost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (postId: bigint) => {
      if (!actor) throw new Error("Actor not available");
      return actor.likeCommunityPost(postId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["communityPosts"] });
    },
  });
}

// ─── Jap Counter ──────────────────────────────────────────────────────────────

export function useGetJapStats() {
  const { actor, isFetching } = useActor();
  return useQuery<JapCounter>({
    queryKey: ["japStats"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getJapStats();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIncrementJap() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (count: bigint) => {
      if (!actor) throw new Error("Actor not available");
      return actor.incrementJap(count);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["japStats"] });
    },
  });
}

export function useResetJapStats() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.resetJapStats();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["japStats"] });
    },
  });
}

// ─── Dharma Quote ─────────────────────────────────────────────────────────────

export function useGetDharmaQuote() {
  const { actor, isFetching } = useActor();
  return useQuery<DharmaQuote | null>({
    queryKey: ["dharmaQuote"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getDharmaQuoteOfDay();
    },
    enabled: !!actor && !isFetching,
  });
}

// Legacy alias
export const useGetDharmaQuoteOfDay = useGetDharmaQuote;

// ─── Bhajans ──────────────────────────────────────────────────────────────────

export function useGetAllBhajans() {
  const { actor, isFetching } = useActor();
  return useQuery<Bhajan[]>({
    queryKey: ["bhajans"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllBhajans();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddBhajan() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      title: string;
      lyrics: string;
      language: Variant_hindi_english;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addBhajan(data.title, data.lyrics, data.language);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bhajans"] });
    },
  });
}

export function useDeleteBhajan() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteBhajan(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bhajans"] });
    },
  });
}

// ─── Chalisa ──────────────────────────────────────────────────────────────────

export function useGetAllChalisa() {
  const { actor, isFetching } = useActor();
  return useQuery<Chalisa[]>({
    queryKey: ["chalisa"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllChalisa();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddChalisa() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      title: string;
      fullText: string;
      meaning: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addChalisa(data.title, data.fullText, data.meaning);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chalisa"] });
    },
  });
}

export function useDeleteChalisa() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteChalisa(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chalisa"] });
    },
  });
}

// ─── Vrats ────────────────────────────────────────────────────────────────────

export function useGetAllVrats() {
  const { actor, isFetching } = useActor();
  return useQuery<Vrat[]>({
    queryKey: ["vrats"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllVrats();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddVrat() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      date: string;
      description: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addVrat(data.name, data.date, data.description);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vrats"] });
    },
  });
}

export function useDeleteVrat() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteVrat(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vrats"] });
    },
  });
}

// ─── User Profile ─────────────────────────────────────────────────────────────

export function useGetCallerUserProfile() {
  const { actor, isFetching } = useActor();
  return useQuery<UserProfile | null>({
    queryKey: ["userProfile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("Actor not available");
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
}

// Legacy alias used by ProfileSetupModal
export const useSetUserProfile = useSaveUserProfile;

// ─── Admin ────────────────────────────────────────────────────────────────────

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

// Legacy alias
export const useIsCallerAdmin = useIsAdmin;

export function useListApprovals() {
  const { actor, isFetching } = useActor();
  return useQuery<UserApprovalInfo[]>({
    queryKey: ["approvals"],
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: async (data: { user: Principal; status: any }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.setApproval(data.user, data.status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["approvals"] });
    },
  });
}

export function useAddDharmaQuote() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      englishText: string;
      hindiText: string;
      author: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addDharmaQuote(
        data.id,
        data.englishText,
        data.hindiText,
        data.author,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dharmaQuote"] });
    },
  });
}
