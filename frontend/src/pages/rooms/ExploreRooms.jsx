import React, { useState, useEffect } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { Compass, Filter, Plus, CheckCircle2 } from 'lucide-react';
import * as roomApi from '../../services/api/room-api.js';
import * as applicationApi from '../../services/api/application-api.js';
import RoomCard from '../../components/rooms/RoomCard.jsx';
import Loading from '../../components/common/Loading.jsx';
import Modal from '../../components/common/Modal.jsx';

const ExploreRooms = () => {
  const { globalSearch } = useOutletContext() || {};
  const [rooms, setRooms] = useState([]);
  const [selectedType, setSelectedType] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('OPEN');
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Join Modal state
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [joinRole, setJoinRole] = useState('Member');
  const [joinMessage, setJoinMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const fetchRooms = async () => {
    setIsLoading(true);
    try {
      const params = {};
      if (selectedType !== 'ALL') params.type = selectedType;
      if (selectedStatus !== 'ALL') params.status = selectedStatus;
      if (search || globalSearch) params.search = search || globalSearch;

      const res = await roomApi.getRooms(params);
      if (res.success && res.data) {
        setRooms(res.data.rooms || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [selectedType, selectedStatus, search, globalSearch]);

  const handleJoinSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRoom) return;

    setIsSubmitting(true);
    setFeedback(null);

    try {
      const res = await applicationApi.applyToRoom({
        roomId: selectedRoom._id,
        requestedRole: joinRole,
        message: joinMessage,
      });
      setFeedback({
        type: 'success',
        message: res.message || 'Application submitted successfully!',
      });
      setTimeout(() => {
        setSelectedRoom(null);
        setFeedback(null);
        setJoinMessage('');
        fetchRooms();
      }, 1500);
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err.message || 'Failed to submit application',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const roomTypes = [
    { id: 'ALL', label: 'All Types' },
    { id: 'HACKATHON', label: 'Hackathon' },
    { id: 'PERSONAL_PROJECT', label: 'Personal Project' },
    { id: 'CLUB', label: 'Clubs' },
    { id: 'RESEARCH', label: 'Research' },
    { id: 'COMPETITION', label: 'Competition' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Explore Rooms</h1>
          <p className="text-xs text-slate-500 mt-1">
            Discover student teams and collaborate on exciting projects and hackathons
          </p>
        </div>
        <Link
          to="/rooms/create"
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create Room</span>
        </Link>
      </div>

      {/* Category Pills & Filters (Screen 13 from Reference) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100">
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
          {roomTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                selectedType === type.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-100'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-3 self-end sm:self-auto">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 outline-none focus:border-blue-500 font-medium"
          >
            <option value="ALL">All Status</option>
            <option value="OPEN">Open Only</option>
            <option value="FULL">Full</option>
            <option value="IN_PROGRESS">In Progress</option>
          </select>
        </div>
      </div>

      {/* Rooms Grid */}
      {isLoading ? (
        <Loading message="Fetching rooms..." />
      ) : rooms.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center space-y-3">
          <Compass className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No Rooms Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search criteria or room type filter, or be the first to create one!
          </p>
          <Link
            to="/rooms/create"
            className="inline-block px-5 py-2.5 bg-blue-600 text-white text-xs font-semibold rounded-xl hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Create a New Room
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {rooms.map((room) => (
            <RoomCard
              key={room._id}
              room={room}
              onJoinClick={(r) => setSelectedRoom(r)}
            />
          ))}
        </div>
      )}

      {/* Join Request Modal */}
      <Modal
        isOpen={!!selectedRoom}
        onClose={() => {
          setSelectedRoom(null);
          setFeedback(null);
        }}
        title={`Request to Join "${selectedRoom?.name}"`}
      >
        {feedback ? (
          <div
            className={`p-4 rounded-xl text-xs flex items-center space-x-2 ${
              feedback.type === 'success'
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-rose-50 text-rose-700'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{feedback.message}</span>
          </div>
        ) : (
          <form onSubmit={handleJoinSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Your Preferred Role
              </label>
              <select
                value={joinRole}
                onChange={(e) => setJoinRole(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:bg-white focus:border-blue-500"
              >
                <option value="Frontend Developer">Frontend Developer</option>
                <option value="Backend Developer">Backend Developer</option>
                <option value="Full Stack Developer">Full Stack Developer</option>
                <option value="UI/UX Designer">UI/UX Designer</option>
                <option value="ML / AI Engineer">ML / AI Engineer</option>
                <option value="Researcher">Researcher</option>
                <option value="Member">General Member</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Note for the Host (Optional)
              </label>
              <textarea
                rows={3}
                value={joinMessage}
                onChange={(e) => setJoinMessage(e.target.value)}
                placeholder="Explain why you'd be a great addition to this team..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:bg-white focus:border-blue-500"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedRoom(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs disabled:opacity-60 cursor-pointer"
              >
                {isSubmitting ? 'Sending...' : 'Send Request'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default ExploreRooms;
