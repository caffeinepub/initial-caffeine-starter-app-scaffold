/**
 * In-app notification system using localStorage
 * Tracks new kathayen and community posts, plus admin announcements
 */

export type NotificationType = "katha" | "community" | "announcement";

export interface AppNotification {
  id: string;
  message: string;
  timestamp: number;
  read: boolean;
  type: NotificationType;
}

const NOTIFICATIONS_KEY = "sp_notifications";
const ANNOUNCEMENTS_KEY = "sp_announcements";
const KATHA_COUNT_KEY = "sp_katha_count";
const POST_COUNT_KEY = "sp_post_count";

function loadNotifications(): AppNotification[] {
  try {
    const stored = localStorage.getItem(NOTIFICATIONS_KEY);
    if (stored) return JSON.parse(stored) as AppNotification[];
  } catch {
    // ignore
  }
  return [];
}

function saveNotifications(notifications: AppNotification[]): void {
  try {
    // Keep only last 50
    const trimmed = notifications.slice(-50);
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(trimmed));
  } catch {
    // ignore
  }
}

function loadAnnouncements(): AppNotification[] {
  try {
    const stored = localStorage.getItem(ANNOUNCEMENTS_KEY);
    if (stored) return JSON.parse(stored) as AppNotification[];
  } catch {
    // ignore
  }
  return [];
}

function saveAnnouncements(announcements: AppNotification[]): void {
  try {
    const trimmed = announcements.slice(-20);
    localStorage.setItem(ANNOUNCEMENTS_KEY, JSON.stringify(trimmed));
  } catch {
    // ignore
  }
}

export function getNotifications(): AppNotification[] {
  const notifications = loadNotifications();
  const announcements = loadAnnouncements();
  // Merge and deduplicate by id
  const merged = [...announcements, ...notifications];
  const seen = new Set<string>();
  return merged
    .filter((n) => {
      if (seen.has(n.id)) return false;
      seen.add(n.id);
      return true;
    })
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 30);
}

export function addNotification(
  message: string,
  type: NotificationType,
): AppNotification {
  const notification: AppNotification = {
    id: `${type}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    message,
    timestamp: Date.now(),
    read: false,
    type,
  };
  const existing = loadNotifications();
  // Avoid duplicate messages within 1 minute
  const isDuplicate = existing.some(
    (n) => n.message === message && Date.now() - n.timestamp < 60_000,
  );
  if (!isDuplicate) {
    existing.push(notification);
    saveNotifications(existing);
  }
  return notification;
}

export function addAnnouncement(message: string): AppNotification {
  const notification: AppNotification = {
    id: `announcement_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    message,
    timestamp: Date.now(),
    read: false,
    type: "announcement",
  };
  const existing = loadAnnouncements();
  existing.push(notification);
  saveAnnouncements(existing);
  return notification;
}

export function markAllRead(): void {
  const notifications = loadNotifications();
  const updated = notifications.map((n) => ({ ...n, read: true }));
  saveNotifications(updated);

  const announcements = loadAnnouncements();
  const updatedAnnouncements = announcements.map((n) => ({ ...n, read: true }));
  saveAnnouncements(updatedAnnouncements);
}

export function clearAll(): void {
  try {
    localStorage.removeItem(NOTIFICATIONS_KEY);
    localStorage.removeItem(ANNOUNCEMENTS_KEY);
  } catch {
    // ignore
  }
}

export function getUnreadCount(): number {
  return getNotifications().filter((n) => !n.read).length;
}

// Check if katha count has increased and auto-notify
export function checkKathaCountChange(currentCount: number): void {
  try {
    const storedStr = localStorage.getItem(KATHA_COUNT_KEY);
    const storedCount = storedStr ? Number.parseInt(storedStr, 10) : null;

    if (storedCount !== null && currentCount > storedCount) {
      const diff = currentCount - storedCount;
      addNotification(
        `🕉️ ${diff} नई कथा${diff > 1 ? "एं" : ""} उपलब्ध हैं! अभी पढ़ें।`,
        "katha",
      );
    }

    if (storedCount !== currentCount) {
      localStorage.setItem(KATHA_COUNT_KEY, String(currentCount));
    }
  } catch {
    // ignore
  }
}

// Check if post count has increased and auto-notify
export function checkPostCountChange(currentCount: number): void {
  try {
    const storedStr = localStorage.getItem(POST_COUNT_KEY);
    const storedCount = storedStr ? Number.parseInt(storedStr, 10) : null;

    if (storedCount !== null && currentCount > storedCount) {
      const diff = currentCount - storedCount;
      addNotification(
        `👥 ${diff} नई पोस्ट${diff > 1 ? "ें" : ""} समुदाय में आई हैं!`,
        "community",
      );
    }

    if (storedCount !== currentCount) {
      localStorage.setItem(POST_COUNT_KEY, String(currentCount));
    }
  } catch {
    // ignore
  }
}

export function formatTimeAgoNotification(timestamp: number): string {
  const diff = Date.now() - timestamp;
  if (diff < 60_000) return "अभी";
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 60) return `${minutes} मिनट पहले`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} घंटे पहले`;
  const days = Math.floor(hours / 24);
  return `${days} दिन पहले`;
}
