-- Migration V3.51: Fix schema cache and add full persistency
-- Run this in Supabase SQL Editor

-- 1. Ensure 'tmt' exists (Legacy fix)
ALTER TABLE public.pacientes ADD COLUMN IF NOT EXISTS tmt numeric;

-- 2. Add 'ia_report' if missing
ALTER TABLE public.pacientes ADD COLUMN IF NOT EXISTS ia_report text;

-- 3. Add 'metadata' JSONB to store ALL extra data (Assessment, Calculations, etc.)
ALTER TABLE public.pacientes ADD COLUMN IF NOT EXISTS metadata jsonb DEFAULT '{}'::jsonb;

-- 4. Force PostgREST cache refresh by commenting on the table
COMMENT ON TABLE public.pacientes IS 'V3.51 - Persistencia completa activada';

-- 5. Create index on metadata for performance (Optional but recommended)
CREATE INDEX IF NOT EXISTS idx_pacientes_metadata ON public.pacientes USING gin (metadata);
