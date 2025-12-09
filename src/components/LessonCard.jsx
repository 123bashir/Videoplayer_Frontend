import React from 'react';
import './LessonCard.css';

const LessonCard = ({ lesson, onPlay }) => {
    return (
        <div className="lesson-card">
            <div className="lesson-thumbnail">
                <img src={lesson.thumbnail} alt={lesson.title} />
                <div className="play-overlay" onClick={() => onPlay(lesson.id)}>
                    <div className="play-button">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    </div>
                </div>
                <div className="duration-badge">{lesson.duration}</div>
            </div>
            <div className="lesson-content">
                <h3 className="lesson-title">{lesson.title}</h3>
                <p className="lesson-description">{lesson.description}</p>
                <button className="watch-btn" onClick={() => onPlay(lesson.id)}>
                    Watch Lesson
                </button>
            </div>
        </div>
    );
};

export default LessonCard;
