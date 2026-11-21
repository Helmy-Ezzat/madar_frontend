export interface SpecializationStat {
    name: string;
    count: number;
}

export const getSpecializations = async (): Promise<SpecializationStat[]> => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs/specializations`, {
            next: { revalidate: 3600 }
        });

        if (!res.ok) {
            throw new Error(`Failed to fetch specializations: ${res.statusText}`);
        }

        const json = await res.json();
        return json.data;
    } catch (error) {
        console.error("Fetch Error (getSpecializations):", error);
        return [];
    }
};

/** Real count of distinct specializations across all jobs (uncapped, from the backend). */
export const getSpecializationsTotal = async (): Promise<number> => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs/specializations`, {
            next: { revalidate: 3600 }
        });
        if (!res.ok) throw new Error(`Failed to fetch specializations: ${res.statusText}`);
        const json = await res.json();
        // total is the uncapped distinct count; fall back to the list length on older backends
        return typeof json.total === "number" ? json.total : (json.data?.length ?? 0);
    } catch (error) {
        console.error("Fetch Error (getSpecializationsTotal):", error);
        return 0;
    }
};
