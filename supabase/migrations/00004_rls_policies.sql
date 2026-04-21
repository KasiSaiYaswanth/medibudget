-- 00004_rls_policies.sql

-- Enable RLS on all tables
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hospitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medicines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.government_schemes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.insurance_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cost_estimation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.symptom_searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chatbot_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activity_logs ENABLE ROW LEVEL SECURITY;

--------------------------------------------------------------------------------
-- REFERENCE DATA (Read-only for all authenticated users, writable by admins)
--------------------------------------------------------------------------------

-- Hospitals
CREATE POLICY "Anyone can view hospitals" ON public.hospitals FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage hospitals" ON public.hospitals FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Medicines
CREATE POLICY "Anyone can view medicines" ON public.medicines FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage medicines" ON public.medicines FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Government Schemes
CREATE POLICY "Anyone can view active government schemes" ON public.government_schemes FOR SELECT TO authenticated USING (is_active = true);
CREATE POLICY "Admins can manage government schemes" ON public.government_schemes FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Insurance Providers
CREATE POLICY "Anyone can view active insurance providers" ON public.insurance_providers FOR SELECT TO authenticated USING (is_active = true);
CREATE POLICY "Admins can manage insurance providers" ON public.insurance_providers FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--------------------------------------------------------------------------------
-- USER DATA (Read/Write strictly restricted to the owner, readable by admins)
--------------------------------------------------------------------------------

-- Cost Estimation Logs
CREATE POLICY "Users can manage their own cost estimations" ON public.cost_estimation_logs FOR ALL TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all cost estimations" ON public.cost_estimation_logs FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Symptom Searches
CREATE POLICY "Users can manage their own symptom searches" ON public.symptom_searches FOR ALL TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all symptom searches" ON public.symptom_searches FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Chatbot Conversations
CREATE POLICY "Users can manage their own conversations" ON public.chatbot_conversations FOR ALL TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all conversations" ON public.chatbot_conversations FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Notifications
CREATE POLICY "Users can view and update their own notifications" ON public.notifications FOR ALL TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all notifications" ON public.notifications FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Emergency Logs
CREATE POLICY "Users can manage their own emergency logs" ON public.emergency_logs FOR ALL TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all emergency logs" ON public.emergency_logs FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- User Activity Logs
CREATE POLICY "Users can insert their own activity logs" ON public.user_activity_logs FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all activity logs" ON public.user_activity_logs FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));

--------------------------------------------------------------------------------
-- SYSTEM/ADMIN DATA (Restricted)
--------------------------------------------------------------------------------

-- User Roles
CREATE POLICY "Users can view their own role" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage user roles" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Admin Audit Logs
CREATE POLICY "Admins can manage audit logs" ON public.admin_audit_logs FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));
