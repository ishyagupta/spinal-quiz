import React, { useMemo, useState } from "react";

type Question = {
  id: number;
  text: string;
  options: string[];
  correctIndex: number;
};

const questions: Question[] = [
  {
    id: 1,
    text: "The spinal cord begins at the level of the:",
    options: ["Foramen magnum", "Atlas", "C3 vertebra", "Medulla oblongata only"],
    correctIndex: 0,
  },
  {
    id: 2,
    text: "The spinal cord ends at the level of the:",
    options: ["Sacrum", "First and second lumbar vertebrae", "Coccyx", "T12 vertebra"],
    correctIndex: 1,
  },
  // ... include ALL questions here (unchanged)
  {
    id: 50,
    text:
      "During the withdrawal reflex of the leg, while flexor muscles contract to withdraw the foot, the extensor muscles are inhibited. This is an example of:",
    options: ["Convergence", "Divergence", "Reciprocal inhibition", "Summation"],
    correctIndex: 2,
  },
];

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function Home() {
  const [answers, setAnswers] = useState<(number | null)[]>(
    Array(questions.length).fill(null)
  );
  const [submitted, setSubmitted] = useState(false);

  const score = useMemo(() => {
    return answers.filter((ans, i) => ans === questions[i]?.correctIndex).length;
  }, [answers]);

  const attempted = useMemo(() => answers.filter((a) => a !== null).length, [answers]);

  const handleSelect = (qIndex: number, optionIndex: number) => {
    if (submitted) return;

    setAnswers((prev) => {
      const next = [...prev];
      next[qIndex] = optionIndex;
      return next;
    });
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const handleReset = () => {
    setAnswers(Array(questions.length).fill(null));
    setSubmitted(false);
  };

  const pageStyle: React.CSSProperties = {
    maxWidth: 900,
    margin: "0 auto",
    padding: "2rem 1rem",
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
    position: "relative",
    zIndex: 1, // helps if any background overlay exists
  };

  const cardStyle: React.CSSProperties = {
    border: "2px solid #e2e8f0",
    borderRadius: 12,
    padding: "1.5rem",
    marginBottom: "1.5rem",
    backgroundColor: "#f8fafc",
    boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
  };

  const optionButtonStyle = (params: {
    isSelected: boolean;
    isCorrect: boolean;
    submitted: boolean;
    isWrongSelected: boolean;
  }): React.CSSProperties => {
    const { isSelected, isCorrect, submitted, isWrongSelected } = params;

    const border = submitted
      ? isCorrect
        ? "3px solid #10b981"
        : isWrongSelected
        ? "3px solid #ef4444"
        : "2px solid #d1d5db"
      : isSelected
      ? "3px solid #3b82f6"
      : "2px solid #cbd5e1";

    const backgroundColor = submitted
      ? isCorrect
        ? "#d1fae5"
        : isWrongSelected
        ? "#fee2e2"
        : "#ffffff"
      : isSelected
      ? "#dbeafe"
      : "#ffffff";

    const color = submitted && isWrongSelected ? "#dc2626" : "#1f2937";

    return {
      display: "block",
      width: "100%",
      padding: "14px 18px",
      marginBottom: 10,
      borderRadius: 10,
      border,
      backgroundColor,
      color,
      cursor: submitted ? "not-allowed" : "pointer",
      fontSize: 16,
      fontWeight: isSelected ? 600 : 500,
      transition: "transform 120ms ease, box-shadow 120ms ease, background-color 120ms ease",
      textAlign: "left",
      boxShadow: isSelected ? "0 4px 12px rgba(59, 130, 246, 0.25)" : "0 2px 4px rgba(0,0,0,0.05)",
      outline: "none",
    };
  };

  const correctAnswerStyle: React.CSSProperties = {
    marginTop: "1rem",
    padding: "0.8rem",
    backgroundColor: "#ecfdf5",
    border: "2px solid #10b981",
    borderRadius: 8,
    fontSize: 15,
    fontWeight: 600,
    color: "#065f46",
  };

  const footerBoxStyle: React.CSSProperties = {
    textAlign: "center",
    padding: "2rem",
    backgroundColor: "#f1f5f9",
    borderRadius: 12,
    marginTop: "2rem",
  };

  const primaryButtonStyle: React.CSSProperties = {
    padding: "16px 32px",
    fontSize: 20,
    fontWeight: 700,
    borderRadius: 12,
    border: "none",
    backgroundColor: "#10b981",
    color: "white",
    cursor: "pointer",
    boxShadow: "0 8px 20px rgba(16, 185, 129, 0.35)",
  };

  const secondaryButtonStyle: React.CSSProperties = {
    padding: "14px 28px",
    fontSize: 18,
    fontWeight: 700,
    borderRadius: 12,
    border: "2px solid #334155",
    backgroundColor: "white",
    color: "#0f172a",
    cursor: "pointer",
  };

  // Optional. Helps confirm you are seeing the latest deployed bundle.
  const buildMarker = "build:2026-02-23-a";

  return (
    <div style={pageStyle}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <h1 style={{ textAlign: "left", color: "#1a365d", marginBottom: "0.25rem" }}>
          🧠 Spinal Cord & Reflex Quiz (Grade 12 Anatomy)
        </h1>
        <div style={{ fontSize: 12, color: "#94a3b8" }}>{buildMarker}</div>
      </div>

      <p style={{ color: "#666", marginBottom: "1.5rem" }}>
        Select one answer per question. Click <strong>Submit</strong> to see your score.
      </p>

      <div
        style={{
          marginBottom: "1.5rem",
          padding: "0.9rem 1rem",
          borderRadius: 10,
          background: "#eef2ff",
          border: "1px solid #c7d2fe",
          color: "#1e293b",
          fontWeight: 600,
        }}
      >
        Progress: {attempted}/{questions.length} attempted
      </div>

      {questions.map((q, qIndex) => (
        <div key={q.id} style={cardStyle}>
          <div style={{ fontWeight: 700, marginBottom: "1rem", fontSize: "1.1em", color: "#1e293b" }}>
            Q{qIndex + 1}. {q.text}
          </div>

          {Array.isArray(q.options) &&
            q.options.map((opt, optIndex) => {
              const isSelected = answers[qIndex] === optIndex;
              const isCorrect = q.correctIndex === optIndex;
              const isWrongSelected = submitted && isSelected && !isCorrect;

              return (
                <button
                  type="button"
                  key={optIndex}
                  onClick={() => handleSelect(qIndex, optIndex)}
                  disabled={submitted}
                  style={optionButtonStyle({ isSelected, isCorrect, submitted, isWrongSelected })}
                  aria-pressed={isSelected}
                >
                  <span
                    style={{
                      display: "inline-block",
                      width: 28,
                      fontSize: 18,
                      fontWeight: 800,
                      color: submitted && isWrongSelected ? "#dc2626" : "#3b82f6",
                    }}
                  >
                    {String.fromCharCode(65 + clamp(optIndex, 0, 25))}
                  </span>

                  <span style={{ marginLeft: 12 }}>{opt}</span>
                </button>
              );
            })}

          {submitted && (
            <div style={correctAnswerStyle}>
              ✅ <strong>Correct Answer:</strong> {String.fromCharCode(65 + q.correctIndex)}.{" "}
              {q.options?.[q.correctIndex]}
            </div>
          )}
        </div>
      ))}

      <div style={footerBoxStyle}>
        {!submitted ? (
          <>
            <button type="button" onClick={handleSubmit} style={primaryButtonStyle}>
              Submit Quiz
            </button>
            <div style={{ marginTop: 14, color: "#475569", fontWeight: 600 }}>
              Current score (so far): {score}/{questions.length}
            </div>
          </>
        ) : (
          <>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", marginBottom: 10 }}>
              🎉 Your Score: {score}/{questions.length}
            </div>
            <button type="button" onClick={handleReset} style={secondaryButtonStyle}>
              Try Again
            </button>
          </>
        )}
      </div>
    </div>
  );
}