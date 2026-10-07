import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MessageSquare, Pin, Trash2, ArrowLeft, Send, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import * as roomUpdateApi from '../../services/api/room-update-api.js';
import * as roomApi from '../../services/api/room-api.js';
import { joinRoomChannel, leaveRoomChannel, getSocket } from '../../services/socket/socket.js';
import Loading from '../../components/common/Loading.jsx';

const TeamUpdates = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [room, setRoom] = useState(null);
  const [updates, setUpdates] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState('UPDATE');
  const [isPinned, setIsPinned] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUpdates = async () => {
    try {
      const [roomRes, updatesRes] = await Promise.all([
        roomApi.getRoomById(id),
        roomUpdateApi.getRoomUpdates(id),
      ]);
      if (roomRes.success) setRoom(roomRes.data);
      if (updatesRes.success) setUpdates(updatesRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUpdates();
    joinRoomChannel(id);

    const socket = getSocket();
    const handleNewUpdate = (newUpdate) => {
      setUpdates((prev) => [newUpdate, ...prev]);
    };

    socket.on('ROOM_UPDATE_POSTED', handleNewUpdate);

    return () => {
      leaveRoomChannel(id);
      socket.off('ROOM_UPDATE_POSTED', handleNewUpdate);
    };
  }, [id]);

  const handlePost = async (e) => {
    e.preventDefault();
    if (!title || !content) return;

    setIsPosting(true);
    try {
      const res = await roomUpdateApi.createRoomUpdate(id, {
        title,
        content,
        type,
        pinned: isPinned,
      });
      if (res.success && res.data) {
        setTitle('');
        setContent('');
        setIsPinned(false);
      }
    } catch (err) {
      alert(err.message || 'Failed to post update');
    } finally {
      setIsPosting(false);
    }
  };

  const handleDelete = async (updateId) => {
    try {
      await roomUpdateApi.deleteRoomUpdate(updateId);
      setUpdates((prev) => prev.filter((u) => u._id !== updateId));
    } catch (err) {
      alert(err.message || 'Failed to delete update');
    }
  };

  if (isLoading) return <Loading message="Loading team feed..." />;

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
          <h1 className="text-xl font-bold text-slate-900">Team Feed & Updates</h1>
          <p className="text-xs text-slate-500 mt-0.5">Post announcements and progress reports for {room?.name}</p>
        </div>
      </div>

      {/* Post New Update Card */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Share an Announcement</h3>
        <form onSubmit={handlePost} className="space-y-3">
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Update Title (e.g. Completed Backend API Architecture!)"
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-blue-500 outline-none"
          />

          <textarea
            rows={3}
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your update or project milestone details..."
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-blue-500 outline-none"
          />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <div className="flex items-center space-x-4 text-xs">
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 outline-none"
              >
                <option value="UPDATE">General Update</option>
                <option value="MILESTONE">Milestone Reached 🏆</option>
                <option value="ANNOUNCEMENT">Announcement 📢</option>
              </select>

              <label className="flex items-center space-x-1.5 cursor-pointer text-slate-600 font-medium">
                <input
                  type="checkbox"
                  checked={isPinned}
                  onChange={(e) => setIsPinned(e.target.checked)}
                  className="rounded text-blue-600"
                />
                <span>Pin update</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isPosting}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center justify-center space-x-1.5 disabled:opacity-60 transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isPosting ? 'Posting...' : 'Post Update'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Updates Feed */}
      <div className="space-y-4">
        {updates.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-100 p-8 text-center text-xs text-slate-400">
            No updates posted yet. Be the first to share!
          </div>
        ) : (
          updates.map((u) => (
            <div
              key={u._id}
              className={`bg-white rounded-2xl border p-5 shadow-xs space-y-3 transition-all ${
                u.pinned ? 'border-blue-200 bg-blue-50/20' : 'border-slate-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-full bg-linear-to-tr from-blue-500 to-indigo-500 text-white font-bold text-xs flex items-center justify-center">
                    {u.author?.name ? u.author.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{u.author?.name}</h4>
                    <p className="text-[10px] text-slate-400">
                      {new Date(u.createdAt).toLocaleDateString()} at{' '}
                      {new Date(u.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {u.pinned && (
                    <span className="flex items-center space-x-1 text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                      <Pin className="w-3 h-3" />
                      <span>Pinned</span>
                    </span>
                  )}
                  {(user?._id === u.author?._id || user?._id === room?.host?._id) && (
                    <button
                      onClick={() => handleDelete(u._id)}
                      className="p-1 text-slate-300 hover:text-rose-500 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900">{u.title}</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed whitespace-pre-line">
                  {u.content}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TeamUpdates;
