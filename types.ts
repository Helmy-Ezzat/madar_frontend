export interface JobInfo {
    job_titles: string[];
    location: string;
    salary: string;
    experience?: string;
    summary?: string;
}

export interface Job {
    _id: string;
    channel_title: string;
    channel_username: string;
    company_name: string;
    license_number: string;
    source_link: string;
    message_id: number;
    job_info: JobInfo;
    is_job: boolean;
    raw_text: string;
    created_at: string;
    published_at: string;
    company_description?: string;
    posted_by?: string;
    office_verified?: boolean;
    approval_status?: string;
}

export interface PaginationMetadata {
    page: number;
    limit: number;
    total_count: number;
    total_pages: number;
    has_next_page: boolean;
    has_previous_page: boolean;
}

export interface JobsResponse {
    jobs: Job[];
    metadata: PaginationMetadata;
}
export interface GetJobsArgs {
    page?: number;
    limit?: number;
    search?: string;
    location?: string;
    company?: string;
    specialization?: string;
    date_posted?: string;
}

export interface Office {
    name: string;
    jobCount: number;
    description: string;
    license_number: string;
}

export type ActionResponse<T> =
    | { success: true; data: T }
    | { success: false; error: string };