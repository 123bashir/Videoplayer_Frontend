import { useState, useEffect } from 'react';
import LessonCard from './components/LessonCard';
import VideoPlayer from './components/VideoPlayer';
import { api } from './services/api';
import './App.css';

function App() {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLessonId, setSelectedLessonId] = useState(null);

  useEffect(() => {
    loadLessons();

    // Block right-click context menu completely
    const handleContextMenu = (e) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    document.addEventListener('contextmenu', handleContextMenu, true);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu, true);
    };
  }, []);

  const loadLessons = async () => {
    try {
      setLoading(true);
      const data = await api.getLessons();
      setLessons(data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to load videos:', err);
      setError('Failed to load videos. Please make sure the backend server is running.');
      setLoading(false);
    }
  };

  const handlePlayLesson = (lessonId) => {
    setSelectedLessonId(lessonId);
  };

  const handleClosePlayer = () => {
    setSelectedLessonId(null);
  };

  if (loading) {
    return (
      <div className="app">
        <div className="loading-container">
          <div className="spinner-large"></div>
          <p>Loading Videos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app">
        <div className="error-container">
          <h2>⚠️ Error</h2>
          <p>{error}</p>
          <button onClick={loadLessons} className="retry-btn">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">
            <span className="title-icon"></span>
            Umar M Shareef Tsintuwa
          </h1>
          <p className="app-subtitle">My Favourite Hausa Musician</p>
        </div>
      </header>

      <main className="app-main">
        <div className="lessons-grid">
          {lessons.map((lesson) => (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              onPlay={handlePlayLesson}
            />
          ))}
        </div>

        {lessons.length === 0 && (
          <div className="empty-state">
            <p>No Video available yet.</p>
          </div>
        )}
      </main>

      {selectedLessonId && (
        <VideoPlayer
          lessonId={selectedLessonId}
          onClose={handleClosePlayer}
        />
      )}

      <footer className="app-footer">
        <p>© 2024 https://bashfortech.onrender.com All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
