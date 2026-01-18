import React, { useState } from 'react';
import Dashboard from './Components/Dashboard';
import VideoPlayer from './Components/VideoPlayer';
import CreateStream from './Components/CreateStream';
import CreateVideo from './Components/CreateVideo';

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

  const handleVideoCreated = () => {
    setCurrentPage('dashboard');
  };

  return (
    <div className="min-h-screen bg-black">
      <script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>
    
      {currentPage === 'dashboard' && (
        <Dashboard
          onCreateClick={() => setCurrentPage('create')}
          onCreateVideoClick={() => setCurrentPage('createVideo')}
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

      {currentPage === 'createVideo' && (
        <CreateVideo
          onBack={() => setCurrentPage('dashboard')}
          onVideoCreated={handleVideoCreated}
        />
      )}
    </div>
  );
}