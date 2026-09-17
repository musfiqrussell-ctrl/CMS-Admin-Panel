import React, { useState } from 'react';
import { 
  Plus, Edit2, Trash2, Code, Server, Database, Cloud, Palette, 
  Layers, Cpu, Network, Shield, Zap, Box, GitBranch, Terminal, Check, X, AlertCircle 
} from 'lucide-react';
import { Skill, SkillCategory } from '../../types';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';

const CATEGORIES: SkillCategory[] = [
  'Frontend',
  'Backend',
  'Database',
  'Cloud & DevOps',
  'Tools & Methods',
];

const AVAILABLE_ICONS = [
  { name: 'Code', icon: Code },
  { name: 'Server', icon: Server },
  { name: 'Database', icon: Database },
  { name: 'Cloud', icon: Cloud },
  { name: 'Palette', icon: Palette },
  { name: 'Layers', icon: Layers },
  { name: 'Cpu', icon: Cpu },
  { name: 'Network', icon: Network },
  { name: 'Shield', icon: Shield },
  { name: 'Zap', icon: Zap },
  { name: 'Box', icon: Box },
  { name: 'GitBranch', icon: GitBranch },
  { name: 'Terminal', icon: Terminal },
];

export function SkillsManager() {
  const { skills, createSkill, updateSkill, deleteSkill } = useData();
  const { showToast } = useToast();

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [category, setCategory] = useState<string>('Frontend');
  const [proficiency, setProficiency] = useState<number>(85);
  const [iconName, setIconName] = useState<string>('Code');

  const filteredSkills = activeCategory === 'All' 
    ? skills 
    : skills.filter((s) => s.category.toLowerCase() === activeCategory.toLowerCase());

  const openAddModal = (defaultCat?: string) => {
    setEditingSkill(null);
    setName('');
    setCategory(defaultCat || 'Frontend');
    setProficiency(85);
    setIconName('Code');
    setIsModalOpen(true);
  };

  const openEditModal = (skill: Skill) => {
    setEditingSkill(skill);
    setName(skill.name);
    setCategory(skill.category);
    setProficiency(skill.proficiency_percent);
    setIconName(skill.icon_name || 'Code');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Skill name is required', 'error');
      return;
    }

    if (editingSkill) {
      await updateSkill(editingSkill.id, {
        name,
        category,
        proficiency_percent: Number(proficiency),
        icon_name: iconName,
      });
    } else {
      await createSkill({
        name,
        category,
        proficiency_percent: Number(proficiency),
        icon_name: iconName,
      });
    }

    setIsModalOpen(false);
  };

  const getIconComponent = (iconStr: string) => {
    const found = AVAILABLE_ICONS.find((i) => i.name.toLowerCase() === (iconStr || '').toLowerCase());
    const IconComp = found ? found.icon : Code;
    return <IconComp className="w-4 h-4" />;
  };

  // Grouped skills by category for summary metrics
  const categoryCounts = skills.reduce((acc, skill) => {
    acc[skill.category] = (acc[skill.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Technical Skills & Proficiencies</h2>
          <p className="text-xs text-slate-400 mt-1">
            Display your core engineering competencies on <span className="text-[#E11D48] font-medium">musfiqrussell.netlify.app</span> ({skills.length} skills mapped)
          </p>
        </div>

        <button
          onClick={() => openAddModal()}
          className="px-4 py-2 bg-[#E11D48] hover:bg-[#BE123C] text-white font-semibold text-xs rounded-lg transition-all flex items-center gap-2 shadow-lg shadow-rose-900/30"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Skill</span>
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#262A33] scrollbar-none">
        <button
          onClick={() => setActiveCategory('All')}
          className={`px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
            activeCategory === 'All'
              ? 'bg-[#E11D48] text-white shadow-md shadow-rose-900/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-[#1F222A]'
          }`}
        >
          All Skills ({skills.length})
        </button>

        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeCategory === cat
                ? 'bg-[#E11D48] text-white shadow-md shadow-rose-900/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#1F222A]'
            }`}
          >
            <span>{cat}</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeCategory === cat ? 'bg-black/40 text-white' : 'bg-[#0F1115] text-slate-400'}`}>
              {categoryCounts[cat] || 0}
            </span>
          </button>
        ))}
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSkills.map((skill) => (
          <div
            key={skill.id}
            className="bg-[#16181D] border border-[#262A33] rounded-xl p-4 hover:border-[#E11D48]/40 transition-all flex flex-col justify-between group shadow-md"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-[#E11D48]/10 text-[#E11D48] border border-[#E11D48]/25">
                    {getIconComponent(skill.icon_name)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm group-hover:text-[#E11D48] transition-colors">
                      {skill.name}
                    </h3>
                    <span className="text-[11px] text-slate-400">{skill.category}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openEditModal(skill)}
                    className="p-1 text-slate-400 hover:text-[#E11D48] transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(skill.id)}
                    className="p-1 text-slate-400 hover:text-rose-400 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Progress Slider Display */}
              <div className="space-y-1.5 mt-2">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">Proficiency</span>
                  <span className="font-mono font-bold text-[#E11D48]">{skill.proficiency_percent}%</span>
                </div>
                <div className="w-full h-2 bg-[#0F1115] rounded-full overflow-hidden border border-[#262A33]">
                  <div
                    className="h-full bg-gradient-to-r from-[#E11D48] to-rose-400 rounded-full transition-all duration-500"
                    style={{ width: `${skill.proficiency_percent}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#262A33] flex items-center justify-between text-[11px] text-slate-500">
              <span>{skill.proficiency_percent >= 90 ? 'Mastery / Architect' : skill.proficiency_percent >= 80 ? 'Advanced Senior' : 'Proficient'}</span>
              <button
                onClick={() => openEditModal(skill)}
                className="text-slate-400 hover:text-white"
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredSkills.length === 0 && (
        <div className="text-center py-12 bg-[#16181D] border border-[#262A33] rounded-xl">
          <p className="text-sm text-slate-400">No skills found in this category.</p>
          <button
            onClick={() => openAddModal(activeCategory !== 'All' ? activeCategory : 'Frontend')}
            className="mt-3 px-3.5 py-1.5 bg-[#E11D48] hover:bg-[#BE123C] text-white rounded-lg text-xs font-semibold"
          >
            Add first {activeCategory} skill
          </button>
        </div>
      )}

      {/* Add / Edit Skill Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-[#16181D] border border-[#262A33] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-5 border-b border-[#262A33] bg-[#16181D]">
              <h3 className="font-bold text-white text-base">
                {editingSkill ? 'Edit Skill' : 'Add New Skill'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Skill Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. React 19, TypeScript, PostgreSQL"
                  className="w-full px-3.5 py-2 bg-[#0F1115] border border-[#2A2E39] rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#E11D48]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#0F1115] border border-[#2A2E39] rounded-lg text-xs text-slate-100 focus:outline-none focus:border-[#E11D48]"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Proficiency Percent: <span className="text-[#E11D48] font-mono text-sm">{proficiency}%</span>
                  </label>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="1"
                  value={proficiency}
                  onChange={(e) => setProficiency(Number(e.target.value))}
                  className="w-full accent-[#E11D48] cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Select Visual Icon
                </label>
                <div className="grid grid-cols-5 gap-2 p-2 bg-[#0F1115] border border-[#262A33] rounded-lg max-h-36 overflow-y-auto">
                  {AVAILABLE_ICONS.map((item) => {
                    const IconC = item.icon;
                    const isSelected = iconName.toLowerCase() === item.name.toLowerCase();
                    return (
                      <button
                        key={item.name}
                        type="button"
                        onClick={() => setIconName(item.name)}
                        className={`flex flex-col items-center justify-center p-2 rounded-lg border text-xs transition-colors ${
                          isSelected
                            ? 'border-[#E11D48] bg-[#E11D48]/10 text-[#E11D48]'
                            : 'border-transparent text-slate-400 hover:text-white hover:bg-[#1F222A]'
                        }`}
                        title={item.name}
                      >
                        <IconC className="w-4 h-4 mb-1" />
                        <span className="text-[10px] truncate max-w-[50px]">{item.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-[#262A33] flex justify-end gap-3">
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
                  <span>{editingSkill ? 'Save Changes' : 'Create Skill'}</span>
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
              <h3 className="font-bold text-white text-base">Delete Skill?</h3>
            </div>
            <p className="text-xs text-slate-300">
              Are you sure you want to delete this technical skill from your profile?
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
                  await deleteSkill(deleteConfirmId);
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
