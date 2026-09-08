import React, { useState } from 'react';
import { Plus, Trash2, ExternalLink, Briefcase, FolderGit2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import * as studentApi from '../../services/api/student-api.js';
import Modal from '../../components/common/Modal.jsx';

const MyProjects = () => {
  const { student, setStudent } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    link: '',
    role: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const projects = student?.projects || [];

  const handleAddProject = async (e) => {
    e.preventDefault();
    if (!formData.title) return;
    setIsSubmitting(true);

    const updatedProjects = [...projects, formData];

    try {
      const res = await studentApi.updateProfile({ projects: updatedProjects });
      if (res.success && res.data) {
        setStudent(res.data);
        setIsModalOpen(false);
        setFormData({ title: '', description: '', link: '', role: '' });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProject = async (indexToDelete) => {
    const updatedProjects = projects.filter((_, idx) => idx !== indexToDelete);
    try {
      const res = await studentApi.updateProfile({ projects: updatedProjects });
      if (res.success && res.data) {
        setStudent(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Projects</h1>
          <p className="text-xs text-slate-500 mt-1">Showcase your past work to prospective team hosts</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center space-x-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Project</span>
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center space-y-3">
          <FolderGit2 className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800">No Projects Added Yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Adding projects increases your match score and helps team leaders trust your capabilities!
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-50 text-blue-600 font-semibold rounded-xl text-xs hover:bg-blue-100 transition-colors"
          >
            Add Your First Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((proj, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <h3 className="font-bold text-slate-900 text-sm">{proj.title}</h3>
                  <button
                    onClick={() => handleDeleteProject(idx)}
                    className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                {proj.role && (
                  <p className="text-xs text-blue-600 font-medium mt-0.5 flex items-center space-x-1">
                    <Briefcase className="w-3 h-3" />
                    <span>{proj.role}</span>
                  </p>
                )}
                <p className="text-xs text-slate-600 mt-2 line-clamp-3">{proj.description}</p>
              </div>

              {proj.link && (
                <div className="mt-4 pt-3 border-t border-slate-50">
                  <a
                    href={proj.link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-1 text-xs text-blue-600 font-semibold hover:underline"
                  >
                    <span>View Project Link</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add Project Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Project"
      >
        <form onSubmit={handleAddProject} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Project Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Student Helper App or Autonomous Drone"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:bg-white focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Your Role</label>
            <input
              type="text"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              placeholder="e.g. Frontend Lead, UI Designer"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:bg-white focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Project URL (GitHub / Demo)</label>
            <input
              type="url"
              value={formData.link}
              onChange={(e) => setFormData({ ...formData, link: e.target.value })}
              placeholder="https://github.com/..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:bg-white focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="What technologies did you use? What problem did it solve?"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:bg-white focus:border-blue-500"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-medium hover:bg-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs disabled:opacity-60"
            >
              {isSubmitting ? 'Saving...' : 'Add Project'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default MyProjects;
