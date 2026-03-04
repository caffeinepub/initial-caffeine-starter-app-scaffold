import { useCallback, useState } from "react";
import { useAuth } from "./useAuth";

export type PostStatus = "pending" | "approved" | "rejected";

export interface LocalCommunityPost {
  id: string;
  author: string;
  content: string;
  timestamp: number; // Date.now() ms
  likes: number;
  status: PostStatus;
  deityTag?: string;
  imageDataUrl?: string; // base64 dataURL — works in APK WebView
}

const STORAGE_KEY = "sanatan_community_posts";

function loadPosts(): LocalCommunityPost[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed as LocalCommunityPost[];
    return [];
  } catch {
    return [];
  }
}

function savePosts(posts: LocalCommunityPost[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  } catch {
    // storage quota exceeded — ignore silently
  }
}

function generateId(): string {
  return `${Date.now()}_${Math.floor(Math.random() * 1_000_000)}`;
}

// Convert a File to base64 dataURL — synchronous-ish via Promise
async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export interface UseCommunityPostsReturn {
  /** All approved posts (public, no auth needed) */
  getPosts: () => LocalCommunityPost[];
  /** All posts regardless of status (for admin) */
  getAllPosts: () => LocalCommunityPost[];
  /** Create a new pending post — requires auth */
  createPost: (
    content: string,
    deityTag: string,
    imageFile?: File | null,
  ) => Promise<void>;
  /** Approve a post */
  approvePost: (id: string) => void;
  /** Reject a post */
  rejectPost: (id: string) => void;
  /** Delete a post */
  deletePost: (id: string) => void;
  /** Like a post */
  likePost: (id: string) => void;
  /** Force re-render trigger (increment to trigger state update) */
  version: number;
}

export function useCommunityPosts(): UseCommunityPostsReturn {
  const { user } = useAuth();
  // version triggers re-render on mutations
  const [version, setVersion] = useState(0);

  const bump = useCallback(() => setVersion((v) => v + 1), []);

  const getPosts = useCallback((): LocalCommunityPost[] => {
    return loadPosts().filter((p) => p.status === "approved");
  }, []);

  const getAllPosts = useCallback((): LocalCommunityPost[] => {
    return loadPosts();
  }, []);

  const createPost = useCallback(
    async (
      content: string,
      deityTag: string,
      imageFile?: File | null,
    ): Promise<void> => {
      const author = user?.username ?? "अज्ञात";

      let imageDataUrl: string | undefined;
      if (imageFile) {
        try {
          imageDataUrl = await fileToDataUrl(imageFile);
        } catch {
          // If image conversion fails, post without image
          imageDataUrl = undefined;
        }
      }

      const post: LocalCommunityPost = {
        id: generateId(),
        author,
        content: content.trim(),
        timestamp: Date.now(),
        likes: 0,
        status: "pending",
        deityTag: deityTag.trim() || undefined,
        imageDataUrl,
      };

      const posts = loadPosts();
      posts.unshift(post); // newest first
      savePosts(posts);
      bump();
    },
    [user, bump],
  );

  const approvePost = useCallback(
    (id: string): void => {
      const posts = loadPosts().map((p) =>
        p.id === id ? { ...p, status: "approved" as PostStatus } : p,
      );
      savePosts(posts);
      bump();
    },
    [bump],
  );

  const rejectPost = useCallback(
    (id: string): void => {
      const posts = loadPosts().map((p) =>
        p.id === id ? { ...p, status: "rejected" as PostStatus } : p,
      );
      savePosts(posts);
      bump();
    },
    [bump],
  );

  const deletePost = useCallback(
    (id: string): void => {
      const posts = loadPosts().filter((p) => p.id !== id);
      savePosts(posts);
      bump();
    },
    [bump],
  );

  const likePost = useCallback(
    (id: string): void => {
      const posts = loadPosts().map((p) =>
        p.id === id ? { ...p, likes: p.likes + 1 } : p,
      );
      savePosts(posts);
      bump();
    },
    [bump],
  );

  return {
    getPosts,
    getAllPosts,
    createPost,
    approvePost,
    rejectPost,
    deletePost,
    likePost,
    version,
  };
}
