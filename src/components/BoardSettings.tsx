import React from 'react';
import { X, Trash } from 'lucide-react';
import { useBoardStore } from '../store/boardStore';

const BACKGROUND_COLORS = [
  '#0079bf', // Blue
  '#d29034', // Orange
  '#519839', // Green
  '#b04632', // Red
  '#89609e', // Purple
  '#cd5a91', // Pink
  '#4bbf6b', // Light Green
  '#00aecc', // Teal
  '#838c91', // Gray
];

interface BoardSettingsProps {
  boardId: string;
  onClose: () => void;
}

export const BoardSettings: React.FC<BoardSettingsProps> = ({ boardId, onClose }) => {
  const { getActiveBoard, updateBoardBackground, deleteBoard } = useBoardStore();
  const board = getActiveBoard();

  if (!board) return null;

  const handleDeleteBoard = () => {
    if (confirm('Are you sure you want to permanently delete this board?')) {
      deleteBoard(boardId);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-medium">Configurações do quadro</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-4">
          <h4 className="font-medium mb-2">Background</h4>
          <div className="grid grid-cols-3 gap-2 mb-6">
            {BACKGROUND_COLORS.map((color) => (
              <button
                key={color}
                className={`h-12 w-full rounded ${
                  board.backgroundColor === color ? 'ring-2 ring-offset-2 ring-primary-500' : ''
                }`}
                style={{ backgroundColor: color }}
                onClick={() => updateBoardBackground(boardId, color)}
              />
            ))}
          </div>
          
          <div className="border-t pt-4">
            <h4 className="font-medium text-red-600 mb-2">Cuidado</h4>
            <button
              className="flex items-center px-3 py-2 bg-red-50 text-red-700 hover:bg-red-100 rounded transition-colors"
              onClick={handleDeleteBoard}
            >
              <Trash className="h-4 w-4 mr-2" />
              Deletar Quadro
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};