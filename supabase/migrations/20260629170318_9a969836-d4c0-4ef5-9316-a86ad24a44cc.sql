
-- Storage policies for site-images and site-videos buckets
CREATE POLICY "Authenticated read site media"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id IN ('site-images', 'site-videos'));

CREATE POLICY "Staff upload site media"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id IN ('site-images', 'site-videos')
  AND public.has_any_role(auth.uid(), ARRAY['owner','admin','editor']::public.app_role[])
);

CREATE POLICY "Staff update site media"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id IN ('site-images', 'site-videos')
  AND public.has_any_role(auth.uid(), ARRAY['owner','admin','editor']::public.app_role[])
);

CREATE POLICY "Staff delete site media"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id IN ('site-images', 'site-videos')
  AND public.has_any_role(auth.uid(), ARRAY['owner','admin','editor']::public.app_role[])
);

-- Lock SECURITY DEFINER helper execution to authenticated callers only
REVOKE EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.has_any_role(UUID, public.app_role[]) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.get_user_role(UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.has_any_role(UUID, public.app_role[]) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.get_user_role(UUID) TO authenticated, service_role;
