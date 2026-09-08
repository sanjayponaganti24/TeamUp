import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, Plus, CheckCircle2, ArrowLeft, Trash2 } from 'lucide-react';
import Modal from '../../components/common/Modal.jsx';

const TeamAgenda = () => {
  const { id } = useParams();

  const [agendaItems, setAgendaItems] = useState([
    {
      id: 1,
      date: 'Sept 12, 2026',
      title: 'Design UI mockups and Figma wireframes',
      status: 'In Progress',
    },
    {
      id: 2,
      date: 'Sept 15, 2026',
      title: 'Develop frontend components and connect Axios API',
      status: 'Pending',
    },
    {
      id: 3,
      date: 'Sept 18, 2026',
      title: 'API integration & MongoDB schema validation',
      status: 'Pending',
    },
    {
      id: 4,
      date: 'Sept 20, 2026',
      title: 'Final testing and submission ready',
      status: 'Pending',
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('');

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newTitle) return;

    setAgendaItems([
      ...agendaItems,
      {
        id: Date.now(),
        title: newTitle,
        date: newDate || 'Upcoming',
        status: 'Pending',
      },
    ]);
    setNewTitle('');
    setNewDate('');
    setIsModalOpen(false);
  };

  const toggleStatus = (itemId) => {
    setAgendaItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const nextStatus =
            item.status === 'Pending'
              ? 'In Progress'
              : item.status === 'In Progress'
              ? 'Completed'
              : 'Pending';
          return { ...item, status: nextStatus };
        }
        return item;
      })
    );
  };

  const deleteItem = (itemId) => {
    setAgendaItems((prev) => prev.filter((i) => i.id !== itemId));
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'In Progress':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-amber-50 text-amber-700 border-amber-200';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <Link
            to={`/team/${id}`}
            className="inline-flex items-center space-x-1 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Workspace</span>
          </Link>
          <h1 className="text-xl font-bold text-slate-900">Team Agenda & Milestones</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Coordinate deadlines and track milestone progress together
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center space-x-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Task</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 divide-y divide-slate-100 p-2 sm:p-4 shadow-xs">
        {agendaItems.map((item) => (
          <div
            key={item.id}
            className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 rounded-2xl transition-colors"
          >
            <div className="flex items-center space-x-4">
              <button
                onClick={() => toggleStatus(item.id)}
                title="Click to advance status"
                className={`w-6 h-6 rounded-full border flex items-center justify-center cursor-pointer transition-colors ${
                  item.status === 'Completed'
                    ? 'bg-emerald-500 border-emerald-500 text-white'
                    : 'border-slate-300 hover:border-blue-500 text-transparent'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
              </button>
              <div>
                <h4
                  className={`text-xs sm:text-sm font-semibold text-slate-900 ${
                    item.status === 'Completed' ? 'line-through text-slate-400' : ''
                  }`}
                >
                  {item.title}
                </h4>
                <p className="text-[11px] text-slate-400 flex items-center space-x-1 mt-0.5">
                  <Calendar className="w-3 h-3" />
                  <span>{item.date}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 self-end sm:self-center">
              <button
                onClick={() => toggleStatus(item.id)}
                className={`text-[11px] font-semibold px-3 py-1 rounded-full border cursor-pointer ${getStatusBadge(
                  item.status
                )}`}
              >
                {item.status}
              </button>
              <button
                onClick={() => deleteItem(item.id)}
                className="p-1 text-slate-300 hover:text-rose-500 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Task Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Agenda Milestone"
      >
        <form onSubmit={handleAddItem} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Task / Goal</label>
            <input
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Integrate database with Express"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:bg-white focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Target Date</label>
            <input
              type="text"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              placeholder="e.g. Sept 24, 2026"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:bg-white focus:border-blue-500"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs"
            >
              Add Milestone
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TeamAgenda;
