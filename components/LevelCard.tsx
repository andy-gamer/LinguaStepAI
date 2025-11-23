import React from 'react';
import { Lock, Play, CheckCircle } from 'lucide-react';
import { LevelConfig } from '../types';

interface LevelCardProps {
  config: LevelConfig;
  onSelect: (id: number) => void;
}

export const LevelCard: React.FC<LevelCardProps> = ({ config, onSelect }) => {
  return (
    <div 
      onClick={() => !config.locked && onSelect(config.id)}
      className={`relative overflow-hidden rounded-2xl p-6 transition-all duration-300 border-2
        ${config.locked 
          ? 'bg-gray-50 border-gray-200 cursor-not-allowed opacity-75' 
          : 'bg-white border-transparent shadow-lg hover:shadow-xl hover:-translate-y-1 cursor-pointer ring-1 ring-black/5'
        }
      `}
    >
      <div className={`absolute top-0 right-0 p-4`}>
        {config.locked ? (
          <Lock className="w-6 h-6 text-gray-400" />
        ) : (
          <div className={`p-2 rounded-full bg-${config.color}-100`}>
             <Play className={`w-5 h-5 text-${config.color}-600 fill-current`} />
          </div>
        )}
      </div>

      <div className="mt-4">
        <h3 className={`text-xl font-bold ${config.locked ? 'text-gray-500' : 'text-gray-900'}`}>
          Level {config.id} {config.title}
        </h3>
        <p className="mt-2 text-sm text-gray-500">
          {config.description}
        </p>
      </div>

      <div className="mt-6 flex items-center gap-2">
        <span className={`text-xs font-semibold px-2 py-1 rounded-md ${config.locked ? 'bg-gray-200 text-gray-500' : `bg-${config.color}-100 text-${config.color}-700`}`}>
          Pass: {config.passingScore}%
        </span>
        {!config.locked && config.id > 1 && (
            <span className="text-xs flex items-center gap-1 text-green-600">
                <CheckCircle className="w-3 h-3" /> Unlocked
            </span>
        )}
      </div>
    </div>
  );
};