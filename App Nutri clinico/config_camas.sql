-- Script para la creación de la tabla de configuración de camas personalizada por el Administrador
-- Ejecuta este script en el editor SQL de tu panel de Supabase.

CREATE TABLE IF NOT EXISTS public.config_camas (
    id SERIAL PRIMARY KEY,
    location_key TEXT UNIQUE NOT NULL, -- Ej: "HRA-3-Pediatría Lactantes"
    beds TEXT[] NOT NULL,              -- Lista de camas: ['301-1', '301-2', '301-3']
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar políticas de seguridad RLS si están activas en la BD
ALTER TABLE public.config_camas ENABLE ROW LEVEL SECURITY;

-- Política de Lectura: Todos los usuarios autenticados pueden ver la configuración de camas
DROP POLICY IF EXISTS "Permitir lectura a usuarios autenticados" ON public.config_camas;
CREATE POLICY "Permitir lectura a usuarios autenticados" 
ON public.config_camas FOR SELECT 
TO authenticated 
USING (true);

-- Política de Escritura: Solo el Administrador único puede insertar/actualizar
DROP POLICY IF EXISTS "Permitir escritura al administrador único" ON public.config_camas;
CREATE POLICY "Permitir escritura al administrador único" 
ON public.config_camas FOR ALL 
TO authenticated 
USING (auth.jwt() ->> 'email' = 'martingonza2010@gmail.com')
WITH CHECK (auth.jwt() ->> 'email' = 'martingonza2010@gmail.com');
