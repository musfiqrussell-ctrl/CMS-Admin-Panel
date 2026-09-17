export const SUPABASE_SQL_MIGRATION = `-- ==============================================================================
-- SUPABASE MIGRATION SCRIPT FOR PORTFOLIO CMS (musfiqrussell.netlify.app)
-- Run this script directly in your Supabase Project: SQL Editor -> New Query -> Run
-- ==============================================================================

-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 2. TABLE DEFINITIONS
-- ==============================================================================

-- A. PROFILES TABLE (Linked to Supabase Auth User)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT 'Musfiq Russell',
  designation TEXT DEFAULT 'Senior Full-Stack Software Engineer',
  bio TEXT DEFAULT 'Building scalable web applications, distributed systems, and modern interactive user experiences.',
  resume_url TEXT,
  avatar_url TEXT,
  social_links JSONB DEFAULT '{
    "github": "https://github.com/musfiq",
    "linkedin": "https://linkedin.com/in/musfiqrussell",
    "facebook": "https://facebook.com/musfiq.russell",
    "twitter": "https://twitter.com/musfiqrussell",
    "website": "https://musfiqrussell.netlify.app",
    "email": "musfiqrussell@gmail.com"
  }'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- B. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  live_url TEXT,
  github_url TEXT,
  tech_stack JSONB DEFAULT '[]'::jsonb,
  is_featured BOOLEAN DEFAULT false,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- C. SKILLS TABLE
CREATE TABLE IF NOT EXISTS public.skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category TEXT NOT NULL,
  name TEXT NOT NULL,
  proficiency_percent INT CHECK (proficiency_percent >= 0 AND proficiency_percent <= 100) DEFAULT 80,
  icon_name TEXT DEFAULT 'Code',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- D. MESSAGES TABLE (Contact Form Inquiries)
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable indexes for performance
CREATE INDEX IF NOT EXISTS idx_projects_featured ON public.projects(is_featured, display_order);
CREATE INDEX IF NOT EXISTS idx_skills_category ON public.skills(category);
CREATE INDEX IF NOT EXISTS idx_messages_created ON public.messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_is_read ON public.messages(is_read);

-- ==============================================================================
-- 3. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- PROFILES POLICIES
-- ------------------------------------------------------------------------------
-- Anyone (public visitors) can read profile data to view your portfolio
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone"
ON public.profiles FOR SELECT
USING (true);

-- Only authenticated users (admins) can insert/update their profile
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

-- ------------------------------------------------------------------------------
-- PROJECTS POLICIES
-- ------------------------------------------------------------------------------
-- Public read access for portfolio visitors
DROP POLICY IF EXISTS "Projects are viewable by everyone" ON public.projects;
CREATE POLICY "Projects are viewable by everyone"
ON public.projects FOR SELECT
USING (true);

-- Authenticated admins can create, update, delete projects
DROP POLICY IF EXISTS "Authenticated users can insert projects" ON public.projects;
CREATE POLICY "Authenticated users can insert projects"
ON public.projects FOR INSERT
TO authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can update projects" ON public.projects;
CREATE POLICY "Authenticated users can update projects"
ON public.projects FOR UPDATE
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Authenticated users can delete projects" ON public.projects;
CREATE POLICY "Authenticated users can delete projects"
ON public.projects FOR DELETE
TO authenticated
USING (true);

-- ------------------------------------------------------------------------------
-- SKILLS POLICIES
-- ------------------------------------------------------------------------------
-- Public read access for portfolio visitors
DROP POLICY IF EXISTS "Skills are viewable by everyone" ON public.skills;
CREATE POLICY "Skills are viewable by everyone"
ON public.skills FOR SELECT
USING (true);

-- Authenticated admins can create, update, delete skills
DROP POLICY IF EXISTS "Authenticated users can insert skills" ON public.skills;
CREATE POLICY "Authenticated users can insert skills"
ON public.skills FOR INSERT
TO authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can update skills" ON public.skills;
CREATE POLICY "Authenticated users can update skills"
ON public.skills FOR UPDATE
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Authenticated users can delete skills" ON public.skills;
CREATE POLICY "Authenticated users can delete skills"
ON public.skills FOR DELETE
TO authenticated
USING (true);

-- ------------------------------------------------------------------------------
-- MESSAGES POLICIES
-- ------------------------------------------------------------------------------
-- Anyone can insert messages (portfolio contact form submission)
DROP POLICY IF EXISTS "Public can submit contact messages" ON public.messages;
CREATE POLICY "Public can submit contact messages"
ON public.messages FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Only authenticated admins can read, update, or delete messages
DROP POLICY IF EXISTS "Admins can view messages" ON public.messages;
CREATE POLICY "Admins can view messages"
ON public.messages FOR SELECT
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Admins can update messages" ON public.messages;
CREATE POLICY "Admins can update messages"
ON public.messages FOR UPDATE
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Admins can delete messages" ON public.messages;
CREATE POLICY "Admins can delete messages"
ON public.messages FOR DELETE
TO authenticated
USING (true);

-- ==============================================================================
-- 4. STORAGE BUCKET CONFIGURATION (portfolio-assets)
-- ==============================================================================

-- Create public storage bucket if not exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-assets', 'portfolio-assets', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage Policy: Public can view objects
DROP POLICY IF EXISTS "Public can view portfolio assets" ON storage.objects;
CREATE POLICY "Public can view portfolio assets"
ON storage.objects FOR SELECT
USING (bucket_id = 'portfolio-assets');

-- Storage Policy: Authenticated users can upload assets
DROP POLICY IF EXISTS "Authenticated users can upload portfolio assets" ON storage.objects;
CREATE POLICY "Authenticated users can upload portfolio assets"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'portfolio-assets');

-- Storage Policy: Authenticated users can update/replace assets
DROP POLICY IF EXISTS "Authenticated users can update portfolio assets" ON storage.objects;
CREATE POLICY "Authenticated users can update portfolio assets"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'portfolio-assets');

-- Storage Policy: Authenticated users can delete assets
DROP POLICY IF EXISTS "Authenticated users can delete portfolio assets" ON storage.objects;
CREATE POLICY "Authenticated users can delete portfolio assets"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'portfolio-assets');

-- ==============================================================================
-- 5. INITIAL SEED DATA (Musfiq Russell Portfolio)
-- ==============================================================================

INSERT INTO public.projects (title, description, image_url, live_url, github_url, tech_stack, is_featured, display_order)
VALUES 
(
  'Enterprise Cloud Analytics Engine',
  'High-throughput analytics platform processing real-time telemetry events with sub-second response times and automated alerting.',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
  'https://musfiqrussell.netlify.app',
  'https://github.com/musfiq/cloud-analytics',
  '["React", "TypeScript", "Node.js", "PostgreSQL", "TailwindCSS"]'::jsonb,
  true,
  1
),
(
  'AI Document Synthesis Suite',
  'Multi-modal document intelligence dashboard leveraging LLMs for parsing, semantic querying, and automated summaries.',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
  'https://musfiqrussell.netlify.app',
  'https://github.com/musfiq/ai-doc-suite',
  '["Next.js", "Python", "FastAPI", "Supabase", "OpenAI"]'::jsonb,
  true,
  2
),
(
  'Microservices Orchestration Gateway',
  'Distributed API gateway with token-bucket rate limiting, circuit breaking, and dynamic gRPC service discovery.',
  'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
  'https://musfiqrussell.netlify.app',
  'https://github.com/musfiq/microservices-gateway',
  '["Go", "Docker", "Kubernetes", "Redis", "Prometheus"]'::jsonb,
  false,
  3
);

INSERT INTO public.skills (category, name, proficiency_percent, icon_name)
VALUES
  ('Frontend', 'React & Next.js', 95, 'Code'),
  ('Frontend', 'TypeScript / JavaScript', 95, 'Layers'),
  ('Frontend', 'Tailwind CSS & Modern UI', 90, 'Palette'),
  ('Backend', 'Node.js & Express / NestJS', 92, 'Server'),
  ('Backend', 'Python & FastAPI', 88, 'Cpu'),
  ('Backend', 'REST & GraphQL APIs', 90, 'Network'),
  ('Database', 'PostgreSQL & Supabase', 92, 'Database'),
  ('Database', 'Redis & Caching', 85, 'Zap'),
  ('Cloud & DevOps', 'Docker & Containers', 88, 'Box'),
  ('Cloud & DevOps', 'AWS & Cloud Deployment', 82, 'Cloud'),
  ('Tools & Methods', 'Git & CI/CD Pipelines', 90, 'GitBranch'),
  ('Tools & Methods', 'System Architecture & Security', 87, 'Shield');

INSERT INTO public.messages (name, email, subject, message, is_read)
VALUES
(
  'Alex Morgan',
  'alex.morgan@techventures.io',
  'Collaboration Opportunity: Senior Tech Lead',
  'Hi Musfiq, we came across your portfolio and were really impressed by your full-stack engineering background. Would love to set up a 20-min call to discuss leading our new product initiative.',
  false
),
(
  'Sarah Jenkins',
  'sarah.j@innovatelabs.com',
  'Consulting for Distributed Systems',
  'Hello Russell! We are looking for an architect to review our Supabase + microservices scaling strategy. Are you available for contract engagements this quarter?',
  true
);
`;

export const FRONTEND_INTEGRATION_SNIPPET = `// ==============================================================================
// Connecting musfiqrussell.netlify.app to this Supabase Backend
// ==============================================================================

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 1. Fetch Profile Info
export async function getProfile() {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .limit(1)
    .single();
  return { data, error };
}

// 2. Fetch Projects (ordered)
export async function getProjects() {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: false });
  return { data, error };
}

// 3. Fetch Skills grouped or sorted
export async function getSkills() {
  const { data, error } = await supabase
    .from('skills')
    .select('*')
    .order('proficiency_percent', { ascending: false });
  return { data, error };
}

// 4. Submit Contact Form Message from Portfolio
export async function submitContactMessage(formData: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  const { data, error } = await supabase
    .from('messages')
    .insert([
      {
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        is_read: false,
      }
    ]);
  return { data, error };
}
`;
