import React, { useState } from 'react';
import { ContentMode, SectionData } from '../types';
import { Activity, AlertCircle, ShieldCheck, BookOpen, Stethoscope } from 'lucide-react';

interface InfoCardProps {
  data: SectionData;
}

export const InfoCard: React.FC<InfoCardProps> = ({ data }) => {
  const [mode, setMode] = useState<ContentMode>(ContentMode.LITE);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Activity': return <Activity className="w-6 h-6" />;
      case 'AlertCircle': return <AlertCircle className="w-6 h-6" />;
      case 'ShieldCheck': return <ShieldCheck className="w-6 h-6" />;
      default: return <Activity className="w-6 h-6" />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-slate-100 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-slate-50 p-4 flex justify-between items-center border-b border-slate-100">
        <div className="flex items-center space-x-3 text-slate-700">
          <div className="p-2 bg-teal-100 text-teal-700 rounded-lg">
            {getIcon(data.icon)}
          </div>
          <h3 className="font-bold text-lg">{data.title}</h3>
        </div>
        
        {/* Toggle Switch */}
        <div className="flex bg-slate-200 p-1 rounded-lg relative">
          <div 
            className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-md shadow-sm transition-all duration-300 ${mode === ContentMode.LITE ? 'left-1' : 'left-[calc(50%)]'}`}
          ></div>
          <button
            onClick={() => setMode(ContentMode.LITE)}
            className={`relative z-10 px-3 py-1 text-xs font-medium rounded-md transition-colors duration-300 flex items-center gap-1 ${mode === ContentMode.LITE ? 'text-slate-800' : 'text-slate-500'}`}
          >
            <BookOpen size={12} /> 通俗
          </button>
          <button
            onClick={() => setMode(ContentMode.PRO)}
            className={`relative z-10 px-3 py-1 text-xs font-medium rounded-md transition-colors duration-300 flex items-center gap-1 ${mode === ContentMode.PRO ? 'text-slate-800' : 'text-slate-500'}`}
          >
            <Stethoscope size={12} /> 专业
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-grow bg-gradient-to-b from-white to-slate-50/50">
        <div className={`transition-opacity duration-500 ${mode === ContentMode.LITE ? 'opacity-100' : 'hidden opacity-0'}`}>
            <p className="text-slate-600 leading-relaxed text-base">
              {data.liteDescription}
            </p>
        </div>
         <div className={`transition-opacity duration-500 ${mode === ContentMode.PRO ? 'opacity-100' : 'hidden opacity-0'}`}>
            <p className="text-slate-700 leading-relaxed text-sm font-medium font-serif bg-amber-50/50 p-3 rounded border border-amber-100/50">
              {data.proDescription}
            </p>
        </div>
      </div>
    </div>
  );
};
