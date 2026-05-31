-- Script de Configuración del Administrador y Control de Acceso (SEDILE HRA)
-- Ejecute este script en el editor SQL de Supabase (SQL Editor) para habilitar el control de acceso de usuarios.

-- 1. Crear la tabla de control de acceso si no existe
CREATE TABLE IF NOT EXISTS public.acceso_usuarios (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    email text UNIQUE NOT NULL,
    nombre text,
    acceso_permitido boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE
);

-- 2. Habilitar la seguridad a nivel de filas (Row Level Security - RLS)
ALTER TABLE public.acceso_usuarios ENABLE ROW LEVEL SECURITY;

-- 3. Eliminar políticas existentes para evitar duplicados en caso de re-ejecución
DROP POLICY IF EXISTS "Permitir lectura propia" ON public.acceso_usuarios;
DROP POLICY IF EXISTS "Permitir registro propio" ON public.acceso_usuarios;
DROP POLICY IF EXISTS "Admin select total" ON public.acceso_usuarios;

-- 4. Crear las políticas de seguridad RLS
-- Política para lectura propia: Cualquier usuario autenticado puede leer su propio estado de acceso, 
-- y el administrador (martingonza2010@gmail.com) puede leer todos los registros.
CREATE POLICY "Permitir lectura propia" 
ON public.acceso_usuarios 
FOR SELECT 
TO authenticated 
USING (email = auth.jwt() ->> 'email' OR auth.jwt() ->> 'email' = 'martingonza2010@gmail.com');

-- Política para registro propio: Los nuevos colegas al iniciar sesión con Google pueden auto-registrarse
-- con acceso_permitido establecido en 'false' por defecto.
CREATE POLICY "Permitir registro propio" 
ON public.acceso_usuarios 
FOR INSERT 
TO authenticated 
WITH CHECK (email = auth.jwt() ->> 'email' AND acceso_permitido = false);

-- Política para control total del Administrador: El usuario 'martingonza2010@gmail.com'
-- tiene permisos totales para SELECT, INSERT, UPDATE y DELETE sobre cualquier registro de la tabla.
CREATE POLICY "Admin select total" 
ON public.acceso_usuarios 
FOR ALL 
TO authenticated 
USING (auth.jwt() ->> 'email' = 'martingonza2010@gmail.com')
WITH CHECK (auth.jwt() ->> 'email' = 'martingonza2010@gmail.com');

-- 5. Agregar comentarios informativos a la tabla
COMMENT ON TABLE public.acceso_usuarios IS 'Control de acceso autorizado por el administrador único para ingresar a SEDILE HRA';
