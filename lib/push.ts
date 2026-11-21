import { getMessaging, getToken, onMessage, isSupported } from "firebase/messaging";
import { app, auth } from "@/lib/firebase";

// Public FCM Web Push (VAPID) key - public by design, paired with the server-side sender.
const VAPID_KEY =
  "BBn3bk3rxj3U702PtnShMO4yWJaqDsHpskBcJq2EUNZA4XzCkNzRg_R005TCb1zSQqxf6RvIY9IF7fUNrB8_na8";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const REGISTERED_FLAG = "madar-push-registered";

/**
 * Asks for notification permission, registers the FCM service worker,
 * and sends the device token to the backend for the logged-in user.
 * Safe to call on every login - the backend upserts the token.
 * Every failure path reports through onStatus so the user can see what went wrong.
 */
export async function registerForPush(
  onForeground: (title: string, body: string) => void,
  onStatus: (message: string) => void
): Promise<void> {
  try {
    if (!app || typeof window === "undefined") return;
    if (!("serviceWorker" in navigator) || !("Notification" in window)) {
      onStatus("المتصفح ده مش بيدعم إشعارات الويب");
      return;
    }
    if (!(await isSupported())) {
      onStatus("المتصفح ده مش بيدعم إشعارات الويب");
      return;
    }

    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      onStatus("الإشعارات مرفوضة - فعّلها من إعدادات المتصفح الأول");
      return;
    }

    let registration: ServiceWorkerRegistration;
    try {
      registration = await navigator.serviceWorker.register(
        "/firebase-messaging-sw.js"
      );
      // Pick up a newer worker immediately (older ones rendered pushes empty)
      registration.update().catch(() => {});
      // Wait until the worker is actually active - getToken fails against an installing one
      registration = await navigator.serviceWorker.ready;
    } catch (error) {
      console.error("SW registration failed:", error);
      onStatus("حصلت مشكلة في تجهيز خدمة الإشعارات - جرب تحديث الصفحة");
      return;
    }

    const messaging = getMessaging(app);

    let token: string;
    try {
      token = await getToken(messaging, {
        vapidKey: VAPID_KEY,
        serviceWorkerRegistration: registration,
      });
    } catch (error) {
      console.error("FCM getToken failed:", error);
      onStatus("مقدرناش نجهز الإشعارات على الجهاز ده - جرب تحديث الصفحة");
      return;
    }
    if (!token) {
      onStatus("مقدرناش نجهز الإشعارات على الجهاز ده - جرب تحديث الصفحة");
      return;
    }

    const idToken = await auth?.currentUser?.getIdToken();
    if (!idToken) return;

    const res = await fetch(`${API_BASE_URL}/notifications/register-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({ token }),
    });
    if (!res.ok) {
      console.error("register-token failed:", res.status);
      onStatus("مقدرناش نسجل الجهاز للإشعارات - جرب تسجيل الدخول من جديد");
      return;
    }

    if (!localStorage.getItem(REGISTERED_FLAG)) {
      localStorage.setItem(REGISTERED_FLAG, "1");
      onStatus("الإشعارات اتفعّلت على الجهاز ده ✅");
    }

    // Foreground messages: show as an in-app toast instead of a system notification
    onMessage(messaging, (payload) => {
      const data = (payload.data || {}) as Record<string, string>;
      const title = payload.notification?.title || data.title || "مدار";
      const body = payload.notification?.body || data.body || "";
      onForeground(title, body ? `${title} - ${body}` : title);
    });
  } catch (error) {
    console.error("Push registration failed:", error);
    onStatus("حصل خطأ أثناء تفعيل الإشعارات");
  }
}
