import React, { useState, useEffect, useRef } from 'react';
import YouTube from 'react-youtube';
import './VideoPlayer.css';

const VideoPlayer = ({ lessonId, onClose }) => {
    const [videoId, setVideoId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const playerRef = useRef(null);

    useEffect(() => {
        loadVideo();
    }, [lessonId]);

    const loadVideo = async () => {
        try {
            setLoading(true);
            setError(null);

            // Import API dynamically to avoid exposing it in bundle
            const { api } = await import('../services/api.js');

            // Get encrypted video ID
            const encryptedData = await api.getEncryptedVideoId(lessonId);

            // Decrypt video ID
            const decryptedData = await api.decryptVideoId(encryptedData.encryptedVideoId);

            // Set video ID (this happens in memory, harder to extract)
            setVideoId(decryptedData.videoId);
            setLoading(false);
        } catch (err) {
            console.error('Failed to load video:', err);
            setError('Failed to load video. Please try again.');
            setLoading(false);
        }
    };

    const opts = {
        height: '100%',
        width: '100%',
        playerVars: {
            autoplay: 1,
            controls: 1,
            modestbranding: 1,
            rel: 0,
            fs: 1,
            enablejsapi: 1,
        },
    };

    const onReady = (event) => {
        playerRef.current = event.target;

        const iframe = event.target.getIframe();
        if (iframe) {
            iframe.style.pointerEvents = 'auto';
        }
    };

    const onEnd = () => {

        if (playerRef.current) {
            playerRef.current.pauseVideo();
        }
    };

    const onError = (event) => {
        console.error('YouTube player error:', event.data);

        if (event.data === 150 || event.data === 101) {
            setError('This video cannot be played here. The owner has blocked embedding. Please enable "Allow embedding" in your YouTube video settings.');
        } else if (event.data === 2) {
            setError('Invalid video ID. Please check the video ID in server.js');
        } else if (event.data === 5) {
            setError('HTML5 player error. The video may not be available.');
        } else {
            setError(`Error playing video (Code: ${event.data}). The video might be private or unavailable.`);
        }
    };

    if (loading) {
        return (
            <div className="video-player-overlay">
                <div className="video-player-container">
                    <div className="loading-spinner">
                        <div className="spinner"></div>
                        <p>Loading Video...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="video-player-overlay">
                <div className="video-player-container">
                    <div className="error-message">
                        <h3>⚠️ {error}</h3>
                        <button onClick={onClose} className="close-btn">Close</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="video-player-overlay" onClick={onClose}>
            <div className="video-player-container" onClick={(e) => e.stopPropagation()}>
                <button className="close-button" onClick={onClose}>
                    ✕
                </button>
                <div className="video-wrapper">
                    {videoId && (
                        <YouTube
                            videoId={videoId}
                            opts={opts}
                            onReady={onReady}
                            onEnd={onEnd}
                            onError={onError}
                            className="youtube-player"
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default VideoPlayer;
