import { NextRequest, NextResponse } from "next/server";

/**
 * Legacy shared links: /jobs?jobId=X -> /jobs/X
 *
 * Done in a proxy instead of a next.config redirect because config
 * redirects forward the original query string, leaving a stale ?jobId=
 * on the new URL. Here the param is consumed and any other params
 * (filters, page) are preserved. 308 = permanent, so link equity and
 * bookmarks move to the new canonical URL.
 */
export function proxy(request: NextRequest) {
  const jobId = request.nextUrl.searchParams.get("jobId");

  if (jobId) {
    const url = request.nextUrl.clone();
    url.pathname = `/jobs/${jobId}`;
    url.searchParams.delete("jobId");
    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/jobs",
};
