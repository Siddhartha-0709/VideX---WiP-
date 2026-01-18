/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect, useRef } from 'react';
import { Play, Plus, Video, Clock, Search, Bell, User, Menu, X, TrendingUp, Sparkles } from 'lucide-react';
const API_BASE = 'http://localhost:8900/api/v1/streams';



const VideoPlayer = ({ stream, onBack }) => {
    const videoRef = useRef(null);
    const [error, setError] = useState(null);


    console.log(stream);
    const status = stream.status;
    useEffect(() => {
        if (!stream?.hlsUrl || !videoRef.current) return;

        if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
            videoRef.current.src = stream.hlsUrl;
        } else if (window.Hls && window.Hls.isSupported()) {
            const hls = new window.Hls();
            hls.loadSource(stream.hlsUrl);
            hls.attachMedia(videoRef.current);

            hls.on(window.Hls.Events.ERROR, (event, data) => {
                if (data.fatal) {
                    setError('Failed to load video stream');
                }
            });

            return () => hls.destroy();
        } else {
            setError('HLS playback not supported in this browser');
        }
    }, [stream?.hlsUrl]);

    return (
        <>
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



                        </div>
                    </div>
                </div>
            </header>
            <div className="min-h-screen bg-black">
                <div className="bg-gradient-to-b from-black via-zinc-950 to-black">
                    <div className="max-w-7xl mx-auto px-4 py-4">
                        <button
                            onClick={onBack}
                            className="group flex items-center gap-2 px-4 py-2 text-white/70 hover:text-white transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            <span className="font-medium">Back</span>
                        </button>
                    </div>

                    <div className="max-w-7xl mx-auto px-4 pb-8">
                        <div className="bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/5">
                            {error ? (
                                <div className="aspect-video flex items-center justify-center text-red-400 bg-zinc-950">
                                    <div className="text-center">
                                        <Video className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                        <p>{error}</p>
                                    </div>
                                </div>
                            ) : (
                                <video
                                    ref={videoRef}
                                    controls
                                    autoPlay
                                    className="w-full aspect-video bg-black"
                                />
                            )}
                        </div>

                        <div className="mt-6 space-y-4">
                            <div>
                                <h1 className="text-3xl font-bold text-white mb-2">{stream?.title}</h1>
                                <p className="text-white/60 text-lg">{stream?.description}</p>
                            </div>

                            <div className="flex items-center gap-6 text-sm text-white/50">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    <span>{new Date(stream?.createdAt).toLocaleDateString()}</span>
                                </div>
                                {status==="live" &&
                                    <div className="flex items-center gap-2 px-3 py-1 bg-red-500/20 border border-red-500/30 rounded-full">
                                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                                        <span className="text-red-400 font-semibold">LIVE</span>
                                    </div>
                                }
                                {
                                    status==="idle" &&
                                    <div className="flex items-center gap-2 px-3 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded-full">
                                        <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                                        <span className="text-yellow-400 font-semibold">IDLE</span>
                                    </div>
                                }
                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>

    );
};


export default VideoPlayer