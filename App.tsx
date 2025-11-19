import React, { useState } from 'react';
import { MedicalVisualization } from './components/MedicalVisualization';
import { InfoCard } from './components/InfoCard';
import { QuizSection } from './components/QuizSection';
import { EDUCATIONAL_CONTENT } from './constants';
import { HeartPulse, ChevronDown, Share2, Check, X } from 'lucide-react';

const App: React.FC = () => {
  const [showToast, setShowToast] = useState(false);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Toast Notification */}
      <div 
        className={`fixed top-24 right-4 z-[60] bg-slate-800 text-white px-4 py-3 rounded-lg shadow-xl transform transition-all duration-300 flex items-center gap-3 ${showToast ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0 pointer-events-none'}`}
      >
        <div className="bg-green-500 rounded-full p-1">
          <Check size={14} strokeWidth={3} />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium">链接已复制！</p>
          <p className="text-xs text-slate-400">快去分享给身边的朋友吧</p>
        </div>
        <button onClick={() => setShowToast(false)} className="text-slate-400 hover:text-white">
          <X size={16} />
        </button>
      </div>

      {/* Navigation/Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-teal-500 to-blue-600 p-2 rounded-lg text-white">
              <HeartPulse size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800 tracking-tight">PulmoGuard</h1>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">肺栓塞预防科普</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex space-x-8 text-sm font-medium text-slate-600">
              <a href="#visualization" className="hover:text-teal-600 transition-colors">3D 演示</a>
              <a href="#learn" className="hover:text-teal-600 transition-colors">科普知识</a>
              <a href="#quiz" className="hover:text-teal-600 transition-colors">知识自测</a>
            </nav>
            
            <button 
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium transition-colors group"
              title="分享此页面"
            >
              <Share2 size={16} className="group-hover:text-teal-600 transition-colors" />
              <span className="hidden sm:inline">分享</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-slate-900 text-white pt-20 pb-32 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-1/2 -right-1/2 w-[1000px] h-[1000px] bg-teal-900/30 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-1/2 -left-1/2 w-[800px] h-[800px] bg-blue-900/20 rounded-full blur-3xl"></div>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300">
                别让“沉默的杀手”靠近你
              </h1>
              <p className="text-lg text-slate-400 mb-8 leading-relaxed">
                肺动脉栓塞 (PE) 是一种严重但可预防的疾病。了解其成因、识别症状，掌握预防方法，保护您和家人的心肺健康。
              </p>
              <a 
                href="#visualization" 
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-teal-500 text-white font-semibold hover:bg-teal-400 transition-colors shadow-lg shadow-teal-900/50"
              >
                开始探索 <ChevronDown size={18} />
              </a>
            </div>
          </div>
        </section>

        {/* 3D Visualization Section */}
        <section id="visualization" className="relative -mt-24 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
             <div className="bg-slate-800 p-1 rounded-2xl shadow-2xl ring-1 ring-white/10">
                <MedicalVisualization />
             </div>
             <div className="mt-4 text-center text-sm text-slate-500">
               * 该模型为简化示意图，仅供科普演示
             </div>
          </div>
        </section>

        {/* Educational Content Grid */}
        <section id="learn" className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">核心知识点</h2>
              <p className="text-slate-600">切换卡片模式，选择适合您的阅读深度</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {EDUCATIONAL_CONTENT.map((section) => (
                <InfoCard key={section.id} data={section} />
              ))}
            </div>
          </div>
        </section>

        {/* Quiz Section */}
        <section id="quiz" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">挑战自我</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                通过互动测试巩固您的学习成果。题目由医疗知识库或 AI 实时生成。
              </p>
            </div>
            <QuizSection />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4 text-slate-200">
            <HeartPulse size={20} />
            <span className="font-bold text-lg">PulmoGuard</span>
          </div>
          <p className="text-sm mb-8">
            Designed for Medical Education Awareness
          </p>
          <div className="text-xs text-slate-500 max-w-2xl mx-auto border-t border-slate-800 pt-8">
            <p className="mb-2 font-bold text-slate-400">免责声明</p>
            <p>
              本网站内容仅供科普教育参考，不能替代专业医疗建议、诊断或治疗。如出现胸痛、呼吸困难等疑似症状，请立即就医。AI 生成的内容可能存在误差，请以医生建议为准。
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;