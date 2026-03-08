
CREATE TABLE public.medicines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  generic_name text NOT NULL,
  category text NOT NULL,
  uses text[] NOT NULL DEFAULT '{}',
  side_effects text[] NOT NULL DEFAULT '{}',
  dosage text NOT NULL,
  warnings text[] NOT NULL DEFAULT '{}',
  price_range text NOT NULL,
  prescription_required boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.medicines ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read medicines" ON public.medicines
  FOR SELECT USING (true);

CREATE INDEX idx_medicines_name ON public.medicines USING gin (to_tsvector('english', name));
CREATE INDEX idx_medicines_generic ON public.medicines USING gin (to_tsvector('english', generic_name));
CREATE INDEX idx_medicines_category ON public.medicines(category);
