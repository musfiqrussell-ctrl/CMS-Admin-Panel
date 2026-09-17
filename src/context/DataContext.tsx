import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Profile, Project, Skill, Message } from '../types';
import { INITIAL_PROFILE, INITIAL_PROJECTS, INITIAL_SKILLS, INITIAL_MESSAGES } from '../data/mockData';
import { supabase, getSupabaseConfig } from '../lib/supabaseClient';
import { useToast } from './ToastContext';

interface DataContextType {
  profile: Profile;
  projects: Project[];
  skills: Skill[];
  messages: Message[];
  loading: boolean;
  isLiveSupabase: boolean;
  refreshAllData: () => Promise<void>;
  
  // Profile CRUD
  updateProfile: (updated: Partial<Profile>) => Promise<boolean>;
  uploadAsset: (file: File, folder: 'avatars' | 'resumes' | 'projects') => Promise<string | null>;

  // Projects CRUD
  createProject: (project: Omit<Project, 'id' | 'created_at'>) => Promise<boolean>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<boolean>;
  deleteProject: (id: string) => Promise<boolean>;
  reorderProjects: (orderedIds: string[]) => Promise<boolean>;

  // Skills CRUD
  createSkill: (skill: Omit<Skill, 'id' | 'created_at'>) => Promise<boolean>;
  updateSkill: (id: string, updates: Partial<Skill>) => Promise<boolean>;
  deleteSkill: (id: string) => Promise<boolean>;

  // Messages CRUD
  toggleMessageRead: (id: string, is_read: boolean) => Promise<boolean>;
  deleteMessage: (id: string) => Promise<boolean>;
  sendSimulatedMessage: (message: Omit<Message, 'id' | 'created_at' | 'is_read'>) => Promise<boolean>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { showToast } = useToast();
  const [profile, setProfile] = useState<Profile>(() => {
    const saved = localStorage.getItem('portfolio_local_profile');
    return saved ? JSON.parse(saved) : INITIAL_PROFILE;
  });
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('portfolio_local_projects');
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });
  const [skills, setSkills] = useState<Skill[]>(() => {
    const saved = localStorage.getItem('portfolio_local_skills');
    return saved ? JSON.parse(saved) : INITIAL_SKILLS;
  });
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('portfolio_local_messages');
    return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
  });

  const [loading, setLoading] = useState(false);
  const [isLiveSupabase, setIsLiveSupabase] = useState(false);

  // Sync to local backup whenever state changes
  useEffect(() => {
    localStorage.setItem('portfolio_local_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('portfolio_local_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('portfolio_local_skills', JSON.stringify(skills));
  }, [skills]);

  useEffect(() => {
    localStorage.setItem('portfolio_local_messages', JSON.stringify(messages));
  }, [messages]);

  // Fetch from live Supabase if credentials exist
  const fetchSupabaseData = useCallback(async () => {
    const config = getSupabaseConfig();
    if (!config.isConfigured) {
      setIsLiveSupabase(false);
      return;
    }

    setLoading(true);
    try {
      // 1. Projects
      const { data: projData, error: projError } = await supabase
        .from('projects')
        .select('*')
        .order('display_order', { ascending: true });

      if (!projError && projData && projData.length > 0) {
        setProjects(projData);
        setIsLiveSupabase(true);
      }

      // 2. Profile
      const { data: profData, error: profError } = await supabase
        .from('profiles')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (!profError && profData) {
        setProfile(profData);
      }

      // 3. Skills
      const { data: skillData, error: skillError } = await supabase
        .from('skills')
        .select('*')
        .order('proficiency_percent', { ascending: false });

      if (!skillError && skillData && skillData.length > 0) {
        setSkills(skillData);
      }

      // 4. Messages
      const { data: msgData, error: msgError } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (!msgError && msgData) {
        setMessages(msgData);
      }

      setIsLiveSupabase(true);
    } catch (err) {
      console.warn('Live Supabase query fallback:', err);
      setIsLiveSupabase(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSupabaseData();
  }, [fetchSupabaseData]);

  // Upload Asset (Avatar, Resume, Project Screenshot)
  const uploadAsset = async (file: File, folder: 'avatars' | 'resumes' | 'projects'): Promise<string | null> => {
    const config = getSupabaseConfig();
    const cleanFileName = `${folder}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

    if (config.isConfigured) {
      try {
        const { error } = await supabase.storage
          .from('portfolio-assets')
          .upload(cleanFileName, file, { upsert: true });

        if (error) {
          throw error;
        }

        const { data: publicUrlData } = supabase.storage
          .from('portfolio-assets')
          .getPublicUrl(cleanFileName);

        showToast(`Uploaded ${file.name} to portfolio-assets/${folder}`, 'success');
        return publicUrlData.publicUrl;
      } catch (err: any) {
        console.error('Storage upload failed, falling back to local object URL:', err);
        showToast(err.message || 'Supabase upload failed, generated local preview URL', 'info');
      }
    }

    // Fallback preview URL using object URL/FileReader
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        showToast(`Saved asset preview for ${file.name}`, 'success');
        resolve(result);
      };
      reader.onerror = () => {
        showToast('Error reading local file', 'error');
        resolve(null);
      };
      reader.readAsDataURL(file);
    });
  };

  // Update Profile
  const updateProfile = async (updated: Partial<Profile>): Promise<boolean> => {
    const merged: Profile = {
      ...profile,
      ...updated,
      updated_at: new Date().toISOString(),
    };

    setProfile(merged);

    const config = getSupabaseConfig();
    if (config.isConfigured) {
      try {
        const { error } = await supabase
          .from('profiles')
          .upsert(merged, { onConflict: 'id' });

        if (error) throw error;
        showToast('Profile updated in Supabase!', 'success');
        return true;
      } catch (err: any) {
        showToast(err.message || 'Error updating profile in Supabase', 'error');
        return false;
      }
    } else {
      showToast('Profile updated (Local session)', 'success');
      return true;
    }
  };

  // Create Project
  const createProject = async (newProj: Omit<Project, 'id' | 'created_at'>): Promise<boolean> => {
    const id = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `p-${Date.now()}`;
    const projectItem: Project = {
      ...newProj,
      id,
      created_at: new Date().toISOString(),
    };

    const config = getSupabaseConfig();
    if (config.isConfigured) {
      try {
        const { error, data } = await supabase
          .from('projects')
          .insert([projectItem])
          .select()
          .single();

        if (error) throw error;
        setProjects((prev) => [data || projectItem, ...prev]);
        showToast('Project created in Supabase!', 'success');
        return true;
      } catch (err: any) {
        showToast(err.message || 'Failed to create project in Supabase', 'error');
        return false;
      }
    } else {
      setProjects((prev) => [projectItem, ...prev]);
      showToast('Project added successfully!', 'success');
      return true;
    }
  };

  // Update Project
  const updateProject = async (id: string, updates: Partial<Project>): Promise<boolean> => {
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));

    const config = getSupabaseConfig();
    if (config.isConfigured) {
      try {
        const { error } = await supabase
          .from('projects')
          .update(updates)
          .eq('id', id);

        if (error) throw error;
        showToast('Project updated in Supabase!', 'success');
        return true;
      } catch (err: any) {
        showToast(err.message || 'Failed to update project in Supabase', 'error');
        return false;
      }
    } else {
      showToast('Project updated successfully', 'success');
      return true;
    }
  };

  // Delete Project
  const deleteProject = async (id: string): Promise<boolean> => {
    setProjects((prev) => prev.filter((p) => p.id !== id));

    const config = getSupabaseConfig();
    if (config.isConfigured) {
      try {
        const { error } = await supabase
          .from('projects')
          .delete()
          .eq('id', id);

        if (error) throw error;
        showToast('Project deleted from Supabase', 'info');
        return true;
      } catch (err: any) {
        showToast(err.message || 'Failed to delete project from Supabase', 'error');
        return false;
      }
    } else {
      showToast('Project removed', 'info');
      return true;
    }
  };

  // Reorder Projects
  const reorderProjects = async (orderedIds: string[]): Promise<boolean> => {
    const remapped = [...projects].sort((a, b) => {
      const idxA = orderedIds.indexOf(a.id);
      const idxB = orderedIds.indexOf(b.id);
      return (idxA === -1 ? 999 : idxA) - (idxB === -1 ? 999 : idxB);
    }).map((p, idx) => ({ ...p, display_order: idx + 1 }));

    setProjects(remapped);

    const config = getSupabaseConfig();
    if (config.isConfigured) {
      try {
        const updates = remapped.map((p) => 
          supabase.from('projects').update({ display_order: p.display_order }).eq('id', p.id)
        );
        await Promise.all(updates);
        showToast('Display order saved to Supabase', 'success');
        return true;
      } catch (err) {
        console.error('Reorder update failed:', err);
      }
    }
    showToast('Display order updated', 'success');
    return true;
  };

  // Skills CRUD
  const createSkill = async (newSkill: Omit<Skill, 'id' | 'created_at'>): Promise<boolean> => {
    const id = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `s-${Date.now()}`;
    const skillItem: Skill = {
      ...newSkill,
      id,
      created_at: new Date().toISOString(),
    };

    const config = getSupabaseConfig();
    if (config.isConfigured) {
      try {
        const { error, data } = await supabase
          .from('skills')
          .insert([skillItem])
          .select()
          .single();

        if (error) throw error;
        setSkills((prev) => [...prev, data || skillItem]);
        showToast('Skill added to Supabase', 'success');
        return true;
      } catch (err: any) {
        showToast(err.message || 'Failed to create skill', 'error');
        return false;
      }
    } else {
      setSkills((prev) => [...prev, skillItem]);
      showToast('Skill added successfully', 'success');
      return true;
    }
  };

  const updateSkill = async (id: string, updates: Partial<Skill>): Promise<boolean> => {
    setSkills((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));

    const config = getSupabaseConfig();
    if (config.isConfigured) {
      try {
        const { error } = await supabase
          .from('skills')
          .update(updates)
          .eq('id', id);

        if (error) throw error;
        showToast('Skill updated in Supabase', 'success');
        return true;
      } catch (err: any) {
        showToast(err.message || 'Failed to update skill', 'error');
        return false;
      }
    } else {
      showToast('Skill updated', 'success');
      return true;
    }
  };

  const deleteSkill = async (id: string): Promise<boolean> => {
    setSkills((prev) => prev.filter((s) => s.id !== id));

    const config = getSupabaseConfig();
    if (config.isConfigured) {
      try {
        const { error } = await supabase
          .from('skills')
          .delete()
          .eq('id', id);

        if (error) throw error;
        showToast('Skill deleted from Supabase', 'info');
        return true;
      } catch (err: any) {
        showToast(err.message || 'Failed to delete skill', 'error');
        return false;
      }
    } else {
      showToast('Skill removed', 'info');
      return true;
    }
  };

  // Messages CRUD
  const toggleMessageRead = async (id: string, is_read: boolean): Promise<boolean> => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, is_read } : m)));

    const config = getSupabaseConfig();
    if (config.isConfigured) {
      try {
        const { error } = await supabase
          .from('messages')
          .update({ is_read })
          .eq('id', id);

        if (error) throw error;
        showToast(is_read ? 'Marked as read' : 'Marked as unread', 'info');
        return true;
      } catch (err: any) {
        showToast(err.message || 'Failed to update message status', 'error');
        return false;
      }
    } else {
      showToast(is_read ? 'Marked as read' : 'Marked as unread', 'info');
      return true;
    }
  };

  const deleteMessage = async (id: string): Promise<boolean> => {
    setMessages((prev) => prev.filter((m) => m.id !== id));

    const config = getSupabaseConfig();
    if (config.isConfigured) {
      try {
        const { error } = await supabase
          .from('messages')
          .delete()
          .eq('id', id);

        if (error) throw error;
        showToast('Message deleted', 'info');
        return true;
      } catch (err: any) {
        showToast(err.message || 'Failed to delete message', 'error');
        return false;
      }
    } else {
      showToast('Message removed', 'info');
      return true;
    }
  };

  const sendSimulatedMessage = async (newMsg: Omit<Message, 'id' | 'created_at' | 'is_read'>): Promise<boolean> => {
    const id = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `m-${Date.now()}`;
    const item: Message = {
      ...newMsg,
      id,
      is_read: false,
      created_at: new Date().toISOString(),
    };

    const config = getSupabaseConfig();
    if (config.isConfigured) {
      try {
        const { error } = await supabase
          .from('messages')
          .insert([item]);

        if (error) throw error;
        setMessages((prev) => [item, ...prev]);
        showToast('Test contact inquiry submitted via Supabase!', 'success');
        return true;
      } catch (err: any) {
        showToast(err.message || 'Failed to insert message into Supabase', 'error');
        return false;
      }
    } else {
      setMessages((prev) => [item, ...prev]);
      showToast('Simulated contact message submitted to inbox!', 'success');
      return true;
    }
  };

  return (
    <DataContext.Provider
      value={{
        profile,
        projects,
        skills,
        messages,
        loading,
        isLiveSupabase,
        refreshAllData: fetchSupabaseData,
        updateProfile,
        uploadAsset,
        createProject,
        updateProject,
        deleteProject,
        reorderProjects,
        createSkill,
        updateSkill,
        deleteSkill,
        toggleMessageRead,
        deleteMessage,
        sendSimulatedMessage,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
