import { getMessaging, getToken, onMessage, isSupported } from "firebase/messaging";
import { app, auth } from "@/lib/firebase";

// Public FCM Web Push (VAPID) key - public by design, paired with the server-side sender.
const VAPID_KEY =
  "BBn3bk3rxj3U702PtnShMO4yWJaqDsHpskBcJq2EUNZA4XzCkNzRg_R005TCb1zSQqxf6RvIY9IF7fUNrB8_na8";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

/**
 * Asks for notification permission, registers the FCM service worker,
 * and sends the device token to the backend for the logged-in user.
 * Safe to call on every login - the backend upserts the token.
 */
export async function registerForPush(
  onForeground: (title: string, body: string) => void
): Promise<void> {
  try {
    if (!app || typeof window === "undefined") return;
    if (!("serviceWorker" in navigator) || !("Notification" in window)) return;
    if (!(await isSupported())) return;

    const permission = await Notification.requestPermission();
    if (permission !== "granted") return;

    const registration = await navigator.serviceWorker.register(
      "/firebase-messaging-sw.js"
    );
    const messaging = getMessaging(app);
    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration,
    });
    if (!token) return;

    const idToken = await auth?.currentUser?.getIdToken();
    if (!idToken) return;

    await fetch(`${API_BASE_URL}/notifications/register-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({ token }),
    });

    // Foreground messages: show as an in-app toast instead of a system notification
    onMessage(messaging, (payload) => {
      const title = payload.notification?.title || "مدار";
      const body = payload.notification?.body || "";
      onForeground(title, body ? `${title} - ${body}` : title);
    });
  } catch (error) {
    console.error("Push registration failed:", error);
  }
}
