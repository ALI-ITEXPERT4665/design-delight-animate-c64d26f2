import { useQuery, queryOptions } from "@tanstack/react-query";
import { getAllSiteContent } from "@/lib/admin/content.functions";

export const siteContentQuery = queryOptions({
  queryKey: ["site", "content"],
  queryFn: () => getAllSiteContent(),
  staleTime: 0,
});

/** Read a published site_content value, falling back to a hard-coded default. */
export function useContent<T>(key: string, fallback: T): T {
  const { data } = useQuery({
    ...siteContentQuery,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    refetchInterval: 5_000,
  });
  const row = data?.items?.find((i) => i.key === key);
  if (row == null || row.value == null) return fallback;
  return row.value as T;
}

/** Read a published array collection, falling back when the CMS key is missing or accidentally emptied. */
export function useCollection<T>(key: string, fallback: T[]): T[] {
  const value = useContent<unknown>(key, fallback);
  return Array.isArray(value) && value.length > 0 ? (value as T[]) : fallback;
}
