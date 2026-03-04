

export interface LocationStat {
    name: string;
    count: number;
}

export const getLocations = async (): Promise<LocationStat[]> => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs/locations`, {
            next: { revalidate: 3600 }
        });

        if (!res.ok) {
            throw new Error(`Failed to fetch locations: ${res.statusText}`);
        }

        const json = await res.json();
        return json.data;
    } catch (error) {
        console.error("Fetch Error (getLocations):", error);
        return [];
    }
};
