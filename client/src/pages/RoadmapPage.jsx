import React, { useState, useEffect } from "react";
import { generateRoadmapFromAI, getUserRoadmaps, updateTaskCompletion } from "../api/roadmapHelper";
import "./roadmap.css";

const RoadmapPage = () => {
  const [roadmaps, setRoadmaps] = useState([]);
  const [selectedRoadmap, setSelectedRoadmap] = useState(null);
  
  // Form States
  const [showForm, setShowForm] = useState(false);
  const [goal, setGoal] = useState("");
  const [duration, setDuration] = useState(7);
  const [topics, setTopics] = useState("");
  const [loading, setLoading] = useState(false);

  // 1. Page load par saare roadmaps fetch karein
  useEffect(() => {
    fetchRoadmaps();
  }, []);

  const fetchRoadmaps = async () => {
    try {
      const data = await getUserRoadmaps();
      setRoadmaps(data);
      if (data.length > 0 && !selectedRoadmap) {
        setSelectedRoadmap(data[0]); // Pehla roadmap auto-select kar lein
      }
    } catch (error) {
      console.error("Failed to load roadmaps");
    }
  };

  // 2. Naya Roadmap Generate Karein
  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!goal || duration < 1) return alert("Please provide a valid goal and duration.");

    setLoading(true);
    try {
      const newRoadmap = await generateRoadmapFromAI(goal, duration, topics);
      setRoadmaps([newRoadmap, ...roadmaps]); // Naya roadmap list mein top par add karein
      setSelectedRoadmap(newRoadmap);
      setShowForm(false);
      setGoal(""); setTopics(""); setDuration(7);
    } catch (error) {
      alert("Failed to generate roadmap. Try again.");
    }
    setLoading(false);
  };

  // 3. Task Checkbox Toggle Karein
  const handleTaskToggle = async (dayId, taskId, currentStatus) => {
    if (!selectedRoadmap) return;

    // Optimistic UI Update (Fauran screen par tick lagane ke liye)
    const updatedRoadmap = { ...selectedRoadmap };
    const day = updatedRoadmap.days.find(d => d._id === dayId);
    const task = day.tasks.find(t => t._id === taskId);
    task.isCompleted = !currentStatus;
    
    // Fauran update show karein
    setSelectedRoadmap(updatedRoadmap);

    try {
      // Backend ko update bhejein
      const savedRoadmap = await updateTaskCompletion(selectedRoadmap._id, dayId, taskId, !currentStatus);
      // Backend se exact progress bar wapis le kar set karein
      setSelectedRoadmap(savedRoadmap);
      
      // Main list mein bhi update karein
      setRoadmaps(roadmaps.map(rm => rm._id === savedRoadmap._id ? savedRoadmap : rm));
    } catch (error) {
      console.error("Task update failed", error);
      fetchRoadmaps(); // Agar fail ho jaye toh purana data wapis mangwa lein
    }
  };

  return (
    <div className="roadmap-page-container">
      <div className="roadmap-header">
        <h1> AI Study Roadmap</h1>
        <p>Your personalized step-by-step path to success!</p>
      </div>

      {/* CONTROLS SECTION */}
      <div className="roadmap-controls">
        <select 
          className="roadmap-dropdown"
          value={selectedRoadmap?._id || ""} 
          onChange={(e) => {
            const found = roadmaps.find(rm => rm._id === e.target.value);
            setSelectedRoadmap(found);
            setShowForm(false);
          }}
        >
          {roadmaps.length === 0 && <option value="">No Roadmaps Yet</option>}
          {roadmaps.map(rm => (
            <option key={rm._id} value={rm._id}>
               {rm.goal} ({rm.duration} Days)
            </option>
          ))}
        </select>

        <button 
          className="create-new-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cancel" : " Create New Plan"}
        </button>
      </div>

      {/* CREATE NEW FORM */}
      {showForm && (
        <form className="roadmap-form" onSubmit={handleGenerate}>
          <h3>Generate Your AI Plan</h3>
          <input 
            type="text" 
            placeholder="Main Goal (e.g., Learn Advanced Databases)" 
            value={goal} 
            onChange={e => setGoal(e.target.value)} 
            required 
          />
          <input 
            type="number" 
            placeholder="Duration (Days)" 
            value={duration} 
            onChange={e => setDuration(e.target.value)} 
            min="1" max="30" 
            required 
          />
          <textarea 
            placeholder="Specific topics you want to cover (Optional)" 
            value={topics} 
            onChange={e => setTopics(e.target.value)} 
            rows="3"
          ></textarea>
          <button type="submit" className="gen-roadmap-btn" disabled={loading}>
            {loading ? "Generating Magical Path... " : "Generate Roadmap"}
          </button>
        </form>
      )}

      {/* ROADMAP DISPLAY VIEW */}
      {!showForm && selectedRoadmap && (
        <div className="roadmap-display">
          <div className="roadmap-title-card">
            <h2>Goal: {selectedRoadmap.goal}</h2>
            
            {/* PROGRESS BAR */}
            <div className="progress-container">
              <div className="progress-info">
                <span>Overall Progress</span>
                <span>{selectedRoadmap.progress}%</span>
              </div>
              <div className="progress-bar-bg">
                <div 
                  className="progress-bar-fill" 
                  style={{ width: `${selectedRoadmap.progress}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="days-container">
            {selectedRoadmap.days.map((day) => (
              <div key={day._id} className="day-card">
                <div className="day-header">
                  <h3>Day {day.dayNumber}</h3>
                  <span className="day-theme">{day.theme}</span>
                </div>
                
                <div className="tasks-list">
                  {day.tasks.map(task => (
                    <label key={task._id} className={`task-item ${task.isCompleted ? 'completed' : ''}`}>
                      <input 
                        type="checkbox" 
                        checked={task.isCompleted} 
                        onChange={() => handleTaskToggle(day._id, task._id, task.isCompleted)}
                      />
                      <div className="task-content">
                        <h4>{task.title}</h4>
                        <p>{task.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RoadmapPage;