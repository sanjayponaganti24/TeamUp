import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Sparkles, Users, ArrowLeft, Send, CheckCircle2 } from 'lucide-react';
import * as matchingApi from '../../services/api/matching-api.js';
import * as studentApi from '../../services/api/student-api.js';
import * as roomApi from '../../services/api/room-api.js';
import * as invitationApi from '../../services/api/invitation-api.js';
import ProfileCard from '../../components/profile/ProfileCard.jsx';
import Loading from '../../components/common/Loading.jsx';
import Modal from '../../components/common/Modal.jsx';

const RecommendedStudents = () => {
  const { id } = useParams(); // roomId if linked from room
  const [students, setStudents] = useState([]);
  const [hostedRooms, setHostedRooms] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState(id || '');
  const [isLoading, setIsLoading] = useState(true);

  // Invite Modal
  const [invitee, setInvitee] = useState(null);
  const [inviteRole, setInviteRole] = useState('Member');
  const [inviteMessage, setInviteMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const roomsRes = await roomApi.getMyRooms();
        const hosted = roomsRes.data?.hosted || [];
        setHostedRooms(hosted);

        const targetRoom = id || (hosted.length > 0 ? hosted[0]._id : '');
        setSelectedRoomId(targetRoom);

        if (targetRoom) {
          const matchRes = await matchingApi.getRecommendedStudents(targetRoom);
          if (matchRes.success) {
            setStudents(matchRes.data || []);
          }
        } else {
          // General student exploration
          const allRes = await studentApi.getAllStudents();
          if (allRes.success) {
            const formatted = (allRes.data?.students || []).map((s) => ({
              student: s,
              matchScore: 80,
              reasons: ['✓ Available for teamup'],
            }));
            setStudents(formatted);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleRoomChange = async (newRoomId) => {
    setSelectedRoomId(newRoomId);
    if (!newRoomId) return;

    setIsLoading(true);
    try {
      const res = await matchingApi.getRecommendedStudents(newRoomId);
      if (res.success) {
        setStudents(res.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendInvite = async (e) => {
    e.preventDefault();
    if (!invitee || !selectedRoomId) return;

    setIsSubmitting(true);
    setFeedback(null);

    try {
      const res = await invitationApi.inviteStudent({
        roomId: selectedRoomId,
        studentId: invitee._id,
        role: inviteRole,
        message: inviteMessage,
      });

      setFeedback({
        type: 'success',
        message: res.message || 'Invitation sent successfully!',
      });

      setTimeout(() => {
        setInvitee(null);
        setFeedback(null);
        setInviteMessage('');
      }, 1500);
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err.message || 'Failed to send invitation',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <Loading message="Finding matching students..." />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          {id && (
            <Link
              to={`/rooms/${id}`}
              className="inline-flex items-center space-x-1 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Room</span>
            </Link>
          )}
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <h1 className="text-2xl font-bold text-slate-900">Recommended Students</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Top candidate matches for your team based on skills, roles, and branch compatibility
          </p>
        </div>

        {hostedRooms.length > 0 && (
          <div className="flex items-center space-x-2">
            <label className="text-xs font-bold text-slate-600">For Room:</label>
            <select
              value={selectedRoomId}
              onChange={(e) => handleRoomChange(e.target.value)}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 outline-none font-medium"
            >
              {hostedRooms.map((r) => (
                <option key={r._id} value={r._id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {students.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center space-y-3">
          <Users className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No Candidates Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try broadening your room's required skills or check back as more students join TeamUp!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {students.map((item, idx) => (
            <ProfileCard
              key={item.student._id || idx}
              student={item.student}
              matchScore={item.matchScore}
              reasons={item.reasons}
              onInvite={(s) => setInvitee(s)}
            />
          ))}
        </div>
      )}

      {/* Invite Modal */}
      <Modal
        isOpen={!!invitee}
        onClose={() => {
          setInvitee(null);
          setFeedback(null);
        }}
        title={`Invite ${invitee?.name} to Your Team`}
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
          <form onSubmit={handleSendInvite} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Target Room</label>
              <select
                value={selectedRoomId}
                onChange={(e) => setSelectedRoomId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none"
              >
                {hostedRooms.map((r) => (
                  <option key={r._id} value={r._id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Role Offer</label>
              <input
                type="text"
                required
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value)}
                placeholder="e.g. Frontend Developer, UI Designer"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Personal Invitation Note
              </label>
              <textarea
                rows={3}
                value={inviteMessage}
                onChange={(e) => setInviteMessage(e.target.value)}
                placeholder="Hey! We saw your profile skills and think you'd be a great fit for our team..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setInvitee(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs disabled:opacity-60 cursor-pointer"
              >
                {isSubmitting ? 'Sending...' : 'Send Invitation'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default RecommendedStudents;
