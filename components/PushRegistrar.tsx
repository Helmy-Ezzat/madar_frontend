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
            (status) => toast(status)
        );
    }, [user, toast]);

    return null;
}
