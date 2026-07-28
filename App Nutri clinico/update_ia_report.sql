-- SQL Script for Nutri IA Persistence (V3.27)
-- Run this in Sepabase SQL Editor to enable saving AI reports.

ALTER TABLE public.pacientes 
ADD COLUMN IF NOT EXISTS ia_report TEXT;

COMMENT ON COLUMN public.pacientes.ia_report IS 'Persists the latest AI nutritional analysis for the patient.';
