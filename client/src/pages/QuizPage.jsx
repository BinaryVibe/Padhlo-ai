import React, { useState, useEffect } from "react";
import axios from "axios";
import { generateQuizFromAI, saveQuizToDB } from "../api/quizHelper";
import "./quizpage.css";

const QuizPage = () => {
  const [notes, setNotes] = useState([]);
  const [selectedNoteId, setSelectedNoteId] = useState("");
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [quizResult, setQuizResult] = useState(null);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const token = localStorage.getItem('token');
        const API_BASE_URL = import.meta.env.VITE_API_URL;
        
        const response = await axios.get(`${API_BASE_URL}/get-all-notes`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setNotes(response.data);
      } catch (error) {
        console.error("Failed to fetch notes for quiz:", error);
      }
    };
    fetchNotes();
  }, []);

  const handleGenerateQuiz = async () => {
    if (!selectedNoteId) return alert("Please select a note first!");
    
    const selectedNote = notes.find(n => n._id === selectedNoteId);
    if(!selectedNote) return;

    setLoading(true);
    setQuestions([]);
    setQuizResult(null);
    setSelectedOptions({});
    
    try {
      const noteTitle = selectedNote.topic || selectedNote.title || "Untitled Note";
      const noteContent = selectedNote.summary || selectedNote.content || selectedNote.notes || "General concepts";
      
      const generatedQuestions = await generateQuizFromAI(noteTitle, noteContent);
      setQuestions(generatedQuestions);
    } catch (error) {
      alert("Failed to generate quiz. Try again.");
    }
    setLoading(false);
  };

  const handleOptionSelect = (qIndex, option) => {
    if (quizResult) return; 
    setSelectedOptions({ ...selectedOptions, [qIndex]: option });
  };

  const handleSubmitQuiz = async () => {
    if (Object.keys(selectedOptions).length < questions.length) {
      return alert("Please answer all questions before submitting!");
    }

    let score = 0;
    questions.forEach((q, index) => {
      if (selectedOptions[index] === q.correctAnswer) score++;
    });

    setQuizResult({ score, total: questions.length });

    try {
      const selectedNote = notes.find(n => n._id === selectedNoteId);
      const noteTitle = selectedNote.topic || selectedNote.title || "Untitled Note";

      await saveQuizToDB(
        selectedNote._id, 
        `Quiz on ${noteTitle}`, 
        questions, 
        score, 
        questions.length
      );
      console.log("Score successfully saved in Database & UserStats!");
    } catch (error) {
      console.error("Could not save to DB.");
    }
  };

  return (
<div className="quiz-page-container">
      <div className="quiz-header">
        <h1>Quiz Generator</h1>
        <p className="quiz-slogan">Select your generated note to create a customized quiz!</p>
      </div>

      <div className="quiz-input-section">
        <select 
          className="notes-dropdown"
          value={selectedNoteId} 
          onChange={(e) => setSelectedNoteId(e.target.value)}
          disabled={loading || questions.length > 0}
        >
          <option value="">Select a Note to Generate Quiz</option>
          {notes.map(note => {
            const displayTitle = note.topic || note.title || "Unnamed Note";
            return (
              <option key={note._id} value={note._id}>
                {displayTitle}
              </option>
            );
          })}
        </select>

        {questions.length === 0 && (
          <button onClick={handleGenerateQuiz} disabled={loading || !selectedNoteId} className="gen-btn">
            {loading ? "Generating Quiz..." : "Generate Quiz"}
          </button>
        )}
        {questions.length > 0 && (
          <button onClick={() => setQuestions([])} className="reset-btn">
            Start New Quiz
          </button>
        )}
      </div>

      {questions.length > 0 && (
        <div className="quiz-questions-box">
          {questions.map((q, index) => (
            <div key={index} className="question-card">
              <h3>Q{index + 1}: {q.questionText}</h3>
              <div className="options-list">
                {q.options.map((opt, i) => {
                  let optClass = "option-btn";
                  
                  if (quizResult) {
                    if (opt === q.correctAnswer) optClass += " correct-opt";
                    else if (opt === selectedOptions[index] && opt !== q.correctAnswer) optClass += " wrong-opt";
                  } else {
                    if (opt === selectedOptions[index]) optClass += " selected-opt";
                  }

                  return (
                    <button key={i} className={optClass} onClick={() => handleOptionSelect(index, opt)}>
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {!quizResult ? (
             <button className="submit-quiz-btn" onClick={handleSubmitQuiz}>
              Submit Answers & Save Score
            </button>
          ) : (
            <div className="result-box">
              <h2>Your Score: {quizResult.score} / {quizResult.total}</h2>
              <p>{quizResult.score >= 3 ? "Great Job! Your score is saved." : "Needs revision. Your score is saved!"}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuizPage;