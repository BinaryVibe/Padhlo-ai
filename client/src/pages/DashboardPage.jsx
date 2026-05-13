import React, { useState, useEffect } from "react";
import axios from "axios";
import "./dashboard.css";

// Clean SVG Icons to replace emojis
const IconNotes = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 7 20 7"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><line x1="10" y1="9" x2="8" y2="9"></line></svg>;
const IconQuiz = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path><path d="M12 2v2"></path><path d="M12 12v.01"></path><path d="M16 4l-1.5 1.5"></path><path d="M8 4L9.5 5.5"></path></svg>;
const IconTarget = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>;
const IconPercent = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="5" x2="5" y2="19"></line><circle cx="6.5" cy="6.5" r="2.5"></circle><circle cx="17.5" cy="17.5" r="2.5"></circle></svg>;

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

  if (loading) return (
    <div className="dashboard-loading-container">
        <div className="loader"></div>
        <p>Loading Dashboard...</p>
    </div>
  );

  const accuracy = stats.totalQuestionsAnswered > 0 
    ? Math.round((stats.totalScore / stats.totalQuestionsAnswered) * 100) 
    : 0;

  return (
    <div className="dashboard-page-layout">
      
      <div className="dashboard-main-content">
        
        <div className="dashboard-header-section">
          <h1 className="dashboard-main-heading">Performance Dashboard</h1>
          <p className="dashboard-slogan">Analytics and insights into your AI study journey.</p>
        </div>

        <div className="stats-grid-container">
          
          <div className="analytics-card">
            <div className="card-header-row">
              <span className="card-label">Content Created</span>
              <div className="icon-wrapper blue-icon"><IconNotes /></div>
            </div>
            <div className="card-value-row">
              <h2>{stats.totalNotesGenerated}</h2>
              <p>Total Notes</p>
            </div>
          </div>

          <div className="analytics-card">
            <div className="card-header-row">
              <span className="card-label">Retrieval Practice</span>
              <div className="icon-wrapper purple-icon"><IconQuiz /></div>
            </div>
            <div className="card-value-row">
              <h2>{stats.totalQuizzesTaken}</h2>
              <p>Quizzes Completed</p>
            </div>
          </div>

          <div className="analytics-card">
            <div className="card-header-row">
              <span className="card-label">Knowledge Mastery</span>
              <div className="icon-wrapper green-icon"><IconTarget /></div>
            </div>
            <div className="card-value-row">
              <h2>{stats.totalScore}</h2>
              <p>Correct <span className="value-divider">/</span> {stats.totalQuestionsAnswered} Total</p>
            </div>
          </div>

          <div className="analytics-card accuracy-card">
            <div className="card-header-row">
              <span className="card-label">Overall Accuracy</span>
              <div className="icon-wrapper orange-icon"><IconPercent /></div>
            </div>
            <div className="card-value-row">
              <h2>{accuracy}%</h2>
              <p>Performance Metric</p>
            </div>
            <div className="accuracy-bar-container">
                <div className="accuracy-bar-fill" style={{width: `${accuracy}%`}}></div>
            </div>
          </div>

        </div>
      </div>

      <div className="bottom-sec-wrapper">
        <div className="bottom-sec" id="about-section">
            
            <div className="bottom-top-row">
                <div className="about">
                <h2>About Padhlo AI</h2>
                <p>
                    Padhlo AI is an educational web app designed to help students learn
                    smarter. It includes two powerful tools — a{" "}
                    <strong>Notes Helper</strong> that turns your rough notes into
                    clean, structured study material, and a{" "}
                    <strong>Quiz Generator</strong> that creates MCQs from any topic
                    instantly using AI.
                </p>
                </div>
            </div>

            <div className="bottom-bottom-row">
                <div className="creator">
                <h3>Made by</h3>
                <p>
                    <strong>Ayaan Ahmed Khan</strong>
                    <br />
                    Student | Developer | Learning with AI
                    <br />
                    <a href="https://www.linkedin.com/in/ayaan-ahmed-khan-448600351" target="_blank" rel="noopener noreferrer">Let's connect</a>
                </p>
                </div>

                <div className="project-info">
                <h3>Tech Stack</h3>
                <ul>
                    <li>Frontend: React</li>
                    <li>Backend: Node.js + Express</li>
                    <li>Database: MongoDB (optional)</li>
                    <li>AI: Gemini API (for notes and quiz)</li>
                </ul>
                </div>
            </div>
            
        </div>
      </div>

    </div>
  );
};

export default DashboardPage;