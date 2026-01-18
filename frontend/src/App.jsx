import React, { useState, useEffect, useRef } from 'react';
import { Play, Plus, Video, Clock, Search, Bell, User, Menu, X, TrendingUp, Sparkles } from 'lucide-react';
import Dashboard from './Components/Dashboard';
import VideoPlayer from './Components/VideoPlayer';
import CreateStream from './Components/CreateStream';
const API_BASE = 'http://localhost:8900/api/v1/streams';



export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedStream, setSelectedStream] = useState(null);

  const handlePlayStream = (stream) => {
    setSelectedStream(stream);
    setCurrentPage('player');
  };

  const handleStreamCreated = () => {
    setCurrentPage('dashboard');
  };

  return (
    <div className="min-h-screen bg-black">
      <script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>
    
      {currentPage === 'dashboard' && (
        <Dashboard
          onCreateClick={() => setCurrentPage('create')}
          onPlayStream={handlePlayStream}
        />
      )}
      
      {currentPage === 'create' && (
        <CreateStream
          onBack={() => setCurrentPage('dashboard')}
          onStreamCreated={handleStreamCreated}
        />
      )}
      
      {currentPage === 'player' && selectedStream && (
        <VideoPlayer
          stream={selectedStream}
          onBack={() => setCurrentPage('dashboard')}
        />
      )}
    </div>
  );
}