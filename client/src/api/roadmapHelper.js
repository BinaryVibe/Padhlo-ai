import axios from 'axios';

// 1. Generate New Roadmap
export const generateRoadmapFromAI = async (goal, duration, topics) => {
    try {
        const token = localStorage.getItem('token');
        const API_BASE_URL = import.meta.env.VITE_API_URL;
        
        const response = await axios.post(`${API_BASE_URL}/roadmaps/generate`, 
            { goal, duration, topics },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
    } catch (error) {
        console.error("Error generating roadmap:", error);
        throw error;
    }
};

// 2. Fetch User's Roadmaps
export const getUserRoadmaps = async () => {
    try {
        const token = localStorage.getItem('token');
        const API_BASE_URL = import.meta.env.VITE_API_URL;
        
        const response = await axios.get(`${API_BASE_URL}/roadmaps`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching roadmaps:", error);
        throw error;
    }
};

// 3. Update Task Progress (Checkbox tick/untick)
export const updateTaskCompletion = async (roadmapId, dayId, taskId, isCompleted) => {
    try {
        const token = localStorage.getItem('token');
        const API_BASE_URL = import.meta.env.VITE_API_URL;
        
        const response = await axios.put(`${API_BASE_URL}/roadmaps/update-task`, 
            { roadmapId, dayId, taskId, isCompleted },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
    } catch (error) {
        console.error("Error updating task:", error);
        throw error;
    }
};