export interface Profile {
  id: string;
  full_name: string;
  designation: string;
  bio: string;
  resume_url: string | null;
  avatar_url: string | null;
  social_links: {
    github?: string;
    linkedin?: string;
    facebook?: string;
    twitter?: string;
    website?: string;
    email?: string;
    [key: string]: string | undefined;
  };
  updated_at?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  live_url: string | null;
  github_url: string | null;
  tech_stack: string[];
  is_featured: boolean;
  display_order: number;
  created_at: string;
}

export interface Skill {
  id: string;
  category: string;
  name: string;
  proficiency_percent: number;
  icon_name: string;
  created_at: string;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export type SkillCategory = 
  | 'Frontend'
  | 'Backend'
  | 'Database'
  | 'Cloud & DevOps'
  | 'Tools & Methods';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isConfigured: boolean;
}
