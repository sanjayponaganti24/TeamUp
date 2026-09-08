import React, { useState, useEffect } from 'react';
import { Sparkles, Compass, CheckCircle2, ArrowRight } from 'lucide-react';
import * as matchingApi from '../../services/api/matching-api.js';
import * as applicationApi from '../../services/api/application-api.js';
import RoomCard from '../../components/rooms/RoomCard.jsx';
import Loading from '../../components/common/Loading.jsx';
import Modal from '../../components/common/Modal.jsx';

const RecommendedRooms = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Join modal
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [joinRole, setJoinRole] = useState('Member');
  const [joinMessage, setJoinMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const fetchRecommendations = async () => {
    setIsLoading(true);
    try {
      const res = await matchingApi.getRecommendedRooms({ limit: 15 });
      if (res.success && res.data) {
        setRecommendations(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const handleJoin = async (e) => {
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
        fetchRecommendations();
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

  if (isLoading) return <Loading message="Calculating match recommendations..." />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <h1 className="text-2xl font-bold text-slate-900">Recommended Rooms</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Personalized team recommendations based on your skills, branch, interests, and availability
          </p>
        </div>
      </div>

      {recommendations.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center space-y-3">
          <Sparkles className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No Matched Rooms Found Yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adding more skills and interests to your profile to receive high-compatibility suggestions!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {recommendations.map((rec) => (
            <RoomCard
              key={rec.room._id}
              room={rec.room}
              matchScore={rec.matchScore}
              reasons={rec.reasons}
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
          <form onSubmit={handleJoin} className="space-y-4">
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

export default RecommendedRooms;
