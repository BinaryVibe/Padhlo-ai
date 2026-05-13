import React, { useState, useEffect } from "react";
import axios from "axios";
import "./dashboard.css"; 

const DashboardPage = () => {
  const [stats, setStats] = useState({
    totalNotesGenerated: 0,
    totalQuizzesTaken: 0,
    totalScore: 0,
    totalQuestionsAnswered: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const API_BASE_URL = import.meta.env.VITE_API_URL;
        
        // Backend se stats mangwa rahe hain
        const response = await axios.get(`${API_BASE_URL}/users/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
      setLoading(false);
    };
    fetchStats();
  }, []);

  if (loading) return <div className="loading-text">Loading Dashboard...</div>;

  // Accuracy calculate karna (Bonus feature!)
  const accuracy = stats.totalQuestionsAnswered > 0 
    ? Math.round((stats.totalScore / stats.totalQuestionsAnswered) * 100) 
    : 0;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>📊 My Progress Dashboard</h1>
        <p>Track your AI-powered learning journey!</p>
      </div>

      {/* QUICK OVERVIEW CARDS */}
      <div className="stats-cards-wrapper">
        
        {/* Card 1: Notes Generated */}
        <div className="stat-card">
          <div className="stat-icon notes-icon">📝</div>
          <div className="stat-info">
            <h3>Notes Generated</h3>
            <h2>{stats.totalNotesGenerated}</h2>
          </div>
        </div>

        {/* Card 2: Quizzes Taken */}
        <div className="stat-card">
          <div className="stat-icon quiz-icon">🧠</div>
          <div className="stat-info">
            <h3>Quizzes Attempted</h3>
            <h2>{stats.totalQuizzesTaken}</h2>
          </div>
        </div>

        {/* Card 3: Total Score */}
        <div className="stat-card">
          <div className="stat-icon score-icon">🎯</div>
          <div className="stat-info">
            <h3>Total Correct Answers</h3>
            <h2>{stats.totalScore} <span className="small-text">/ {stats.totalQuestionsAnswered}</span></h2>
          </div>
        </div>

        {/* Card 4: Accuracy % */}
        <div className="stat-card">
          <div className="stat-icon accuracy-icon">⚡</div>
          <div className="stat-info">
            <h3>Average Accuracy</h3>
            <h2>{accuracy}%</h2>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardPage;