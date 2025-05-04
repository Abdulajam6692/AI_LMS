import { useState } from 'react';
import './Quiz.css';

const Quiz = () => {
  const questions = [
    {
      question: "What does HTML stand for?",
      options: ["Hyper Text Markup Language", "High Text Markup Language", "Hyper Tabular Markup Language", "None of these"],
      answer: 0
    },
    {
      question: "Which CSS property controls the text size?",
      options: ["font-style", "text-size", "font-size", "text-style"],
      answer: 2
    },
    {
      question: "Inside which HTML element do we put the JavaScript?",
      options: ["<js>", "<javascript>", "<script>", "<scripting>"],
      answer: 2
    },
    {
      question: "Which of the following is a backend language?",
      options: ["HTML", "CSS", "Node.js", "React"],
      answer: 2
    },
    {
      question: "Which of the following is a JavaScript library for building user interfaces?",
      options: ["Angular", "Vue", "React", "Ember"],
      answer: 2
    }
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);

  const handleAnswerOptionClick = (index) => {
    if (index === questions[currentQuestion].answer) {
      setScore(score + 1);
    }

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setShowScore(true);
    }
  };

  return (
    <div className="quiz-container">
      <h1 className="quiz-title">Quiz</h1>
      {showScore ? (
        <div className="score-container">
          <h2 className="score-title">Quiz Completed!</h2>
          <p className="score">Your Score: {score} out of {questions.length}</p>
        </div>
      ) : (
        <>
          <div className="progress-bar">
            <div 
              className="progress" 
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
          <h2 className="question">{questions[currentQuestion].question}</h2>
          <div className="options-container">
            {questions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerOptionClick(index)}
                className="option-button"
              >
                {option}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Quiz;