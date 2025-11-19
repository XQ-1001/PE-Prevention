import React, { useState, useEffect, useCallback } from 'react';
import { generateQuizQuestions } from '../services/geminiService';
import { FALLBACK_QUESTIONS } from '../constants';
import { QuizQuestion } from '../types';
import { CheckCircle2, XCircle, BrainCircuit, RotateCcw, Loader2 } from 'lucide-react';

export const QuizSection: React.FC = () => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [useFallback, setUseFallback] = useState(false);

  const loadQuestions = useCallback(async () => {
    setLoading(true);
    setCompleted(false);
    setCurrentIndex(0);
    setScore(0);
    setSelectedOption(null);
    setShowExplanation(false);

    try {
      const fetchedQuestions = await generateQuizQuestions();
      setQuestions(fetchedQuestions);
      setUseFallback(false);
    } catch (error) {
      console.warn("Using fallback questions due to API error or missing key.");
      setQuestions(FALLBACK_QUESTIONS);
      setUseFallback(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initial load
    // We don't auto-load AI questions to save tokens on mount, only when user interacts or uses fallback initially? 
    // Let's load fallback first for instant UI, then offer AI generation.
    setQuestions(FALLBACK_QUESTIONS);
    setUseFallback(true);
  }, []);

  const handleOptionSelect = (index: number) => {
    if (showExplanation) return; // Prevent changing answer
    setSelectedOption(index);
    setShowExplanation(true);
    if (index === questions[currentIndex].correctAnswerIndex) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      setCompleted(true);
    }
  };

  if (questions.length === 0 && !loading) return null;

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-blue-600 p-6 text-white flex justify-between items-center">
        <div className="flex items-center gap-2">
          <BrainCircuit className="w-6 h-6" />
          <h2 className="text-xl font-bold">知识自测</h2>
        </div>
        {!completed && !loading && (
           <div className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
             问题 {currentIndex + 1} / {questions.length}
           </div>
        )}
      </div>

      <div className="p-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-500">
            <Loader2 className="w-10 h-10 animate-spin mb-4 text-teal-600" />
            <p>正在生成新的医学测试题...</p>
          </div>
        ) : completed ? (
          <div className="text-center py-8">
            <div className="mb-6">
               <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-slate-100 mb-4">
                 <span className={`text-4xl font-bold ${score === questions.length ? 'text-green-600' : 'text-teal-600'}`}>
                   {score}/{questions.length}
                 </span>
               </div>
               <h3 className="text-2xl font-bold text-slate-800 mb-2">测试完成!</h3>
               <p className="text-slate-600">
                 {score === questions.length ? '太棒了！您掌握了预防 PE 的关键知识。' : '继续加油，多了解一些能够救命的知识。'}
               </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => {
                    setQuestions(FALLBACK_QUESTIONS);
                    setUseFallback(true);
                    setCompleted(false);
                    setCurrentIndex(0);
                    setScore(0);
                    setSelectedOption(null);
                    setShowExplanation(false);
                }}
                className="px-6 py-2 rounded-lg bg-slate-100 text-slate-700 font-medium hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
              >
                <RotateCcw size={18} /> 重做当前题目
              </button>
              {process.env.API_KEY && (
                <button 
                    onClick={loadQuestions}
                    className="px-6 py-2 rounded-lg bg-teal-600 text-white font-medium hover:bg-teal-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-teal-200"
                >
                    <BrainCircuit size={18} /> AI 生成新题
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
             <h3 className="text-lg font-semibold text-slate-800 leading-relaxed">
               {questions[currentIndex].question}
             </h3>

             <div className="space-y-3">
               {questions[currentIndex].options.map((option, index) => {
                 let btnClass = "w-full p-4 text-left rounded-xl border-2 transition-all duration-200 flex justify-between items-center ";
                 
                 if (selectedOption === null) {
                   btnClass += "border-slate-100 hover:border-teal-200 hover:bg-teal-50 text-slate-600";
                 } else {
                   if (index === questions[currentIndex].correctAnswerIndex) {
                     btnClass += "border-green-500 bg-green-50 text-green-800"; // Correct
                   } else if (index === selectedOption) {
                     btnClass += "border-red-400 bg-red-50 text-red-800"; // Wrong selected
                   } else {
                     btnClass += "border-slate-100 text-slate-400 opacity-50"; // Others
                   }
                 }

                 return (
                   <button 
                     key={index}
                     disabled={selectedOption !== null}
                     onClick={() => handleOptionSelect(index)}
                     className={btnClass}
                   >
                     <span>{option}</span>
                     {selectedOption !== null && index === questions[currentIndex].correctAnswerIndex && (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                     )}
                     {selectedOption !== null && index === selectedOption && index !== questions[currentIndex].correctAnswerIndex && (
                        <XCircle className="w-5 h-5 text-red-500" />
                     )}
                   </button>
                 )
               })}
             </div>

             {showExplanation && (
               <div className="mt-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                 <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-blue-900 text-sm">
                   <span className="font-bold block mb-1 text-blue-700">解析：</span>
                   {questions[currentIndex].explanation}
                 </div>
                 <div className="mt-4 flex justify-end">
                   <button 
                     onClick={handleNext}
                     className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium"
                   >
                     {currentIndex < questions.length - 1 ? '下一题' : '查看结果'}
                   </button>
                 </div>
               </div>
             )}
          </div>
        )}
      </div>
    </div>
  );
};
