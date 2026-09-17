import React, { useState } from 'react';
import { 
  Plus, Search, Edit2, Trash2, ExternalLink, Github, Star, 
  ArrowUp, ArrowDown, Image as ImageIcon, Upload, X, Check, LayoutGrid, List, AlertCircle 
} from 'lucide-react';
import { Project } from '../../types';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';

export function ProjectsManager() {
  const { projects, createProject, updateProject, deleteProject, reorderProjects, uploadAsset } = useData();
  const { showToast } = useToast();

  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('All');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [techStack, setTechStack] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [displayOrder, setDisplayOrder] = useState(1);
  const [isUploading, setIsUploading] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Common quick-add tech tags
  const popularTags = ['React', 'Next.js', 'TypeScript', 'Node.js', 'PostgreSQL', 'TailwindCSS', 'Supabase', 'Python', 'FastAPI', 'Docker', 'AWS', 'Redis'];

  // All existing unique tags
  const allUniqueTags = Array.from(new Set(projects.flatMap((p) => p.tech_stack || [])));

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = 
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.tech_stack.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesTag = selectedTag === 'All' || project.tech_stack.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const openAddModal = () => {
    setEditingProject(null);
    setTitle('');
    setDescription('');
    setImageUrl('https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80');
    setLiveUrl('https://musfiqrussell.netlify.app');
    setGithubUrl('https://github.com/musfiq/');
    setTechStack(['React', 'TypeScript', 'TailwindCSS']);
    setIsFeatured(false);
    setDisplayOrder(projects.length + 1);
    setIsModalOpen(true);
  };

  const openEditModal = (project: Project) => {
    setEditingProject(project);
    setTitle(project.title);
    setDescription(project.description);
    setImageUrl(project.image_url || '');
    setLiveUrl(project.live_url || '');
    setGithubUrl(project.github_url || '');
    setTechStack(project.tech_stack || []);
    setIsFeatured(project.is_featured);
    setDisplayOrder(project.display_order);
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please upload an image file (PNG, JPG, WebP)', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast('File size must be under 5MB', 'error');
      return;
    }

    setIsUploading(true);
    const uploadedUrl = await uploadAsset(file, 'projects');
    setIsUploading(false);

    if (uploadedUrl) {
      setImageUrl(uploadedUrl);
    }
  };

  const handleAddTag = (tag: string) => {
    const trimmed = tag.trim();
    if (trimmed && !techStack.includes(trimmed)) {
      setTechStack([...techStack, trimmed]);
      setNewTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTechStack(techStack.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('Project title is required', 'error');
      return;
    }

    if (editingProject) {
      await updateProject(editingProject.id, {
        title,
        description,
        image_url: imageUrl || null,
        live_url: liveUrl || null,
        github_url: githubUrl || null,
        tech_stack: techStack,
        is_featured: isFeatured,
        display_order: Number(displayOrder),
      });
    } else {
      await createProject({
        title,
        description,
        image_url: imageUrl || null,
        live_url: liveUrl || null,
        github_url: githubUrl || null,
        tech_stack: techStack,
        is_featured: isFeatured,
        display_order: Number(displayOrder),
      });
    }

    setIsModalOpen(false);
  };

  const handleMoveOrder = async (index: number, direction: 'up' | 'down') => {
    const newIdx = direction === 'up' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= projects.length) return;

    const newOrder = [...projects];
    const [moved] = newOrder.splice(index, 1);
    newOrder.splice(newIdx, 0, moved);

    await reorderProjects(newOrder.map((p) => p.id));
  };

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Portfolio Projects</h2>
          <p className="text-xs text-slate-400 mt-1">
            Manage showcase works displayed on <span className="text-[#E11D48] font-medium">musfiqrussell.netlify.app</span> ({projects.length} total)
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex bg-[#16181D] border border-[#262A33] rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded text-xs transition-colors ${viewMode === 'grid' ? 'bg-[#1F222A] text-[#E11D48]' : 'text-slate-400 hover:text-slate-200'}`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded text-xs transition-colors ${viewMode === 'table' ? 'bg-[#1F222A] text-[#E11D48]' : 'text-slate-400 hover:text-slate-200'}`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={openAddModal}
            className="px-4 py-2 bg-[#E11D48] hover:bg-[#BE123C] text-white font-semibold text-xs rounded-lg transition-all flex items-center gap-2 shadow-lg shadow-rose-900/30"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Project</span>
          </button>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-[#16181D] border border-[#262A33] p-4 rounded-xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 shadow-md">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects by title, tech stack, or description..."
            className="w-full pl-10 pr-4 py-2 bg-[#0F1115] border border-[#2A2E39] rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#E11D48] transition-colors"
          />
        </div>

        {/* Tech stack filter chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedTag('All')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              selectedTag === 'All'
                ? 'bg-[#E11D48] text-white font-semibold shadow-md shadow-rose-900/20'
                : 'bg-[#1F222A] text-slate-300 hover:bg-[#262A33]'
            }`}
          >
            All
          </button>
          {allUniqueTags.slice(0, 6).map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedTag === tag
                  ? 'bg-[#E11D48] text-white font-semibold shadow-md shadow-rose-900/20'
                  : 'bg-[#1F222A] text-slate-300 hover:bg-[#262A33]'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProjects.map((project, index) => (
            <div
              key={project.id}
              className="bg-[#16181D] border border-[#262A33] rounded-xl overflow-hidden hover:border-[#E11D48]/40 transition-all flex flex-col group shadow-lg"
            >
              {/* Thumbnail */}
              <div className="relative h-44 bg-[#0F1115] overflow-hidden">
                {project.image_url ? (
                  <img
                    src={project.image_url}
                    alt={project.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-600">
                    <ImageIcon className="w-10 h-10" />
                  </div>
                )}

                {/* Badges */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="px-2 py-0.5 bg-black/80 backdrop-blur-xs text-slate-300 text-[11px] font-mono rounded border border-zinc-800">
                    #{project.display_order}
                  </span>
                  {project.is_featured && (
                    <span className="px-2 py-0.5 bg-amber-500 text-slate-950 text-[11px] font-bold rounded flex items-center gap-1 shadow">
                      <Star className="w-3 h-3 fill-slate-950" /> Featured
                    </span>
                  )}
                </div>

                {/* Quick actions top-right */}
                <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-black/85 backdrop-blur-xs rounded-lg p-1 border border-zinc-800">
                  <button
                    onClick={() => handleMoveOrder(index, 'up')}
                    disabled={index === 0}
                    className="p-1 text-slate-400 hover:text-white disabled:opacity-30"
                    title="Move Up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleMoveOrder(index, 'down')}
                    disabled={index === projects.length - 1}
                    className="p-1 text-slate-400 hover:text-white disabled:opacity-30"
                    title="Move Down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => openEditModal(project)}
                    className="p-1 text-slate-400 hover:text-[#E11D48]"
                    title="Edit"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(project.id)}
                    className="p-1 text-slate-400 hover:text-rose-400"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-bold text-white text-base leading-snug group-hover:text-[#E11D48] transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                <div>
                  {/* Tech stack badges */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.tech_stack?.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 bg-[#1F222A] text-slate-300 text-[11px] font-medium rounded border border-[#2E333F]"
                      >
                        {tech}
                      </span>
                    ))}
                    {(project.tech_stack?.length || 0) > 4 && (
                      <span className="px-1.5 py-0.5 text-slate-500 text-[11px]">
                        +{project.tech_stack.length - 4}
                      </span>
                    )}
                  </div>

                  {/* Links and Footer buttons */}
                  <div className="flex items-center justify-between pt-3 border-t border-[#262A33] text-xs">
                    <div className="flex items-center gap-3">
                      {project.live_url && (
                        <a
                          href={project.live_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-slate-400 hover:text-[#E11D48] flex items-center gap-1 transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" /> Live
                        </a>
                      )}
                      {project.github_url && (
                        <a
                          href={project.github_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                        >
                          <Github className="w-3.5 h-3.5" /> Code
                        </a>
                      )}
                    </div>

                    <button
                      onClick={() => openEditModal(project)}
                      className="text-xs text-[#E11D48] hover:underline font-medium"
                    >
                      Edit details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="bg-[#16181D] border border-[#262A33] rounded-xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#0F1115] text-slate-400 uppercase tracking-wider font-semibold border-b border-[#262A33]">
                <tr>
                  <th className="py-3.5 px-4 w-16">Order</th>
                  <th className="py-3.5 px-4">Project</th>
                  <th className="py-3.5 px-4">Tech Stack</th>
                  <th className="py-3.5 px-4">Featured</th>
                  <th className="py-3.5 px-4">Links</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#262A33]">
                {filteredProjects.map((project, idx) => (
                  <tr key={project.id} className="hover:bg-[#1F222A]/50 transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-400">
                      #{project.display_order}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={project.image_url || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=100'}
                          alt={project.title}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded-lg object-cover bg-[#0F1115] shrink-0"
                        />
                        <div>
                          <div className="font-semibold text-white">{project.title}</div>
                          <div className="text-[11px] text-slate-400 truncate max-w-xs">{project.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {project.tech_stack?.slice(0, 3).map((t) => (
                          <span key={t} className="px-1.5 py-0.5 bg-[#1F222A] text-slate-300 rounded text-[10px]">
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {project.is_featured ? (
                        <span className="inline-flex items-center gap-1 text-amber-400 font-medium">
                          <Star className="w-3.5 h-3.5 fill-amber-400" /> Yes
                        </span>
                      ) : (
                        <span className="text-slate-500">No</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {project.live_url && (
                          <a href={project.live_url} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-[#E11D48]">
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {project.github_url && (
                          <a href={project.github_url} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white">
                            <Github className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => handleMoveOrder(idx, 'up')}
                          disabled={idx === 0}
                          className="p-1 text-slate-400 hover:text-white disabled:opacity-20"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleMoveOrder(idx, 'down')}
                          disabled={idx === projects.length - 1}
                          className="p-1 text-slate-400 hover:text-white disabled:opacity-20"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => openEditModal(project)}
                          className="p-1 text-slate-400 hover:text-[#E11D48]"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(project.id)}
                          className="p-1 text-slate-400 hover:text-rose-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs overflow-y-auto">
          <div className="bg-[#16181D] border border-[#262A33] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 my-8">
            <div className="flex items-center justify-between p-6 border-b border-[#262A33]">
              <h3 className="text-lg font-bold text-white">
                {editingProject ? 'Edit Portfolio Project' : 'Create New Project'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Next-Gen Cloud Orchestration Engine"
                  className="w-full px-3.5 py-2 bg-[#0F1115] border border-[#2A2E39] rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#E11D48]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Description *
                </label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Comprehensive explanation of problem solved, architecture, and impact..."
                  className="w-full px-3.5 py-2 bg-[#0F1115] border border-[#2A2E39] rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#E11D48] leading-relaxed"
                />
              </div>

              {/* Image & Supabase Storage upload */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Project Thumbnail (Supabase Storage: portfolio-assets)
                </label>
                
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <div className="w-24 h-16 bg-[#0F1115] rounded-lg border border-[#262A33] overflow-hidden flex items-center justify-center shrink-0">
                    {imageUrl ? (
                      <img src={imageUrl} alt="Thumbnail preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-slate-600" />
                    )}
                  </div>

                  <div className="flex-1 space-y-2 w-full">
                    <label className="cursor-pointer inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#1F222A] hover:bg-[#262A33] text-slate-200 border border-[#2E333F] rounded-lg text-xs font-medium transition-colors">
                      <Upload className="w-3.5 h-3.5 text-[#E11D48]" />
                      <span>{isUploading ? 'Uploading to Supabase...' : 'Upload Image Asset'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        disabled={isUploading}
                        className="hidden"
                      />
                    </label>

                    <input
                      type="url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="Or provide direct public Image URL (https://...)"
                      className="w-full px-3 py-1.5 bg-[#0F1115] border border-[#262A33] rounded-lg text-xs text-slate-300 placeholder-slate-600 focus:outline-none focus:border-[#E11D48]"
                    />
                  </div>
                </div>
              </div>

              {/* URLs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Live Demo / Project URL
                  </label>
                  <input
                    type="url"
                    value={liveUrl}
                    onChange={(e) => setLiveUrl(e.target.value)}
                    placeholder="https://musfiqrussell.netlify.app"
                    className="w-full px-3.5 py-2 bg-[#0F1115] border border-[#2A2E39] rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#E11D48]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    GitHub Repository URL
                  </label>
                  <input
                    type="url"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/musfiq/..."
                    className="w-full px-3.5 py-2 bg-[#0F1115] border border-[#2A2E39] rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#E11D48]"
                  />
                </div>
              </div>

              {/* Tech Stack Tag Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Tech Stack (JSONB / Array)
                </label>
                
                {/* Current tags */}
                <div className="flex flex-wrap gap-1.5 mb-2 min-h-[32px] p-2 bg-[#0F1115] border border-[#262A33] rounded-lg">
                  {techStack.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#E11D48]/10 border border-[#E11D48]/30 text-rose-300 text-xs rounded-md"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="text-rose-400 hover:text-white"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  {techStack.length === 0 && (
                    <span className="text-xs text-slate-500 italic">No technologies added yet.</span>
                  )}
                </div>

                {/* Input for new tag */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTagInput}
                    onChange={(e) => setNewTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag(newTagInput);
                      }
                    }}
                    placeholder="Type technology (e.g. Next.js) and press Enter or Add"
                    className="flex-1 px-3.5 py-1.5 bg-[#0F1115] border border-[#2A2E39] rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#E11D48]"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddTag(newTagInput)}
                    className="px-3.5 py-1.5 bg-[#1F222A] hover:bg-[#262A33] text-slate-200 text-xs font-medium rounded-lg"
                  >
                    Add
                  </button>
                </div>

                {/* Quick suggestions */}
                <div className="mt-2 flex flex-wrap gap-1">
                  <span className="text-[11px] text-slate-400 self-center mr-1">Suggestions:</span>
                  {popularTags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleAddTag(tag)}
                      disabled={techStack.includes(tag)}
                      className={`text-[11px] px-2 py-0.5 rounded border transition-colors ${
                        techStack.includes(tag)
                          ? 'border-transparent text-slate-600 cursor-not-allowed'
                          : 'border-[#262A33] bg-[#1F222A] text-slate-300 hover:border-[#E11D48]/50 hover:text-[#E11D48]'
                      }`}
                    >
                      +{tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Featured & Display Order */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#262A33]">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="is_featured"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="w-4 h-4 rounded border-zinc-700 bg-[#0F1115] text-[#E11D48] focus:ring-[#E11D48]"
                  />
                  <label htmlFor="is_featured" className="text-xs font-medium text-slate-200 cursor-pointer flex items-center gap-1.5">
                    <Star className={`w-3.5 h-3.5 ${isFeatured ? 'text-amber-400 fill-amber-400' : 'text-slate-500'}`} />
                    Highlight as Featured Project
                  </label>
                </div>

                <div className="flex items-center gap-3">
                  <label htmlFor="display_order" className="text-xs font-medium text-slate-300">
                    Display Order Index:
                  </label>
                  <input
                    type="number"
                    id="display_order"
                    min={1}
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 1)}
                    className="w-20 px-2.5 py-1 bg-[#0F1115] border border-[#2A2E39] rounded-md text-xs text-slate-100 text-center"
                  />
                </div>
              </div>

              {/* Modal footer */}
              <div className="pt-5 border-t border-[#262A33] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-300 bg-[#1F222A] hover:bg-[#262A33] rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-[#E11D48] hover:bg-[#BE123C] rounded-lg transition-colors flex items-center gap-1.5 shadow-lg shadow-rose-900/30"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingProject ? 'Save Changes' : 'Create Project'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-[#16181D] border border-[#262A33] rounded-xl max-w-sm w-full p-6 space-y-4">
            <div className="flex items-center gap-3 text-rose-500">
              <AlertCircle className="w-6 h-6" />
              <h3 className="font-bold text-white text-base">Delete Project?</h3>
            </div>
            <p className="text-xs text-slate-300">
              Are you sure you want to permanently delete this project from the database?
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-3.5 py-1.5 bg-[#1F222A] text-slate-300 rounded-lg text-xs"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await deleteProject(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="px-4 py-1.5 bg-[#E11D48] hover:bg-[#BE123C] text-white rounded-lg text-xs font-semibold"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
