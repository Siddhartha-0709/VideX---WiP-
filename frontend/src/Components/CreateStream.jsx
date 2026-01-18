import React, { useState } from 'react';
import { Play, Plus, Video, Clock, Search, Bell, User, Menu, X, TrendingUp, Sparkles } from 'lucide-react';

const API_BASE = 'http://localhost:8900/api/v1/streams';

// 🔴 REPLACE THESE
const CLOUD_NAME = 'djf6ew5uc';
const UPLOAD_PRESET = 'VideX-Files';

const CreateStream = ({ onBack, onStreamCreated }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        thumbnailUrl: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [uploadingThumb, setUploadingThumb] = useState(false);
    const [streamInfo, setStreamInfo] = useState(null);
    const [showModal, setShowModal] = useState(false);


    const handleSubmit = async () => {
        if (!formData.title) {
            setMessage({ type: 'error', text: 'Stream title is required' });
            return;
        }

        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const response = await fetch(`${API_BASE}/createStream`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setStreamInfo(data);
                setShowModal(true);
                setMessage({ type: 'success', text: 'Stream created successfully!' });
            } else {
                setMessage({ type: 'error', text: data.message || 'Failed to create stream' });
            }
        } catch {
            setMessage({ type: 'error', text: 'Network error. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleThumbnailUpload = async (file) => {
        if (!file) return;

        setUploadingThumb(true);
        setMessage({ type: '', text: '' });

        try {
            const data = new FormData();
            data.append('file', file);
            data.append('upload_preset', UPLOAD_PRESET);

            const res = await fetch(
                `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
                {
                    method: 'POST',
                    body: data,
                }
            );

            const result = await res.json();

            if (result.secure_url) {
                setFormData((prev) => ({
                    ...prev,
                    thumbnailUrl: result.secure_url,
                }));
            } else {
                throw new Error('Upload failed');
            }
        } catch (err) {
            console.log(err);
            setMessage({ type: 'error', text: 'Thumbnail upload failed' });
        } finally {
            setUploadingThumb(false);
        }
    };


    return (
        <>
            <div className="min-h-screen bg-black">
                <div className="bg-gradient-to-b from-black via-zinc-950 to-black min-h-screen">
                    <div className="max-w-3xl mx-auto px-4 py-8">
                        <button
                            onClick={onBack}
                            className="group flex items-center gap-2 px-4 py-2 text-white/70 hover:text-white transition-colors mb-8"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            <span className="font-medium">Back</span>
                        </button>

                        <div className="bg-zinc-950/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                                    <Sparkles className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-white">Create New Stream</h2>
                                    <p className="text-white/50 text-sm">Start broadcasting to your audience</p>
                                </div>
                            </div>

                            {message.text && (
                                <div className={`mb-6 p-4 rounded-xl border ${message.type === 'success'
                                    ? 'bg-green-500/10 border-green-500/30 text-green-400'
                                    : 'bg-red-500/10 border-red-500/30 text-red-400'
                                    }`}>
                                    {message.text}
                                </div>
                            )}

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-white/90 mb-2 text-sm font-medium">
                                        Stream Title <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-black/50 border border-white/10 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all placeholder:text-white/30"
                                        placeholder="Enter an engaging title"
                                    />
                                </div>

                                <div>
                                    <label className="block text-white/90 mb-2 text-sm font-medium">Description</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows="3"
                                        className="w-full px-4 py-3 bg-black/50 border border-white/10 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all resize-none placeholder:text-white/30"
                                        placeholder="Tell viewers what your stream is about"
                                    />
                                </div>



                                <div>
                                    <label className="block text-white/90 mb-2 text-sm font-medium">
                                        Thumbnail
                                    </label>

                                    <div className="flex items-center gap-4">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleThumbnailUpload(e.target.files[0])}
                                            className="block w-full text-sm text-white/70
                                                    file:mr-4 file:py-2 file:px-4
                                                    file:rounded-lg file:border-0
                                                    file:text-sm file:font-semibold
                                                    file:bg-blue-600/20 file:text-blue-400
                                                    hover:file:bg-blue-600/30"
                                        />

                                        {uploadingThumb && (
                                            <span className="text-sm text-white/50">Uploading...</span>
                                        )}
                                    </div>

                                    {formData.thumbnailUrl && (
                                        <img
                                            src={formData.thumbnailUrl}
                                            alt="Thumbnail Preview"
                                            className="mt-4 w-full max-w-xs rounded-xl border border-white/10"
                                        />
                                    )}
                                </div>


                                <button
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:from-zinc-700 disabled:to-zinc-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 disabled:shadow-none"
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            Creating...
                                        </span>
                                    ) : (
                                        'Create Stream'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showModal && streamInfo && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                    <div className="bg-zinc-950 border border-white/10 rounded-2xl p-6 w-full max-w-lg">
                        <h3 className="text-xl font-bold text-white mb-4">
                            Stream Details
                        </h3>

                        <div className="space-y-4 text-sm">
                            <div>
                                <p className="text-white/60">RTMP Server</p>
                                <code className="block bg-black/50 p-2 rounded text-green-400">
                                    {streamInfo.rtmpUrl}
                                </code>
                            </div>

                            <div>
                                <p className="text-white/60">Stream Key</p>
                                <code className="block bg-black/50 p-2 rounded text-yellow-400">
                                    {streamInfo.streamKey}
                                </code>
                            </div>

                            <div>
                                <p className="text-white/60">HLS Playback URL</p>
                                <code className="block bg-black/50 p-2 rounded text-blue-400 break-all">
                                    {streamInfo.hlsUrl}
                                </code>
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                setShowModal(false);
                                onStreamCreated();
                            }}
                            className="mt-6 w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white font-semibold"
                        >
                            Done
                        </button>
                    </div>
                </div>
            )}
        </>

    );


};


export default CreateStream;
