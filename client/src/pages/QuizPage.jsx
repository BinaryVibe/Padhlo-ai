import React, { useState } from "react";
import { generateQuizFromAI, saveQuizToDB } from "../api/quizHelper";
import "./quizpage.css";

const QuizPage = () => {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [quizResult, setQuizResult] = useState(null);

  // 1. AI se Quiz Generate Karwana
  const handleGenerateQuiz = async () => {
    if (!topic.trim()) return alert("Please enter a topic first!");
    
    setLoading(true);
    setQuestions([]);
    setQuizResult(null);
    setSelectedOptions({});
    
    try {
      const generatedQuestions = await generateQuizFromAI(topic);
      setQuestions(generatedQuestions);
    } catch (error) {
      alert("Failed to generate quiz. Try again.");
    }
    setLoading(false);
  };

  // 2. Option Select Karna
  const handleOptionSelect = (qIndex, option) => {
    if (quizResult) return; // Agar quiz submit ho gaya toh further changes block kar do
    setSelectedOptions({ ...selectedOptions, [qIndex]: option });
  };

  // 3. Quiz Submit Karna aur Score Calculate Karna
  const handleSubmitQuiz = async () => {
    if (Object.keys(selectedOptions).length < questions.length) {
      return alert("Please answer all questions before submitting!");
    }

    let score = 0;
    questions.forEach((q, index) => {
      if (selectedOptions[index] === q.correctAnswer) score++;
    });

    setQuizResult({ score, total: questions.length });

    // Database mein save karo
    try {
      await saveQuizToDB(`Quiz on ${topic}`, questions);
    } catch (error) {
      console.log("Could not save to DB, but showing results.");
    }
  };

  return (
    <div className="quiz-page-container">
      <div className="quiz-header">
        <h1>🧠 AI Quiz Generator</h1>
        <p>Type any topic to test your knowledge!</p>
      </div>

      {/* INPUT SECTION */}
      <div className="quiz-input-section">
        <input 
          type="text" 
          placeholder="e.g., Relational Algebra, Machine Learning..." 
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          disabled={loading || questions.length > 0}
        />
        {questions.length === 0 && (
          <button onClick={handleGenerateQuiz} disabled={loading} className="gen-btn">
            {loading ? "Generating Magic... ✨" : "Generate Quiz"}
          </button>
        )}
        {questions.length > 0 && (
          <button onClick={() => setQuestions([])} className="reset-btn">
            Start New Topic
          </button>
        )}
      </div>

      {/* QUIZ SECTION */}
      {questions.length > 0 && (
        <div className="quiz-questions-box">
          {questions.map((q, index) => (
            <div key={index} className="question-card">
              <h3>Q{index + 1}: {q.questionText}</h3>
              <div className="options-list">
                {q.options.map((opt, i) => {
                  let optClass = "option-btn";
                  
                  // Color styling after submission
                  if (quizResult) {
                    if (opt === q.correctAnswer) optClass += " correct-opt";
                    else if (opt === selectedOptions[index] && opt !== q.correctAnswer) optClass += " wrong-opt";
                  } else {
                    if (opt === selectedOptions[index]) optClass += " selected-opt";
                  }

                  return (
                    <button 
                      key={i} 
                      className={optClass}
                      onClick={() => handleOptionSelect(index, opt)}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* SUBMIT BUTTON OR RESULTS */}
          {!quizResult ? (
            <button className="submit-quiz-btn" onClick={handleSubmitQuiz}>
              Submit Answers ✅
            </button>
          ) : (
            <div className="result-box">
              <h2>Your Score: {quizResult.score} / {quizResult.total} 🎯</h2>
              <p>{quizResult.score >= 3 ? "Great Job! Keep it up." : "Needs more revision. Study your notes!"}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuizPage;