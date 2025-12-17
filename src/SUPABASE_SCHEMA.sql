-- ============================================
-- OPENUP - SUPABASE DATABASE SCHEMA
-- ============================================
-- This SQL creates all necessary tables for OpenUp
-- Run this in Supabase SQL Editor to initialize your database
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLE: profiles
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'free' CHECK (role IN ('free', 'pro', 'business', 'admin')),
  language_preference TEXT NOT NULL DEFAULT 'fr',
  onboarding_completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index on email
CREATE INDEX IF NOT EXISTS profiles_email_idx ON profiles(email);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- ============================================
-- TABLE: plans
-- ============================================
CREATE TABLE IF NOT EXISTS plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  price_monthly DECIMAL(10, 2) NOT NULL DEFAULT 0,
  price_yearly DECIMAL(10, 2) NOT NULL DEFAULT 0,
  features JSONB NOT NULL DEFAULT '{}',
  max_links INTEGER NOT NULL DEFAULT 5,
  max_team_members INTEGER NOT NULL DEFAULT 1,
  max_qr_codes INTEGER NOT NULL DEFAULT 5,
  support_priority TEXT NOT NULL DEFAULT 'standard' CHECK (support_priority IN ('standard', 'premium')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS (public read)
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read plans"
  ON plans FOR SELECT
  USING (true);

-- Insert default plans
INSERT INTO plans (name, price_monthly, price_yearly, max_links, max_qr_codes, max_team_members, features) VALUES
  ('Free', 0, 0, 5, 5, 1, '{"custom_domain": false, "analytics_export": false, "password_protection": false}'),
  ('Pro', 9.99, 99.99, 100, 50, 5, '{"custom_domain": true, "analytics_export": true, "password_protection": true, "deep_links": true, "branded_qr": true}'),
  ('Business', 29.99, 299.99, 1000, 500, 20, '{"custom_domain": true, "analytics_export": true, "password_protection": true, "deep_links": true, "branded_qr": true, "api_access": true, "team_collaboration": true, "priority_support": true, "white_label": true}')
ON CONFLICT (name) DO NOTHING;

-- ============================================
-- TABLE: subscriptions
-- ============================================
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  plan_id UUID NOT NULL REFERENCES plans(id),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'trialing', 'past_due', 'canceled')),
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS subscriptions_user_id_idx ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS subscriptions_stripe_customer_id_idx ON subscriptions(stripe_customer_id);

-- Enable RLS
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can read own subscriptions"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own subscriptions"
  ON subscriptions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own subscriptions"
  ON subscriptions FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================
-- TABLE: links
-- ============================================
CREATE TABLE IF NOT EXISTS links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  slug TEXT NOT NULL UNIQUE,
  original_url TEXT NOT NULL,
  title TEXT,
  description TEXT,
  redirect_logic JSONB DEFAULT '{}',
  password_protection TEXT,
  expiration_date TIMESTAMPTZ,
  click_limit INTEGER,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'disabled', 'expired')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS links_user_id_idx ON links(user_id);
CREATE INDEX IF NOT EXISTS links_slug_idx ON links(slug);
CREATE INDEX IF NOT EXISTS links_status_idx ON links(status);

-- Enable RLS
ALTER TABLE links ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can read own links"
  ON links FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create links"
  ON links FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own links"
  ON links FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own links"
  ON links FOR DELETE
  USING (auth.uid() = user_id);

-- Public read for redirects (by slug only)
CREATE POLICY "Anyone can read links by slug"
  ON links FOR SELECT
  USING (true);

-- ============================================
-- TABLE: link_analytics
-- ============================================
CREATE TABLE IF NOT EXISTS link_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  link_id UUID NOT NULL REFERENCES links(id) ON DELETE CASCADE,
  click_timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  device_type TEXT,
  browser TEXT,
  country TEXT,
  ip_address TEXT,
  referer TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS link_analytics_link_id_idx ON link_analytics(link_id);
CREATE INDEX IF NOT EXISTS link_analytics_timestamp_idx ON link_analytics(click_timestamp);

-- Enable RLS
ALTER TABLE link_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can read analytics for own links"
  ON link_analytics FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM links 
      WHERE links.id = link_analytics.link_id 
      AND links.user_id = auth.uid()
    )
  );

-- Anyone can insert analytics (for tracking)
CREATE POLICY "Anyone can insert analytics"
  ON link_analytics FOR INSERT
  WITH CHECK (true);

-- ============================================
-- TABLE: qr_codes
-- ============================================
CREATE TABLE IF NOT EXISTS qr_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  link_id UUID NOT NULL REFERENCES links(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  qr_image_url TEXT NOT NULL,
  design_style JSONB DEFAULT '{}',
  dynamic BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS qr_codes_user_id_idx ON qr_codes(user_id);
CREATE INDEX IF NOT EXISTS qr_codes_link_id_idx ON qr_codes(link_id);

-- Enable RLS
ALTER TABLE qr_codes ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can read own qr codes"
  ON qr_codes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create qr codes"
  ON qr_codes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own qr codes"
  ON qr_codes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own qr codes"
  ON qr_codes FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- TABLE: teams
-- ============================================
CREATE TABLE IF NOT EXISTS teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  team_name TEXT NOT NULL,
  plan_id UUID REFERENCES plans(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS teams_owner_id_idx ON teams(owner_id);

-- Enable RLS
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can read own teams"
  ON teams FOR SELECT
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can create teams"
  ON teams FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update own teams"
  ON teams FOR UPDATE
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete own teams"
  ON teams FOR DELETE
  USING (auth.uid() = owner_id);

-- ============================================
-- TABLE: team_members
-- ============================================
CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('member', 'manager')),
  invitation_status TEXT NOT NULL DEFAULT 'pending' CHECK (invitation_status IN ('pending', 'accepted')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(team_id, user_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS team_members_team_id_idx ON team_members(team_id);
CREATE INDEX IF NOT EXISTS team_members_user_id_idx ON team_members(user_id);

-- Enable RLS
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Team owners can manage members"
  ON team_members FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM teams 
      WHERE teams.id = team_members.team_id 
      AND teams.owner_id = auth.uid()
    )
  );

CREATE POLICY "Members can read team info"
  ON team_members FOR SELECT
  USING (auth.uid() = user_id);

-- ============================================
-- TABLE: billing_history
-- ============================================
CREATE TABLE IF NOT EXISTS billing_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_invoice_id TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'eur',
  status TEXT NOT NULL DEFAULT 'paid' CHECK (status IN ('paid', 'pending', 'refunded')),
  invoice_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS billing_history_user_id_idx ON billing_history(user_id);
CREATE INDEX IF NOT EXISTS billing_history_stripe_invoice_idx ON billing_history(stripe_invoice_id);

-- Enable RLS
ALTER TABLE billing_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can read own billing history"
  ON billing_history FOR SELECT
  USING (auth.uid() = user_id);

-- ============================================
-- TABLE: feature_flags
-- ============================================
CREATE TABLE IF NOT EXISTS feature_flags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  feature_name TEXT NOT NULL UNIQUE,
  availability TEXT NOT NULL DEFAULT 'free' CHECK (availability IN ('free', 'pro', 'business', 'beta')),
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS (public read)
ALTER TABLE feature_flags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read feature flags"
  ON feature_flags FOR SELECT
  USING (true);

-- ============================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to all tables with updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_plans_updated_at BEFORE UPDATE ON plans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_links_updated_at BEFORE UPDATE ON links
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_qr_codes_updated_at BEFORE UPDATE ON qr_codes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON teams
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_team_members_updated_at BEFORE UPDATE ON team_members
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_feature_flags_updated_at BEFORE UPDATE ON feature_flags
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- FUNCTION: Create profile on signup
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, language_preference)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Utilisateur'),
    COALESCE(NEW.raw_user_meta_data->>'language', 'fr')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- COMPLETED!
-- ============================================
-- Your OpenUp database is now ready to use!
-- Next steps:
-- 1. Verify all tables were created successfully
-- 2. Test RLS policies
-- 3. Configure authentication providers in Supabase UI
-- 4. (Optional) Set up Stripe integration
-- ============================================
