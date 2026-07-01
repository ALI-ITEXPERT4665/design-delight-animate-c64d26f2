
-- Invite slots enum
DO $$ BEGIN
  CREATE TYPE public.invite_slot AS ENUM ('admin','editor','temp_owner');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Add temp-owner fields to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS is_temp boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS temp_expires_at timestamptz;

-- Invite links table (only one active row per slot: redeemed_at IS NULL)
CREATE TABLE IF NOT EXISTS public.invite_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slot public.invite_slot NOT NULL,
  token text NOT NULL UNIQUE,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  redeemed_at timestamptz,
  redeemed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  redeemed_email text
);

CREATE UNIQUE INDEX IF NOT EXISTS invite_links_one_active_per_slot
  ON public.invite_links (slot) WHERE redeemed_at IS NULL;

GRANT SELECT, INSERT, UPDATE ON public.invite_links TO authenticated;
GRANT ALL ON public.invite_links TO service_role;

ALTER TABLE public.invite_links ENABLE ROW LEVEL SECURITY;

-- Owner/admin can view invites (temp owner cannot view temp_owner slot: enforced in fn)
CREATE POLICY "Owners and admins can view invites"
  ON public.invite_links FOR SELECT TO authenticated
  USING (public.has_any_role(auth.uid(), ARRAY['owner','admin']::app_role[]));

-- Public lookup by token — only returns slot+validity, via SECURITY DEFINER RPC (no direct anon table access)
CREATE OR REPLACE FUNCTION public.get_invite_by_token(_token text)
RETURNS TABLE(slot public.invite_slot, valid boolean)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT il.slot, (il.redeemed_at IS NULL) AS valid
  FROM public.invite_links il
  WHERE il.token = _token
  LIMIT 1;
$$;
GRANT EXECUTE ON FUNCTION public.get_invite_by_token(text) TO anon, authenticated;

-- Seed initial active tokens for each slot if none exist
INSERT INTO public.invite_links (slot, token)
SELECT s, encode(gen_random_bytes(24),'hex')
FROM (VALUES ('admin'::public.invite_slot),('editor'::public.invite_slot),('temp_owner'::public.invite_slot)) v(s)
WHERE NOT EXISTS (SELECT 1 FROM public.invite_links il WHERE il.slot = v.s AND il.redeemed_at IS NULL);
