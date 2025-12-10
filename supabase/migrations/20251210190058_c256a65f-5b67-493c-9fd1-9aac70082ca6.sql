-- Drop the existing authenticated-only policy
DROP POLICY IF EXISTS "Authenticated users can view all registrations" ON public.training_registrations;

-- Create a new policy allowing anyone to view registrations
CREATE POLICY "Anyone can view registrations" 
ON public.training_registrations 
FOR SELECT 
USING (true);