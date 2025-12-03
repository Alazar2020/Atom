import React, { useState, useEffect, useCallback } from 'react';
import { AtomScene } from './components/AtomScene';
import { InfoPanel } from './components/InfoPanel';
import { fetchElementData } from './services/geminiService';
import { ElementInfo } from './types';
import { Search, Info, RotateCw } from 'lucide-react';

const INITIAL_ELEMENT = 'Carbon';

const App: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState(INITIAL_ELEMENT);
  const [currentElement, setCurrentElement] = useState<ElementInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [simulationSpeed, setSimulationSpeed] = useState(1);
  const [showUI, setShowUI] = useState(true);

  const loadElement = useCallback(async (name: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchElementData(name);
      setCurrentElement(data);
    } catch (err: any) {
        console.error(err);
      setError("Failed to fetch element data. Please try a valid element name (e.g., Gold, Oxygen).");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadElement(INITIAL_ELEMENT);
  }, [loadElement]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      loadElement(searchTerm);
    }
  };

  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden text-white">
      {/* Background Gradient to simulate environment 'vibe' */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none transition-colors duration-1000"
        style={{
            background: `radial-gradient(circle at center, ${
                currentElement?.category.includes('Noble') ? '#cc00ff' : 
                currentElement?.category.includes('Metal') ? '#00ccff' : 
                '#33ff88'
            } 0%, transparent 70%)`
        }}
      />

      {/* 3D Scene Layer */}
      <div className="absolute inset-0 z-0">
        <AtomScene 
            atomicNumber={currentElement?.atomicNumber || 6} 
            speed={simulationSpeed}
        />
      </div>

      {/* Header / Search Bar */}
      <div className={`absolute top-0 left-0 p-6 z-30 transition-opacity duration-300 ${showUI ? 'opacity-100' : 'opacity-0'}`}>
        <h1 className="text-3xl font-bold brand-font mb-4 text-white tracking-widest drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
            ATOM<span className="text-cyan-400">VIZ</span>
        </h1>
        
        <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative group">
                <input 
                    type="text" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Enter element..." 
                    className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg px-4 py-2 w-64 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                />
                <button 
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                    <Search size={18} />
                </button>
            </div>
        </form>

        {error && (
            <div className="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded text-red-200 text-sm max-w-xs">
                {error}
            </div>
        )}

        {/* Controls */}
        <div className="mt-6 space-y-4">
            <div>
                <label className="text-xs text-gray-400 uppercase tracking-wider mb-1 block">Simulation Speed</label>
                <input 
                    type="range" 
                    min="0.1" 
                    max="5" 
                    step="0.1" 
                    value={simulationSpeed}
                    onChange={(e) => setSimulationSpeed(parseFloat(e.target.value))}
                    className="w-64 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
            </div>
            
            <button 
                onClick={() => loadElement(currentElement?.name || INITIAL_ELEMENT)}
                className="flex items-center gap-2 text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
            >
                <RotateCw size={12} /> Refresh Data
            </button>
        </div>
      </div>

      {/* Info Panel */}
      <div className={`transition-opacity duration-500 ${showUI ? 'opacity-100' : 'opacity-0'}`}>
          <InfoPanel 
            data={currentElement} 
            loading={loading} 
          />
      </div>

      {/* Toggle UI Button */}
      <button 
        onClick={() => setShowUI(!showUI)}
        className="absolute bottom-6 left-6 z-30 p-2 bg-white/5 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors border border-white/10"
        title="Toggle Interface"
      >
        <Info size={24} />
      </button>

      {/* Footer / Attribution */}
      <div className="absolute bottom-6 right-6 z-10 text-xs text-gray-600 pointer-events-none">
        Powered by Google Gemini 2.5 Flash
      </div>
    </div>
  );
};

export default App;