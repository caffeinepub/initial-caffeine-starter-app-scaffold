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
import { getSecretParameter } from "../utils/urlParams";
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
        getSecretParameter("caffeineAdminToken") || "",
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
        getSecretParameter("caffeineAdminToken") || "",
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
      return actor.deleteKatha(
        id,
        getSecretParameter("caffeineAdminToken") || "",
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kathayen"] });
    },
  });
}

// ─── Community Posts ──────────────────────────────────────────────────────────

// Fetches approved posts — public query, no auth required.
// Works for both logged-in users and anonymous visitors (including APK/Appilix).
export function useGetApprovedCommunityPosts() {
  const { actor, isFetching } = useActor();
  return useQuery<CommunityPost[]>({
    queryKey: ["communityPosts", "approved"],
    queryFn: async () => {
      if (!actor) return [];
      // getCommunityPosts is a public query — returns all approved posts
      // without requiring Internet Identity auth
      return actor.getCommunityPosts();
    },
    // Always enabled so public users see the feed too
    enabled: !!actor && !isFetching,
    // Refresh every 15s to pick up new posts quickly
    refetchInterval: 15_000,
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

const POST_MEDIA_KEY = "sp_post_media";

interface PostMedia {
  imageDataUrl?: string;
  videoUrl?: string;
}

export function getPostMedia(postId: string): PostMedia | null {
  try {
    const stored = localStorage.getItem(POST_MEDIA_KEY);
    if (!stored) return null;
    const map = JSON.parse(stored) as Record<string, PostMedia>;
    return map[postId] ?? null;
  } catch {
    return null;
  }
}

function savePostMedia(postId: string, media: PostMedia): void {
  try {
    const stored = localStorage.getItem(POST_MEDIA_KEY);
    const map: Record<string, PostMedia> = stored ? JSON.parse(stored) : {};
    map[postId] = media;
    // Keep only last 100 entries to avoid huge storage
    const entries = Object.entries(map);
    if (entries.length > 100) {
      const trimmed = Object.fromEntries(entries.slice(-100));
      localStorage.setItem(POST_MEDIA_KEY, JSON.stringify(trimmed));
    } else {
      localStorage.setItem(POST_MEDIA_KEY, JSON.stringify(map));
    }
  } catch {
    // ignore
  }
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
      imageDataUrl?: string;
      videoUrl?: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      const postId = await actor.createCommunityPost(
        data.content,
        data.deityTag ?? null,
        data.image ?? null,
        data.video ?? null,
        null,
      );
      // Store media sidecar in localStorage keyed by postId
      if (data.imageDataUrl || data.videoUrl) {
        savePostMedia(postId.toString(), {
          imageDataUrl: data.imageDataUrl,
          videoUrl: data.videoUrl,
        });
      }
      return postId;
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
      return actor.approveCommunityPost(
        postId,
        getSecretParameter("caffeineAdminToken") || "",
      );
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
      return actor.rejectCommunityPost(
        postId,
        getSecretParameter("caffeineAdminToken") || "",
      );
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
      return actor.deleteCommunityPost(
        postId,
        getSecretParameter("caffeineAdminToken") || "",
      );
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
