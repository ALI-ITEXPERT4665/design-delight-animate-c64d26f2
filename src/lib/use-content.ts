import { useQuery, queryOptions } from "@tanstack/react-query";
import { getAllSiteContent } from "@/lib/admin/content.functions";

export const siteContentQuery = queryOptions({
  queryKey: ["site", "content"],
  queryFn: () => getAllSiteContent(),
  staleTime: 30_000,
});

/** Read a published site_content value, falling back to a hard-coded default. */
export function useContent<T>(key: string, fallback: T): T {
  const { data } = useQuery(siteContentQuery);
  const row = data?.items?.find((i) => i.key === key);
  if (row == null || row.value == null) return fallback;
  return row.value as T;
}
