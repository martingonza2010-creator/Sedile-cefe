-- Migration V4.80: Acceso Colaborativo y Tabla de Camas
-- Copie y ejecute este script en el SQL Editor de su panel de Supabase.

-- 1. Habilitar RLS en public.pacientes si no está activo
ALTER TABLE public.pacientes ENABLE ROW LEVEL SECURITY;

-- 2. Eliminar políticas restrictivas anteriores de pacientes (para evitar colisiones)
DROP POLICY IF EXISTS "Permitir todo a usuarios autenticados" ON public.pacientes;
DROP POLICY IF EXISTS "Permitir lectura y escritura a todos los autorizados" ON public.pacientes;
DROP POLICY IF EXISTS "Permitir select a propios" ON public.pacientes;
DROP POLICY IF EXISTS "Permitir insert a propios" ON public.pacientes;
DROP POLICY IF EXISTS "Permitir update a propios" ON public.pacientes;
DROP POLICY IF EXISTS "Permitir delete a propios" ON public.pacientes;
DROP POLICY IF EXISTS "Acceso colaborativo total para usuarios aprobados" ON public.pacientes;

-- 3. Crear política para permitir acceso colaborativo total a usuarios aprobados
CREATE POLICY "Acceso colaborativo total para usuarios aprobados"
ON public.pacientes
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.acceso_usuarios
        WHERE acceso_usuarios.email = auth.jwt() ->> 'email'
          AND acceso_usuarios.acceso_permitido = true
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.acceso_usuarios
        WHERE acceso_usuarios.email = auth.jwt() ->> 'email'
          AND acceso_usuarios.acceso_permitido = true
    )
);

-- 4. Crear la tabla de configuración de camas si no existe
CREATE TABLE IF NOT EXISTS public.config_camas (
    id SERIAL PRIMARY KEY,
    location_key TEXT UNIQUE NOT NULL, -- Ej: "HRA-3-cirugia_infantil"
    beds TEXT[] NOT NULL,              -- Lista de camas: ['301-1', '301-2']
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Habilitar RLS en la tabla de configuración de camas
ALTER TABLE public.config_camas ENABLE ROW LEVEL SECURITY;

-- 6. Eliminar políticas previas de config_camas
DROP POLICY IF EXISTS "Permitir lectura a usuarios autenticados" ON public.config_camas;
DROP POLICY IF EXISTS "Permitir escritura al administrador único" ON public.config_camas;

-- 7. Crear política de lectura pública de camas para usuarios autenticados
CREATE POLICY "Permitir lectura a usuarios autenticados" 
ON public.config_camas FOR SELECT 
TO authenticated 
USING (true);

-- 8. Crear política de escritura exclusiva de camas para el Administrador único
CREATE POLICY "Permitir escritura al administrador único" 
ON public.config_camas FOR ALL 
TO authenticated 
USING (auth.jwt() ->> 'email' = 'martingonza2010@gmail.com')
WITH CHECK (auth.jwt() ->> 'email' = 'martingonza2010@gmail.com');

-- 9. Forzar la recarga de la caché de PostgREST
COMMENT ON TABLE public.pacientes IS 'V4.80 - Acceso colaborativo total y tabla de camas';
COMMENT ON TABLE public.config_camas IS 'V4.80 - Configuración de camas por el Administrador';
