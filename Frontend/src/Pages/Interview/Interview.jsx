import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import InterviewCamera from "../../Components/InterviewCamera/InterviewCamera";
import axios from "axios";
import toast from "react-hot-toast";
import { Loader2, CheckCircle } from "lucide-react";

const Interview = () => {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [cumulativeTranscript, setCumulativeTranscript] = useState("");
  
  const questions = [
    "1. Can you describe a challenging technical problem you solved recently and how you approached it?",
    "2. How do you ensure the quality and reliability of the code you write?",
    "3. Tell me about a time you had a disagreement with a team member on a technical decision. How did you resolve it?",
    "4. Describe your experience with testing frameworks and why they are important.",
    "5. How do you stay up to date with the latest industry trends and technologies?",
    "6. Explain a complex technical concept to a non-technical stakeholder.",
    "7. What is your approach to debugging an application when it fails in production?",
    "8. Tell me about a project where you had to quickly learn a new technology or tool.",
    "9. How do you review someone else's code? What specific things do you look out for?",
    "10. Can you share an experience where you had to meet a very tight deadline? How did you manage it?"
  ];

  const handleComplete = async (transcript) => {
    let currentInput = transcript;
    if (!currentInput || currentInput.trim().length === 0) {
      toast.error("Transcript is empty. Skipping this question...");
      currentInput = "[No response captured]";
    }

    const questionAsk = questions[currentQuestionIndex];
    const newCumulative = cumulativeTranscript + `\n\nQuestion: ${questionAsk}\nAnswer: ${currentInput}`;
    setCumulativeTranscript(newCumulative);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      await submitInterview(newCumulative);
    }
  };

  const submitInterview = async (finalTranscript) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const API_URL = import.meta.env.VITE_API_URL;
      
      const res = await axios.post(
        `${API_URL}/projects/applications/${applicationId}/submit-interview`,
        { transcript: finalTranscript },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        toast.success("Interview submitted successfully!");
        setSubmitted(true);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit interview");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#eff6ff 0%,#f5f3ff 50%,#fdf4ff 100%)" }}
           className="flex items-center justify-center px-4 py-10">
        <div className="bg-white p-12 rounded-3xl shadow-2xl border border-slate-100 text-center max-w-md w-full">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center"
               style={{ background: "linear-gradient(135deg,#2563eb,#7c3aed)" }}>
            <span className="text-4xl text-white">✓</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-800 mb-2">Interview Submitted!</h2>
          <p className="text-slate-500 mb-8">Your AI-evaluated interview responses have been recorded. The project creator will review your overall score.</p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => navigate("/my-applications")}
              className="px-6 py-2.5 rounded-xl text-white text-sm font-bold transition-opacity hover:opacity-90"
              style={{ background: "linear-gradient(135deg,#2563eb,#7c3aed)" }}>
              View My Applications →
            </button>
            <button onClick={() => navigate("/")}
              className="px-6 py-2.5 rounded-xl text-sm font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#eff6ff 0%,#f5f3ff 50%,#fdf4ff 100%)" }}
         className="flex flex-col items-center justify-center px-4 py-10">
      
      {/* Standalone Header */}
      <div className="w-full max-w-4xl mb-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div style={{ background: "linear-gradient(135deg,#2563eb 0%,#7c3aed 60%,#a21caf 100%)" }} className="px-8 py-6 text-center">
            <span className="text-3xl font-extrabold text-white tracking-tight">Connect<span style={{ color: "#c4b5fd" }}>Sphere</span></span>
            <p className="text-indigo-100 text-sm mt-1 font-medium">AI Video Interview Portal</p>
          </div>
          <div style={{ background: "linear-gradient(90deg,#eff6ff,#f5f3ff)", borderBottom: "1px solid #e0e7ff" }}
               className="px-8 py-4 text-center">
            <p className="text-sm font-bold text-slate-700">Question {currentQuestionIndex + 1} of {questions.length}</p>
          </div>
        </div>
      </div>

      <div className="w-full max-w-4xl">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-20 bg-white rounded-3xl shadow-2xl border border-slate-100">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center"
                 style={{ background: "linear-gradient(135deg,#2563eb,#7c3aed)" }}>
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
            <p className="text-lg font-bold text-slate-700">Evaluating your responses...</p>
            <p className="text-sm text-slate-500 mt-2">Our AI is analyzing your full transcript. This may take a moment.</p>
          </div>
        ) : (
          <InterviewCamera 
            key={currentQuestionIndex}
            question={questions[currentQuestionIndex]} 
            onComplete={handleComplete} 
          />
        )}
      </div>
    </div>
  );
};

export default Interview;
