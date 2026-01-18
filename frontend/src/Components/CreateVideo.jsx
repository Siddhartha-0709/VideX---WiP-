import React, { useState } from 'react';
import { Play, Plus, Video, Clock, Search, Bell, User, Menu, X, TrendingUp, Sparkles } from 'lucide-react';

const API_BASE = 'http://210.79.128.211:8900/api/v1/videos';

const CLOUD_NAME = 'djf6ew5uc';
const UPLOAD_PRESET = 'VideX-Files';

const CreateVideo = ({ onBack, onStreamCreated }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        videoUrl: '',
        thumbnailUrl: '',
        duration: '',
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [uploadingThumb, setUploadingThumb] = useState(false);
    const [uploadingVideo, setUploadingVideo] = useState(false);
    const [videoUploadProgress, setVideoUploadProgress] = useState(0);
    const [thumbUploadProgress, setThumbUploadProgress] = useState(0);
    const [videoInfo, setVideoInfo] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const handleSubmit = async () => {
        if (!formData.title) {
            setMessage({ type: 'error', text: 'Video title is required' });
            return;
        }

        if (!formData.videoUrl) {
            setMessage({ type: 'error', text: 'Video URL is required' });
            return;
        }

        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const response = await fetch(`${API_BASE}/createVideo`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setVideoInfo(data);
                setShowModal(true);
                setMessage({ type: 'success', text: 'Video created successfully!' });
            } else {
                setMessage({ type: 'error', text: data.message || 'Failed to create video' });
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
        setThumbUploadProgress(0);
        setMessage({ type: '', text: '' });

        try {
            const data = new FormData();
            data.append('file', file);
            data.append('upload_preset', UPLOAD_PRESET);

            const xhr = new XMLHttpRequest();

            xhr.upload.addEventListener('progress', (e) => {
                if (e.lengthComputable) {
                    const percentComplete = Math.round((e.loaded / e.total) * 100);
                    setThumbUploadProgress(percentComplete);
                }
            });

            const uploadPromise = new Promise((resolve, reject) => {
                xhr.addEventListener('load', () => {
                    if (xhr.status === 200) {
                        resolve(JSON.parse(xhr.responseText));
                    } else {
                        reject(new Error('Upload failed'));
                    }
                });
                xhr.addEventListener('error', () => reject(new Error('Network error')));
            });

            xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`);
            xhr.send(data);

            const result = await uploadPromise;

            if (result.secure_url) {
                setFormData((prev) => ({
                    ...prev,
                    thumbnailUrl: result.secure_url,
                }));
                setMessage({ type: 'success', text: 'Thumbnail uploaded successfully!' });
            } else {
                throw new Error('Upload failed');
            }
        } catch (err) {
            console.log(err);
            setMessage({ type: 'error', text: 'Thumbnail upload failed' });
        } finally {
            setUploadingThumb(false);
            setThumbUploadProgress(0);
        }
    };

    const handleVideoUpload = async (file) => {
        if (!file) return;

        setUploadingVideo(true);
        setVideoUploadProgress(0);
        setMessage({ type: '', text: '' });

        try {
            const data = new FormData();
            data.append('file', file);
            data.append('upload_preset', UPLOAD_PRESET);

            const xhr = new XMLHttpRequest();

            xhr.upload.addEventListener('progress', (e) => {
                if (e.lengthComputable) {
                    const percentComplete = Math.round((e.loaded / e.total) * 100);
                    setVideoUploadProgress(percentComplete);
                }
            });

            const uploadPromise = new Promise((resolve, reject) => {
                xhr.addEventListener('load', () => {
                    if (xhr.status === 200) {
                        resolve(JSON.parse(xhr.responseText));
                    } else {
                        reject(new Error('Upload failed'));
                    }
                });
                xhr.addEventListener('error', () => reject(new Error('Network error')));
            });

            xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`);
            xhr.send(data);

            const result = await uploadPromise;

            if (result.secure_url) {
                setFormData((prev) => ({
                    ...prev,
                    videoUrl: result.secure_url,
                    duration: result.duration ? Math.round(result.duration).toString() : '',
                }));
                setMessage({ type: 'success', text: 'Video uploaded successfully!' });
            } else {
                throw new Error('Upload failed');
            }
        } catch (err) {
            console.log(err);
            setMessage({ type: 'error', text: 'Video upload failed' });
        } finally {
            setUploadingVideo(false);
            setVideoUploadProgress(0);
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
                                    <h2 className="text-2xl font-bold text-white">Create New Video</h2>
                                    <p className="text-white/50 text-sm">Start sharing your video with the audience</p>
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
                                        Video Title <span className="text-red-400">*</span>
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
                                        placeholder="Tell viewers what your video is about"
                                    />
                                </div>

                                <div>
                                    <label className="block text-white/90 mb-2 text-sm font-medium">
                                        Video <span className="text-red-400">*</span>
                                    </label>

                                    <div className="space-y-3">
                                        <input
                                            type="file"
                                            accept="video/*"
                                            onChange={(e) => handleVideoUpload(e.target.files[0])}
                                            disabled={uploadingVideo}
                                            className="block w-full text-sm text-white/70
                                                    file:mr-4 file:py-2 file:px-4
                                                    file:rounded-lg file:border-0
                                                    file:text-sm file:font-semibold
                                                    file:bg-purple-600/20 file:text-purple-400
                                                    hover:file:bg-purple-600/30
                                                    disabled:opacity-50 disabled:cursor-not-allowed"
                                        />

                                        {uploadingVideo && (
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-white/70">Uploading video...</span>
                                                    <span className="text-purple-400 font-semibold">{videoUploadProgress}%</span>
                                                </div>
                                                <div className="w-full bg-black/50 rounded-full h-2.5 border border-white/10">
                                                    <div 
                                                        className="bg-gradient-to-r from-purple-600 to-pink-600 h-full rounded-full transition-all duration-300 ease-out"
                                                        style={{ width: `${videoUploadProgress}%` }}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {formData.videoUrl && !uploadingVideo && (
                                        <div className="mt-4 p-3 bg-black/50 border border-white/10 rounded-xl">
                                            <p className="text-white/60 text-xs mb-1">Video URL</p>
                                            <p className="text-green-400 text-sm break-all">{formData.videoUrl}</p>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-white/90 mb-2 text-sm font-medium">
                                        Thumbnail
                                    </label>

                                    <div className="space-y-3">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleThumbnailUpload(e.target.files[0])}
                                            disabled={uploadingThumb}
                                            className="block w-full text-sm text-white/70
                                                    file:mr-4 file:py-2 file:px-4
                                                    file:rounded-lg file:border-0
                                                    file:text-sm file:font-semibold
                                                    file:bg-blue-600/20 file:text-blue-400
                                                    hover:file:bg-blue-600/30
                                                    disabled:opacity-50 disabled:cursor-not-allowed"
                                        />

                                        {uploadingThumb && (
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-white/70">Uploading thumbnail...</span>
                                                    <span className="text-blue-400 font-semibold">{thumbUploadProgress}%</span>
                                                </div>
                                                <div className="w-full bg-black/50 rounded-full h-2.5 border border-white/10">
                                                    <div 
                                                        className="bg-gradient-to-r from-blue-600 to-cyan-600 h-full rounded-full transition-all duration-300 ease-out"
                                                        style={{ width: `${thumbUploadProgress}%` }}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {formData.thumbnailUrl && !uploadingThumb && (
                                        <img
                                            src={formData.thumbnailUrl}
                                            alt="Thumbnail Preview"
                                            className="mt-4 w-full max-w-xs rounded-xl border border-white/10"
                                        />
                                    )}
                                </div>

                                <div>
                                    <label className="block text-white/90 mb-2 text-sm font-medium">
                                        Duration (seconds)
                                    </label>
                                    <input
                                        type="number"
                                        name="duration"
                                        value={formData.duration}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-black/50 border border-white/10 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all placeholder:text-white/30"
                                        placeholder="Auto-filled from video or enter manually"
                                    />
                                </div>

                                <button
                                    onClick={handleSubmit}
                                    disabled={loading || uploadingVideo || uploadingThumb}
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
                                        'Create Video'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showModal && videoInfo && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                    <div className="bg-zinc-950 border border-white/10 rounded-2xl p-6 w-full max-w-lg">
                        <h3 className="text-xl font-bold text-white mb-4">
                            Video Created Successfully!
                        </h3>

                        <div className="space-y-4 text-sm">
                            <div>
                                <p className="text-white/60 mb-2">Video ID</p>
                                <code className="block bg-black/50 p-2 rounded text-green-400">
                                    {videoInfo.id || videoInfo._id || 'N/A'}
                                </code>
                            </div>

                            <div>
                                <p className="text-white/60 mb-2">Title</p>
                                <code className="block bg-black/50 p-2 rounded text-blue-400">
                                    {videoInfo.title || formData.title}
                                </code>
                            </div>

                            <div>
                                <p className="text-white/60 mb-2">Video URL</p>
                                <code className="block bg-black/50 p-2 rounded text-purple-400 break-all">
                                    {videoInfo.videoUrl || formData.videoUrl}
                                </code>
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                setShowModal(false);
                                if (onStreamCreated) onStreamCreated();
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

export default CreateVideo;