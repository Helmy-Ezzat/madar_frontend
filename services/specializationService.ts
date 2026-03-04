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
