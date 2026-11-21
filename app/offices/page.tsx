import { redirect } from "next/navigation";

// The offices page was removed: offices live as a filter inside /jobs now.
// Keep the route as a redirect so old links keep working.
export default function OfficesPage() {
    redirect("/jobs");
}
