
CREATE TABLE public.chatbot_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT,
  model TEXT NOT NULL DEFAULT 'google/gemini-3-flash-preview',
  prompt_tokens INTEGER NOT NULL DEFAULT 0,
  completion_tokens INTEGER NOT NULL DEFAULT 0,
  total_tokens INTEGER NOT NULL DEFAULT 0,
  credits NUMERIC(12,6) NOT NULL DEFAULT 0,
  message_count INTEGER NOT NULL DEFAULT 1,
  ip_hash TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.chatbot_events TO authenticated;
GRANT ALL ON public.chatbot_events TO service_role;

ALTER TABLE public.chatbot_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owner reads chatbot events"
  ON public.chatbot_events FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'owner'));

CREATE INDEX chatbot_events_created_at_idx ON public.chatbot_events (created_at DESC);
CREATE INDEX chatbot_events_session_idx ON public.chatbot_events (session_id);
