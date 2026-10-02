
import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import { speakText } from '../services/speechService';

interface WordTileProps {
  word: string;
  onClick: () => void;
  disabled?: boolean;
  sourceArea?: 'bank' | 'sentence';
}

const WordTile: React.FC<WordTileProps> = ({ word, onClick, disabled, sourceArea = 'bank' }) => {
  const { isSoundEnabled } = useAppContext();
  
  const baseStyle = "min-h-12 min-w-11 px-3 py-2 m-1 rounded-lg shadow-sm cursor-pointer transition-all duration-200 ease-in-out text-lg font-medium transform active:scale-[.98]";
  
  let colorStyle = "bg-white text-slate-700 hover:bg-slate-100 border border-slate-300";
  if (sourceArea === 'sentence') {
    colorStyle = "bg-blue-100 text-blue-700 hover:bg-blue-200 border border-blue-300";
  }

  const handleClick = () => {
    if (!disabled) {
      if (isSoundEnabled) {
        speakText(word, 'en-US');
      }
      onClick();
    }
  };

  if (disabled) {
    return (
      <div className={`${baseStyle} ${colorStyle} opacity-50 cursor-not-allowed`}>
        {word}
      </div>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={`${baseStyle} ${colorStyle}`}
      disabled={disabled}
    >
      {word}
    </button>
  );
};

export default WordTile;
