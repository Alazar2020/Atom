import React from 'react';
import { ElementInfo } from '../types';
import { Atom, Wind, Beaker, Zap, Quote } from 'lucide-react';

interface InfoPanelProps {
  data: ElementInfo | null;
  loading: boolean;
  onClose?: () => void;
}

export const InfoPanel: React.FC<InfoPanelProps> = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="absolute top-20 right-4 w-full max-w-md p-6 bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl animate-pulse z-20">
        <div className="h-6 bg-white/10 rounded w-1/2 mb-4"></div>
        <div className="h-4 bg-white/10 rounded w-full mb-2"></div>
        <div className="h-4 bg-white/10 rounded w-3/4 mb-4"></div>
        <div className="h-24 bg-white/10 rounded w-full"></div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="absolute top-4 md:top-20 right-4 w-full md:max-w-md max-h-[80vh] overflow-y-auto p-6 bg-slate-900/80 backdrop-blur-xl border border-cyan-500/30 rounded-xl text-white shadow-2xl shadow-cyan-900/20 z-20 scrollbar-thin scrollbar-thumb-cyan-500/50 scrollbar-track-transparent">
      
      <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
        <div>
            <h2 className="text-4xl font-bold brand-font text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
            {data.name}
            </h2>
            <div className="flex items-center gap-2 mt-1">
                <span className="text-xl font-mono text-cyan-300 border border-cyan-500/50 px-2 rounded">{data.symbol}</span>
                <span className="text-sm text-gray-400 bg-white/5 px-2 py-1 rounded">{data.category}</span>
            </div>
        </div>
        <div className="text-right">
            <div className="text-5xl font-bold text-white/10 select-none brand-font">{data.atomicNumber}</div>
            <div className="text-xs text-gray-400">{data.atomicMass.toFixed(3)} u</div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Description */}
        <div className="space-y-2">
            <h3 className="flex items-center gap-2 text-cyan-400 font-semibold text-sm uppercase tracking-wider">
                <Atom size={16} /> Overview
            </h3>
            <p className="text-gray-300 leading-relaxed text-sm">
                {data.description}
            </p>
        </div>

        {/* Environment Info - Critical Request */}
        <div className="p-4 rounded-lg bg-emerald-900/20 border border-emerald-500/30">
             <h3 className="flex items-center gap-2 text-emerald-400 font-semibold text-sm uppercase tracking-wider mb-2">
                <Wind size={16} /> Environment & Occurrence
            </h3>
            <p className="text-emerald-100/80 text-sm leading-relaxed">
                {data.environmentInfo}
            </p>
        </div>

        {/* Common Uses */}
        <div className="space-y-2">
             <h3 className="flex items-center gap-2 text-purple-400 font-semibold text-sm uppercase tracking-wider">
                <Beaker size={16} /> Common Uses
            </h3>
            <div className="flex flex-wrap gap-2">
                {data.commonUses.map((use, idx) => (
                    <span key={idx} className="text-xs bg-purple-500/10 text-purple-200 border border-purple-500/20 px-3 py-1 rounded-full">
                        {use}
                    </span>
                ))}
            </div>
        </div>

        {/* Fun Fact */}
        <div className="p-4 rounded-lg bg-yellow-900/10 border border-yellow-500/20 relative overflow-hidden">
             <div className="absolute -right-2 -top-2 opacity-10">
                <Quote size={64} />
             </div>
             <h3 className="flex items-center gap-2 text-yellow-400 font-semibold text-sm uppercase tracking-wider mb-2 relative z-10">
                <Zap size={16} /> Fun Fact
            </h3>
            <p className="text-yellow-100/80 text-sm italic relative z-10">
                "{data.funFact}"
            </p>
        </div>
      </div>
    </div>
  );
};