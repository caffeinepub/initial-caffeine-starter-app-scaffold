import { useCallback, useState } from "react";
import type { KathaCategory } from "../backend";

export interface LocalKatha {
  id: string;
  title: string;
  deity: string;
  category: KathaCategory;
  hindiText: string;
  englishText: string;
  tags: string[];
  audioDataUrl?: string; // base64 audio — works in APK WebView
  createdAt: number;
}

const STORAGE_KEY = "sanatan_kathayen";

function loadKathayen(): LocalKatha[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed as LocalKatha[];
    return [];
  } catch {
    return [];
  }
}

function saveKathayen(kathayen: LocalKatha[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(kathayen));
  } catch {
    // storage quota exceeded — ignore silently
  }
}

function generateId(): string {
  return `local_${Date.now()}_${Math.floor(Math.random() * 1_000_000)}`;
}

async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export interface UseLocalKathayenReturn {
  kathayen: LocalKatha[];
  getKatha: (id: string) => LocalKatha | undefined;
  addKatha: (data: {
    title: string;
    deity: string;
    category: KathaCategory;
    hindiText: string;
    englishText: string;
    tags: string[];
    audioFile?: File | null;
  }) => Promise<string>;
  updateKatha: (
    id: string,
    data: Partial<Omit<LocalKatha, "id" | "createdAt">>,
    audioFile?: File | null,
  ) => Promise<void>;
  deleteKatha: (id: string) => void;
  version: number;
}

export function useLocalKathayen(): UseLocalKathayenReturn {
  const [version, setVersion] = useState(0);

  const bump = useCallback(() => setVersion((v) => v + 1), []);

  const kathayen = loadKathayen();

  const getKatha = useCallback((id: string): LocalKatha | undefined => {
    return loadKathayen().find((k) => k.id === id);
  }, []);

  const addKatha = useCallback(
    async (data: {
      title: string;
      deity: string;
      category: KathaCategory;
      hindiText: string;
      englishText: string;
      tags: string[];
      audioFile?: File | null;
    }): Promise<string> => {
      let audioDataUrl: string | undefined;
      if (data.audioFile) {
        try {
          audioDataUrl = await fileToDataUrl(data.audioFile);
        } catch {
          audioDataUrl = undefined;
        }
      }

      const katha: LocalKatha = {
        id: generateId(),
        title: data.title.trim(),
        deity: data.deity.trim(),
        category: data.category,
        hindiText: data.hindiText.trim(),
        englishText: data.englishText.trim(),
        tags: data.tags,
        audioDataUrl,
        createdAt: Date.now(),
      };

      const list = loadKathayen();
      list.unshift(katha); // newest first
      saveKathayen(list);
      bump();
      return katha.id;
    },
    [bump],
  );

  const updateKatha = useCallback(
    async (
      id: string,
      data: Partial<Omit<LocalKatha, "id" | "createdAt">>,
      audioFile?: File | null,
    ): Promise<void> => {
      let audioDataUrl: string | undefined = data.audioDataUrl;
      if (audioFile) {
        try {
          audioDataUrl = await fileToDataUrl(audioFile);
        } catch {
          audioDataUrl = undefined;
        }
      }

      const list = loadKathayen().map((k) =>
        k.id === id
          ? { ...k, ...data, audioDataUrl: audioDataUrl ?? k.audioDataUrl }
          : k,
      );
      saveKathayen(list);
      bump();
    },
    [bump],
  );

  const deleteKatha = useCallback(
    (id: string): void => {
      const list = loadKathayen().filter((k) => k.id !== id);
      saveKathayen(list);
      bump();
    },
    [bump],
  );

  return {
    kathayen,
    getKatha,
    addKatha,
    updateKatha,
    deleteKatha,
    version,
  };
}
