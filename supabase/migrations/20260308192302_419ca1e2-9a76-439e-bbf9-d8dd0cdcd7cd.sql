
-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS: admins can read all roles, users can read own
CREATE POLICY "Admins can manage roles" ON public.user_roles
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can read own role" ON public.user_roles
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- Symptom search logs for analytics
CREATE TABLE public.symptom_searches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  symptom TEXT NOT NULL,
  predicted_condition TEXT,
  confidence_score NUMERIC(5,2),
  city TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.symptom_searches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can read symptom searches" ON public.symptom_searches FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Authenticated users can insert" ON public.symptom_searches FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Cost estimation logs
CREATE TABLE public.cost_estimation_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  condition TEXT NOT NULL,
  estimated_cost NUMERIC(12,2) NOT NULL,
  city TEXT,
  hospital_type TEXT,
  insurance_applied BOOLEAN DEFAULT false,
  insurance_coverage NUMERIC(12,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.cost_estimation_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can read cost logs" ON public.cost_estimation_logs FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can insert cost logs" ON public.cost_estimation_logs FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Hospitals table
CREATE TABLE public.hospitals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT,
  latitude NUMERIC(10,7),
  longitude NUMERIC(10,7),
  category TEXT NOT NULL DEFAULT 'general',
  pricing_tier TEXT DEFAULT 'standard',
  consultation_cost NUMERIC(10,2),
  contact_phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.hospitals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read hospitals" ON public.hospitals FOR SELECT USING (true);
CREATE POLICY "Admins can manage hospitals" ON public.hospitals FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Government schemes
CREATE TABLE public.government_schemes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  eligibility_criteria TEXT,
  coverage_amount NUMERIC(12,2),
  state TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.government_schemes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read schemes" ON public.government_schemes FOR SELECT USING (true);
CREATE POLICY "Admins can manage schemes" ON public.government_schemes FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Insurance providers
CREATE TABLE public.insurance_providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  coverage_percentage NUMERIC(5,2) DEFAULT 0,
  claim_limit NUMERIC(12,2),
  plan_types TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.insurance_providers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read providers" ON public.insurance_providers FOR SELECT USING (true);
CREATE POLICY "Admins can manage providers" ON public.insurance_providers FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Audit logs
CREATE TABLE public.admin_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  details JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can read audit logs" ON public.admin_audit_logs FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert audit logs" ON public.admin_audit_logs FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
