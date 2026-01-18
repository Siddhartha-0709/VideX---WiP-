import React, { useState, useEffect } from 'react';
import { Play, Plus, Video, Clock, Search, Bell, User, Menu, X, TrendingUp, Sparkles } from 'lucide-react';
const API_BASE = 'http://210.79.128.211:8900/api/v1/streams';

const Dashboard = ({ onCreateClick, onPlayStream }) => {
  const [streams, setStreams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchStreams = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/getAllStreams`);
      const data = await response.json();
      console.log(data);
      setStreams(Array.isArray(data[0]) ? data[0] : data);
      setError(null);
    } catch (error) {
      console.log(error);
      setError('Failed to load streams');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStreams();
  }, []);

  const filteredStreams = streams.filter(stream =>
    stream.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    stream.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg blur-md opacity-75"></div>
                  <div className="relative p-2 bg-black rounded-lg">
                    <Video className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h1 className="text-xl font-bold text-white">StreamX</h1>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-colors">
                <Search className="w-4 h-4 text-white/50" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search streams..."
                  className="bg-transparent text-white text-sm outline-none placeholder:text-white/40 w-32 sm:w-48"
                />
              </div>

              <button
                onClick={onCreateClick}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold rounded-full transition-all shadow-lg shadow-blue-500/25"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Create</span>
              </button>

              <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <Bell className="w-5 h-5 text-white/70" />
              </button>

              <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <User className="w-5 h-5 text-white/70" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-b from-zinc-950 via-black to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-blue-500" />
            <h2 className="text-2xl font-bold text-white">Live Now</h2>
          </div>
          <p className="text-white/50 text-lg mb-8">Watch the hottest streams from around the world. . .</p>

          {/* Search for mobile */}
          <div className="sm:hidden flex items-center gap-3 px-4 py-3 bg-white/5 border border-white/10 rounded-xl mb-6">
            <Search className="w-5 h-5 text-white/50" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search streams..."
              className="bg-transparent text-white text-sm outline-none placeholder:text-white/40 w-full"
            />
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex justify-center items-center h-96">
              <div className="text-center">
                <svg className="animate-spin h-12 w-12 mx-auto mb-4 text-blue-500" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <p className="text-white/60">Loading streams...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center h-96">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center">
                  <X className="w-8 h-8 text-red-500" />
                </div>
                <p className="text-red-400 text-lg">{error}</p>
              </div>
            </div>
          ) : filteredStreams.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-96 text-white/40">
              <Video className="w-20 h-20 mb-4 opacity-30" />
              <p className="text-xl mb-2">
                {searchQuery ? 'No streams found' : 'No streams available'}
              </p>
              <p className="text-sm">
                {searchQuery ? 'Try a different search term' : 'Create your first stream to get started'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredStreams.map((stream) => (
                <div
                  key={stream._id}
                  className="group cursor-pointer"
                  onClick={() => onPlayStream(stream)}
                >
                  <div className="relative aspect-[16/10] bg-zinc-900 rounded-xl overflow-hidden mb-3">
                    <img
                      src={stream.thumbnailUrl}
                      alt={stream.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="250"%3E%3Crect fill="%2318181b" width="400" height="250"/%3E%3Ctext fill="%2371717a" font-family="sans-serif" font-size="16" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3ENo Thumbnail%3C/text%3E%3C/svg%3E';
                      }}
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="p-4 bg-white/20 backdrop-blur-sm rounded-full">
                        <Play className="w-8 h-8 text-white fill-white" />
                      </div>
                    </div>
                    {stream.status === 'live' ? (
                      <div className="absolute top-3 left-3 flex items-center gap-2 px-2.5 py-1 bg-red-500/90 backdrop-blur-sm rounded-md">
                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                        <span className="text-white text-xs font-bold uppercase tracking-wide">
                          Live
                        </span>
                      </div>
                    ) : stream.status === 'idle' ? (
                      <div className="absolute top-3 left-3 flex items-center gap-2 px-2.5 py-1 bg-yellow-500 border border-yellow-500/30 rounded-full">
                        <Clock className="w-3 h-3 text-white" />
                        <span className="text-white text-xs font-bold uppercase tracking-wide">
                          Upcoming
                        </span>
                      </div>

                    ) : null}



                    <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/70 backdrop-blur-sm rounded text-white text-xs font-medium">
                    </div>
                  </div>

                  <div>
                    <h3 className="text-white font-semibold mb-1 line-clamp-2 group-hover:text-blue-400 transition-colors">
                      {stream.title}
                    </h3>
                    <p className="text-white/50 text-sm line-clamp-1 mb-2">
                      {stream.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-white/40">
                      <span>{formatDate(stream.createdAt)}</span>
                      {/* <span className="px-2 py-1 bg-white/5 rounded">{stream.streamKey}</span> */}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard