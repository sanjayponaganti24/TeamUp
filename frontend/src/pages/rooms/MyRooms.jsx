import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Compass, Plus, Users, ArrowRight, ShieldCheck } from 'lucide-react';
import * as roomApi from '../../services/api/room-api.js';
import Loading from '../../components/common/Loading.jsx';

const MyRooms = () => {
  const [hostedRooms, setHostedRooms] = useState([]);
  const [joinedRooms, setJoinedRooms] = useState([]);
  const [activeTab, setActiveTab] = useState('hosted');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMyRooms = async () => {
      setIsLoading(true);
      try {
        const res = await roomApi.getMyRooms();
        if (res.success && res.data) {
          setHostedRooms(res.data.hosted || []);
          setJoinedRooms(res.data.joined || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMyRooms();
  }, []);

  if (isLoading) return <Loading message="Loading your rooms..." />;

  const displayRooms = activeTab === 'hosted' ? hostedRooms : joinedRooms;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Rooms & Teams</h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage the teams you have created and participate in your active project squads
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

      {/* Tabs (Screen 17 from Reference) */}
      <div className="flex items-center space-x-2 border-b border-slate-100 pb-2">
        <button
          onClick={() => setActiveTab('hosted')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'hosted'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-100'
          }`}
        >
          Hosted by Me ({hostedRooms.length})
        </button>
        <button
          onClick={() => setActiveTab('joined')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'joined'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-100'
          }`}
        >
          Joined Teams ({joinedRooms.length})
        </button>
      </div>

      {displayRooms.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center space-y-3">
          <Compass className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800">
            {activeTab === 'hosted' ? 'You haven’t hosted any rooms yet' : 'You haven’t joined any teams yet'}
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {activeTab === 'hosted'
              ? 'Create your first room to start gathering teammates for your next project!'
              : 'Explore open rooms and apply to teams matching your skills!'}
          </p>
          <Link
            to={activeTab === 'hosted' ? '/rooms/create' : '/rooms'}
            className="inline-block px-4 py-2 bg-blue-50 text-blue-600 font-semibold rounded-xl text-xs hover:bg-blue-100 transition-colors"
          >
            {activeTab === 'hosted' ? 'Create a Room' : 'Explore Rooms'}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayRooms.map((room) => (
            <div
              key={room._id}
              className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md uppercase">
                    {room.type?.replace('_', ' ')}
                  </span>
                  <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                    {room.status}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 line-clamp-1">{room.name}</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{room.description}</p>
                <div className="mt-4 flex items-center space-x-2 text-xs text-slate-500">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    {room.members?.length || 1} / {room.capacity} Members
                  </span>
                </div>
              </div>

              <div className="mt-5 pt-3.5 border-t border-slate-50 flex items-center justify-between">
                <Link
                  to={`/team/${room._id}`}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center space-x-1"
                >
                  <span>Team Workspace</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                {activeTab === 'hosted' && (
                  <Link
                    to={`/rooms/${room._id}/requests`}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg text-xs transition-colors"
                  >
                    Requests
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyRooms;
