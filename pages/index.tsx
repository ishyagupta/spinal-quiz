import React, { useState } from "react";

type Question = {
  id: number;
  text: string;
  options: string[];
  correctIndex: number;
};

const questions: Question[] = [
  // ALL 50 QUESTIONS HERE - copy from your current file (unchanged)
  {
    id: 1,
    text: "The spinal cord begins at the level of the:",
    options: ["Foramen magnum", "Atlas", "C3 vertebra", "Medulla oblongata only"],
    correctIndex: 0
  },
  {
    id: 2,
    text: "The spinal cord ends at the level of the:",
    options: ["Sacrum", "First and second lumbar vertebrae", "Coccyx", "T12 vertebra"],
    correctIndex: 1
  },
  // ... (copy ALL 50 from your current file)
  {
    id: 50,
    text: "During the withdrawal reflex of the leg, while flexor muscles contract to withdraw the foot, the extensor muscles are inhibited. This is an example of:",
    options: ["Convergence", "Divergence", "Reciprocal inhibition", "Summation"],
    correctIndex: 2
  }
];

export default function Home() {
  const [answers, setAnswers] = useState<(number | null)[]>(
    Array(questions.length).fill(null)
  );
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (qIndex: number, optionIndex: number) => {
    if (submitted) return;
    const newAnswers = [...answers];
    newAnswers[qIndex] = optionIndex;
    setAnswers(newAnswers);
  };

  const score = answers.filter((ans, i) => ans === questions[i].correctIndex).length;

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const handleReset = () => {
    setAnswers(Array(questions.length).fill(null));
    setSubmitted(false);
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "2rem 1rem", fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ textAlign: "center", color: "#1a365d", marginBottom: "1rem" }}>
        🧠 Spinal Cord & Reflex Quiz (Grade 12 Anatomy)
      </h1>
      <p style={{ textAlign: "center", color: "#666", marginBottom: "2rem" }}>
        Select one answer per question. Click <strong>Submit</strong> to see your score!
      </p>

      {questions.map((q, qIndex) => (
        <div
          key={q.id}
          style={{
            border: "2px solid #e2e8f0",
            borderRadius: "12px",
            padding: "1.5rem",
            marginBottom: "1.5rem",
            backgroundColor: "#f8fafc",
            boxShadow: "0 4px 6px rgba(0,0,0,0.05)"
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: "1rem", fontSize: "1.1em", color: "#1e293b" }}>
            Q{qIndex + 1}. {q.text}
          </div>
          {q.options.map((opt, optIndex) => {
            const isSelected = answers[qIndex] === optIndex;
            const isCorrect = q.correctIndex === optIndex;
            return (
              <button
                type="button"
                key={optIndex}
                onClick={() => handleSelect(qIndex, optIndex)}
                disabled={submitted}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "14px 18px",
                  marginBottom: "10px",
                  borderRadius: "10px",
                  border: submitted 
                    ? isCorrect ? "3px solid #10b981" 
                    : isSelected ? "3px solid #ef4444" 
                    : "2px solid #d1d5db"
                    : isSelected ? "3px solid #3b82f6" 
                    : "2px solid #cbd5e1",
                  backgroundColor: submitted 
                    ? isCorrect ? "#d1fae5" 
                    : isSelected ? "#fee2e2" 
                    : "#f9fafb"
                    : isSelected ? "#dbeafe" 
                    : "#ffffff",
                  color: submitted && isSelected && !isCorrect ? "#dc2626" : "#1f2937",
                  cursor: submitted ? "not-allowed" : "pointer",
                  fontSize: "16px",
                  fontWeight: isSelected ? "600" : "500",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  textAlign: "left",
                  boxShadow: isSelected 
                    ? "0 4px 12px rgba(59, 130, 246, 0.4)" 
                    : "0 2px 4px rgba(0,0,0,0.05)"
                }}
                onMouseEnter={(e) => {
                  if (!submitted && !isSelected) {
                    e.currentTarget.style.backgroundColor = "#eff6ff";
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!submitted) {
                    e.currentTarget.style.backgroundColor = isSelected ? "#dbeafe" : "#ffffff";
                    e.currentTarget.style.transform = "translateY(0)";
                  }
                }}
              >
                <span style={{ 
                  display: "inline-block", 
                  width: "28px", 
                  fontSize: "18px", 
                  fontWeight: "700",
                  color: submitted && !isCorrect && isSelected ? "#dc2626" : "#3b82f6"
                }}>
                  {String.fromCharCode(65 + optIndex)}
                </span>
                <span style={{ marginLeft: "12px" }}>{opt}</span>
              </button>
            );
          })}
          {submitted && (
            <div style={{ 
              marginTop: "1rem", 
              padding: "0.8rem", 
              backgroundColor: "#ecfdf5", 
              border: "2px solid #10b981",
              borderRadius: "8px",
              fontSize: "15px",
              fontWeight: "600",
              color: "#065f46"
            }}>
              ✅ <strong>Correct Answer:</strong> {String.fromCharCode(65 + q.correctIndex)}. {q.options[q.correctIndex]}
            </div>
          )}
        </div>
      ))}

      <div style={{ 
        textAlign: "center", 
        padding: "2rem", 
        backgroundColor: "#f1f5f9", 
        borderRadius: "12px",
        marginTop: "2rem"
      }}>
        {!submitted ? (
          <button
            type="button"
            onClick={handleSubmit}
            style={{
              padding: "16px 32px",
              fontSize: "20px",
              fontWeight: "700",
              borderRadius: "12px",
              border: "none",
              backgroundColor: "#10b981",
              color: "white",
              cursor: "pointer",
              boxShadow: "0 8px 20px rgba(16, 185, 129, 0.4)",
              transition: "all 0.3s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 12px 24px rgba(16, 185, 129, 0.5)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 8px 20px rgba(16
