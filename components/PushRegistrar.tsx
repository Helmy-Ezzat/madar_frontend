"use client";

import { useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/Toast";
import { registerForPush } from "@/lib/push";

/** Registers the device for FCM web push once per logged-in user. */
export default function PushRegistrar() {
    const { user } = useAuth();
    const toast = useToast();
    const registeredFor = useRef<string | null>(null);

    useEffect(() => {
        if (!user || registeredFor.current === user.uid) return;
        registeredFor.current = user.uid;
        registerForPush(
            (message) => toast(message),
            (status) => {
                // Automatic registration stays silent when the user denied notifications or the browser can't do them
                if (status.includes("مرفوضة") || status.includes("مش بيدعم")) return;
                toast(status);
            }
        );
    }, [user, toast]);

    return null;
}
