-- Create enum for department options
CREATE TYPE public.department AS ENUM ('RH', 'TI', 'Vendas', 'Operações');

-- Create enum for familiarity levels
CREATE TYPE public.familiarity_level AS ENUM ('Baixo', 'Médio', 'Alto');

-- Create enum for training dates
CREATE TYPE public.training_date AS ENUM ('11/12', '12/12', '13/12');

-- Create training registrations table
CREATE TABLE public.training_registrations (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name TEXT NOT NULL,
    corporate_email TEXT NOT NULL,
    department department NOT NULL,
    familiarity familiarity_level NOT NULL,
    needs_accessibility BOOLEAN NOT NULL DEFAULT false,
    accessibility_details TEXT,
    observations TEXT,
    training_day training_date NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.training_registrations ENABLE ROW LEVEL SECURITY;

-- Create policy for anyone to insert (public registration)
CREATE POLICY "Anyone can register for training" 
ON public.training_registrations 
FOR INSERT 
WITH CHECK (true);

-- Create policy for authenticated users (HR) to view all registrations
CREATE POLICY "Authenticated users can view all registrations" 
ON public.training_registrations 
FOR SELECT 
TO authenticated
USING (true);