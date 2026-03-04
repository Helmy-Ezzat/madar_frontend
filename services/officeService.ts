import { Office } from "@/types";

export const getOffices = async (): Promise<Office[]> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout (HF cold start)

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs/offices`, {
            next: { revalidate: 3600 },
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!res.ok) {
            throw new Error(`Failed to fetch offices: ${res.statusText}`);
        }

        const json = await res.json();
        return json.data;
    } catch (error) {
        clearTimeout(timeoutId);
        console.error("Fetch Error (getOffices):", error);
        return [];
    }
};
