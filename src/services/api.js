import axios from 'axios';

const API_BASE_URL = 'https://videoplayer-backend-fieg.onrender.com/api';

export const api = {
    // Get all lessons
    getLessons: async () => {
        const response = await axios.get(`${API_BASE_URL}/lessons`);
        return response.data;
    },

    // Get encrypted video ID for a lesson
    getEncryptedVideoId: async (lessonId) => {
        const response = await axios.get(`${API_BASE_URL}/lessons/${lessonId}/video`);
        return response.data;
    },

    // Decrypt video ID
    decryptVideoId: async (encryptedData) => {
        const response = await axios.post(`${API_BASE_URL}/decrypt`, {
            encryptedVideoId: encryptedData.encryptedVideoId,
            timestamp: encryptedData.timestamp,
            checksum: encryptedData.checksum
        });
        return response.data;
    }
};
