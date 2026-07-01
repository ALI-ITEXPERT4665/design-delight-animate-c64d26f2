
-- Signup request status enum
DO $$ BEGIN
  CREATE TYPE public.signup_request_status AS ENUM ('pending', 'approved', 'rejected');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.signup_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  full_name text,
  requested_role public.app_role NOT NULL DEFAULT 'editor',
  message text,
  status public.signup_request_status NOT NULL DEFAULT 'pending',
  reviewed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at timestamptz,
  review_note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS signup_requests_email_pending_uniq
  ON public.signup_requests (lower(email)) WHERE status = 'pending';

GRANT SELECT, INSERT, UPDATE, DELETE ON public.signup_requests TO authenticated;
GRANT INSERT ON public.signup_requests TO anon;
GRANT ALL ON public.signup_requests TO service_role;

ALTER TABLE public.signup_requests ENABLE ROW LEVEL SECURITY;

-- Anyone (anon or signed-in) can submit a request
CREATE POLICY "Anyone can submit a signup request"
  ON public.signup_requests FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Owner + admin can read all
CREATE POLICY "Admins read signup requests"
  ON public.signup_requests FOR SELECT
  TO authenticated
  USING (public.has_any_role(auth.uid(), ARRAY['owner','admin']::app_role[]));

-- Owner + admin can update (approve/reject)
CREATE POLICY "Admins update signup requests"
  ON public.signup_requests FOR UPDATE
  TO authenticated
  USING (public.has_any_role(auth.uid(), ARRAY['owner','admin']::app_role[]))
  WITH CHECK (public.has_any_role(auth.uid(), ARRAY['owner','admin']::app_role[]));

-- Owner + admin can delete
CREATE POLICY "Admins delete signup requests"
  ON public.signup_requests FOR DELETE
  TO authenticated
  USING (public.has_any_role(auth.uid(), ARRAY['owner','admin']::app_role[]));

CREATE TRIGGER trg_signup_requests_updated
  BEFORE UPDATE ON public.signup_requests
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
