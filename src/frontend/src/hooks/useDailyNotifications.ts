import { useCallback, useEffect, useRef, useState } from "react";

export interface NotificationMessage {
  title: string;
  body: string;
  icon?: string;
  type: "namjap" | "aarti" | "vrat";
}

// 7 notification messages alternating between Nam Jap, Aarti, and Vrat
const NOTIFICATION_MESSAGES: NotificationMessage[] = [
  {
    type: "namjap",
    title: "🕉️ नाम जप का समय | Time for Nam Jap",
    body: "प्रभु का नाम जपें, मन को शांति मिलेगी। Start your morning with Nam Jap.",
  },
  {
    type: "aarti",
    title: "🪔 आरती का समय | Aarti Time",
    body: "सुबह की आरती करें, दिन शुभ होगा। Perform morning Aarti for blessings.",
  },
  {
    type: "namjap",
    title: "🙏 नाम जप स्मरण | Nam Jap Reminder",
    body: "राम नाम जपते रहें, हर पल पवित्र बनाएं। Keep chanting the holy name.",
  },
  {
    type: "vrat",
    title: "🌸 व्रत स्मरण | Vrat Reminder",
    body: "आज के व्रत का पालन करें। Remember your Vrat observance today.",
  },
  {
    type: "namjap",
    title: "🕉️ दोपहर जप | Afternoon Jap",
    body: "दोपहर में भी प्रभु नाम लें। Take a moment for Nam Jap this afternoon.",
  },
  {
    type: "aarti",
    title: "🪔 संध्या आरती | Evening Aarti",
    body: "संध्या आरती का समय हो गया। Time for evening Aarti — light the diya.",
  },
  {
    type: "namjap",
    title: "🌙 रात्रि जप | Night Jap",
    body: "सोने से पहले प्रभु नाम जपें। End your day with peaceful Nam Jap.",
  },
];

// 7 notification times (hours in 24h format, IST-friendly)
const NOTIFICATION_HOURS = [6, 8, 10, 12, 15, 18, 21];

const STORAGE_KEY = "notificationsEnabled";
const LAST_SCHEDULED_KEY = "notificationsLastScheduled";

export interface UseDailyNotificationsReturn {
  isEnabled: boolean;
  permissionStatus: NotificationPermission | "unsupported";
  currentBanner: NotificationMessage | null;
  dismissBanner: () => void;
  enableNotifications: () => Promise<void>;
  disableNotifications: () => void;
  isSupported: boolean;
}

export function useDailyNotifications(): UseDailyNotificationsReturn {
  const isSupported = typeof window !== "undefined" && "Notification" in window;

  const [isEnabled, setIsEnabled] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === "true";
    } catch {
      return false;
    }
  });

  const [permissionStatus, setPermissionStatus] = useState<
    NotificationPermission | "unsupported"
  >(() => {
    if (!isSupported) return "unsupported";
    return Notification.permission;
  });

  const [currentBanner, setCurrentBanner] =
    useState<NotificationMessage | null>(null);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Clear all scheduled timeouts
  const clearScheduledNotifications = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  }, []);

  // Show a browser notification or fall back to in-app banner
  const showNotification = useCallback(
    (msg: NotificationMessage) => {
      if (isSupported && Notification.permission === "granted") {
        try {
          new Notification(msg.title, {
            body: msg.body,
            icon: "/assets/generated/om-logo.dim_256x256.png",
            badge: "/assets/generated/diya-icon.dim_128x128.png",
            tag: `shri-hari-${msg.type}`,
          });
        } catch {
          // Fallback to banner if Notification constructor fails
          setCurrentBanner(msg);
        }
      } else {
        // In-app banner fallback
        setCurrentBanner(msg);
      }
    },
    [isSupported],
  );

  // Schedule 7 notifications for today
  const scheduleForToday = useCallback(
    (enabled: boolean) => {
      clearScheduledNotifications();
      if (!enabled) return;

      const now = new Date();
      const todayKey = now.toDateString();

      NOTIFICATION_HOURS.forEach((hour, index) => {
        const scheduledTime = new Date(now);
        scheduledTime.setHours(hour, 0, 0, 0);

        const delay = scheduledTime.getTime() - now.getTime();
        if (delay > 0) {
          const timeout = setTimeout(() => {
            showNotification(NOTIFICATION_MESSAGES[index]);
          }, delay);
          timeoutsRef.current.push(timeout);
        }
      });

      try {
        localStorage.setItem(LAST_SCHEDULED_KEY, todayKey);
      } catch {
        // ignore
      }
    },
    [clearScheduledNotifications, showNotification],
  );

  // Re-schedule at midnight for the next day
  useEffect(() => {
    if (!isEnabled) return;

    const scheduleNextDay = () => {
      scheduleForToday(true);
    };

    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    const msUntilMidnight = midnight.getTime() - now.getTime();

    const midnightTimeout = setTimeout(() => {
      scheduleNextDay();
      // Then repeat every 24h
      const interval = setInterval(scheduleNextDay, 24 * 60 * 60 * 1000);
      timeoutsRef.current.push(
        interval as unknown as ReturnType<typeof setTimeout>,
      );
    }, msUntilMidnight);

    timeoutsRef.current.push(midnightTimeout);

    return () => {
      clearTimeout(midnightTimeout);
    };
  }, [isEnabled, scheduleForToday]);

  // On mount: schedule if enabled
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally runs only on mount
  useEffect(() => {
    if (isEnabled) {
      scheduleForToday(true);
    }
    return () => {
      clearScheduledNotifications();
    };
  }, []);

  const enableNotifications = useCallback(async () => {
    if (!isSupported) return;

    let permission = Notification.permission;

    if (permission === "default") {
      permission = await Notification.requestPermission();
    }

    setPermissionStatus(permission);

    // We enable in-app banners regardless of browser permission
    setIsEnabled(true);
    try {
      localStorage.setItem(STORAGE_KEY, "true");
    } catch {
      // ignore
    }
    scheduleForToday(true);
  }, [isSupported, scheduleForToday]);

  const disableNotifications = useCallback(() => {
    setIsEnabled(false);
    try {
      localStorage.setItem(STORAGE_KEY, "false");
    } catch {
      // ignore
    }
    clearScheduledNotifications();
    setCurrentBanner(null);
  }, [clearScheduledNotifications]);

  const dismissBanner = useCallback(() => {
    setCurrentBanner(null);
  }, []);

  return {
    isEnabled,
    permissionStatus,
    currentBanner,
    dismissBanner,
    enableNotifications,
    disableNotifications,
    isSupported,
  };
}
