import React, { useState } from 'react';
import { Settings } from 'lucide-react';
import { useBoardStore } from '../store/boardStore';

interface BoardHeaderProps {
  boardId: string;
  title: string;
  onOpenSettings: () => void;
}

export const BoardHeader: React.FC<BoardHeaderProps> = ({ 
  boardId, 
  title, 
  onOpenSettings 
}) => {
  const { updateBoardTitle } = useBoardStore();
  const [isEditing, setIsEditing] = useState(false);
  const [boardTitle, setBoardTitle] = useState(title);

  const handleUpdateTitle = () => {
    if (boardTitle.trim() && boardTitle !== title) {
      updateBoardTitle(boardId, boardTitle.trim());
    } else {
      setBoardTitle(title);
    }
    setIsEditing(false);
  };

  return (
    <div className="px-4 py-3 flex justify-between items-center bg-black/10">
      {isEditing ? (
        <div>
          <input
            type="text"
            className="px-2 py-1 text-white bg-black/20 rounded border border-white/30 font-bold text-lg focus:outline-none"
            value={boardTitle}
            onChange={(e) => setBoardTitle(e.target.value)}
            autoFocus
            onBlur={handleUpdateTitle}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleUpdateTitle();
              if (e.key === 'Escape') {
                setIsEditing(false);
                setBoardTitle(title);
              }
            }}
          />
        </div>
      ) : (
        <h2 
          className="text-white font-bold text-lg shadow-sm cursor-pointer" 
          onClick={() => setIsEditing(true)}
        >
          {title}
        </h2>
      )}

      <button 
        className="p-1.5 text-white hover:bg-white/20 rounded-md transition-colors"
        onClick={onOpenSettings}
      >
        <Settings className="h-5 w-5" />
      </button>
    </div>
  );
};