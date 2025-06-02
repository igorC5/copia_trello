import React, { useState } from 'react';
import { Trello, Plus, ChevronDown } from 'lucide-react';
import { useBoardStore } from '../store/boardStore';

export const Header: React.FC = () => {
  const { boards, activeBoard, setActiveBoard, createBoard, getActiveBoard } = useBoardStore();
  const [isCreatingBoard, setIsCreatingBoard] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState('');
  const [boardsMenuOpen, setBoardsMenuOpen] = useState(false);

  const currentBoard = getActiveBoard();

  const handleCreateBoard = () => {
    if (newBoardTitle.trim()) {
      createBoard(newBoardTitle.trim());
      setNewBoardTitle('');
      setIsCreatingBoard(false);
    }
  };

  return (
    <header className="bg-primary-700 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <Trello className="h-8 w-8 mr-2" />
            <h1 className="text-xl font-bold">TaskBoard</h1>
          </div>
          
          <div className="relative">
            <button
              className="flex items-center px-3 py-1 text-sm bg-primary-600 hover:bg-primary-800 rounded transition"
              onClick={() => setBoardsMenuOpen(!boardsMenuOpen)}
            >
              <span className="mr-2">{currentBoard?.title || 'Boards'}</span>
              <ChevronDown className="h-4 w-4" />
            </button>
            
            {boardsMenuOpen && (
              <div className="absolute top-full left-0 mt-1 w-64 bg-white text-gray-800 rounded shadow-lg z-10 animate-slide-in">
                <div className="py-2">
                  <h3 className="px-3 py-1 text-sm font-semibold text-gray-500">Your boards</h3>
                  <ul className="max-h-64 overflow-y-auto">
                    {boards.map((board) => (
                      <li key={board.id}>
                        <button
                          className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${
                            board.id === activeBoard ? 'bg-blue-50 text-primary-600 font-medium' : ''
                          }`}
                          onClick={() => {
                            setActiveBoard(board.id);
                            setBoardsMenuOpen(false);
                          }}
                        >
                          {board.title}
                        </button>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="border-t mt-2 pt-2">
                    {isCreatingBoard ? (
                      <div className="px-3 py-2">
                        <input
                          type="text"
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                          placeholder="Board title"
                          value={newBoardTitle}
                          onChange={(e) => setNewBoardTitle(e.target.value)}
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleCreateBoard();
                            if (e.key === 'Escape') setIsCreatingBoard(false);
                          }}
                        />
                        <div className="flex mt-2">
                          <button
                            className="px-3 py-1 text-sm bg-primary-500 text-white rounded hover:bg-primary-600"
                            onClick={handleCreateBoard}
                          >
                            Create
                          </button>
                          <button
                            className="px-3 py-1 text-sm ml-2"
                            onClick={() => setIsCreatingBoard(false)}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center text-primary-600"
                        onClick={() => setIsCreatingBoard(true)}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Create new board
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};