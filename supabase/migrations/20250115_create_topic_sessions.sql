-- Create topic_sessions table for storing user-specific topic generator state
CREATE TABLE IF NOT EXISTS public.topic_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  carousel_groups JSONB NOT NULL DEFAULT '[]'::jsonb,
  locked_topics TEXT[] DEFAULT '{}',
  follow_up_states JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_topic_sessions_user_id ON public.topic_sessions(user_id);

-- Enable RLS
ALTER TABLE public.topic_sessions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own topic sessions"
  ON public.topic_sessions
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own topic sessions"
  ON public.topic_sessions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own topic sessions"
  ON public.topic_sessions
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own topic sessions"
  ON public.topic_sessions
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_topic_sessions_updated_at
  BEFORE UPDATE ON public.topic_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add comment
COMMENT ON TABLE public.topic_sessions IS 'Stores user-specific topic generator state including carousel groups, locked topics, and follow-up states';