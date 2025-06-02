import React, { useState, useRef, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { MoreVertical, Plus, X, Palette } from 'lucide-react';
import { CardItem } from './CardItem';
import { Card } from '../types';
import { useBoardStore } from '../store/boardStore';

const COLORS = [
  '#f0f0f0',
  '#ffcdd2',
  '#f8bbd0',
  '#e1bee7',
  '#d1c4e9',
  '#c5cae9',
  '#bbdefb',
  '#b3e5fc',
  '#b2ebf2',
  '#b2dfdb',
  '#c8e6c9',
  '#dcedc8',
  '#f0f4c3',
  '#fff9c4',
  '#ffecb3',
  '#ffe0b2',
  '#ffccbc',
];

interface ListContainerProps {
  id: string;
  title: string;
  cards: Card[];
  boardId: string;
}

export const ListContainer: React.FC<ListContainerProps> = ({ id, title, cards, boardId }) => {
  const { createCard, updateListTitle, deleteList, updateListBackground } = useBoardStore();
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState('');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [listTitle, setListTitle] = useState(title);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
    data: {
      type: 'list',
    },
  });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
        setShowColorPicker(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const handleCreateCard = () => {
    if (newCardTitle.trim()) {
      createCard(boardId, id, newCardTitle.trim());
      setNewCardTitle('');
      setIsAddingCard(false);
    }
  };
  
  const handleUpdateTitle = () => {
    if (listTitle.trim()) {
      updateListTitle(boardId, id, listTitle.trim());
      setIsEditingTitle(false);
    }
  };
  
  const handleDeleteList = () => {
    if (confirm('Are you sure you want to delete this list and all its cards?')) {
      deleteList(boardId, id);
    }
  };

  const handleColorSelect = (color: string) => {
    updateListBackground(boardId, id, color);
    setShowColorPicker(false);
  };
  
  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="w-72 min-w-72 h-auto bg-gray-100 opacity-50 rounded-md p-3 mr-3"
      >
        <div className="h-8 bg-gray-300 rounded-md mb-2"></div>
        {cards.map((_, index) => (
          <div key={index} className="h-10 bg-gray-200 rounded-md mb-2"></div>
        ))}
      </div>
    );
  }
  
  return (
    <div
      ref={setNodeRef}
      style={style}
      className="w-72 min-w-72 flex-shrink-0 rounded-md shadow-sm max-h-full flex flex-col mr-3"
    >
      <div 
        className="p-2 flex justify-between items-center rounded-t-md" 
        style={{ backgroundColor: cards[0]?.backgroundColor || '#f0f0f0' }}
        {...attributes} 
        {...listeners}
      >
        {isEditingTitle ? (
          <input
            type="text"
            className="flex-grow px-2 py-1 text-sm border border-primary-300 rounded focus:outline-none focus:border-primary-500"
            value={listTitle}
            onChange={(e) => setListTitle(e.target.value)}
            autoFocus
            onBlur={handleUpdateTitle}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleUpdateTitle();
              if (e.key === 'Escape') {
                setIsEditingTitle(false);
                setListTitle(title);
              }
            }}
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <h3 
            className="font-medium text-gray-800 cursor-pointer px-2 py-1"
            onDoubleClick={() => setIsEditingTitle(true)}
          >
            {title}
          </h3>
        )}
        
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setShowDropdown(!showDropdown);
            }}
            className="p-1 text-gray-500 hover:text-gray-700 rounded hover:bg-gray-200"
          >
            <MoreVertical className="h-4 w-4" />
          </button>
          
          {showDropdown && (
            <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10 py-1 text-sm text-gray-700">
              <button 
                className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center"
                onClick={() => {
                  setShowColorPicker(true);
                  setShowDropdown(false);
                }}
              >
                <Palette className="h-4 w-4 mr-2" />
                Change color
              </button>
              <button 
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
                onClick={() => {
                  setIsEditingTitle(true);
                  setShowDropdown(false);
                }}
              >
                Rename list
              </button>
              <button 
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                onClick={handleDeleteList}
              >
                Delete list
              </button>
            </div>
          )}

          {showColorPicker && (
            <div className="absolute right-0 mt-1 p-2 bg-white rounded-md shadow-lg z-10">
              <div className="grid grid-cols-6 gap-1">
                {COLORS.map((color) => (
                  <button
                    key={color}
                    className="w-6 h-6 rounded-md border border-gray-200 hover:border-primary-500"
                    style={{ backgroundColor: color }}
                    onClick={() => handleColorSelect(color)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div 
        className="px-2 pb-2 flex-grow overflow-y-auto custom-scrollbar"
        style={{ backgroundColor: cards[0]?.backgroundColor || '#f0f0f0' }}
      >
        {cards.map((card) => (
          <CardItem 
            key={card.id} 
            card={card} 
            listId={id} 
            boardId={boardId}
          />
        ))}
        
        {isAddingCard ? (
          <div className="mt-2">
            <textarea
              className="w-full p-2 text-sm border border-gray-300 rounded resize-none focus:outline-none focus:border-primary-400"
              placeholder="Enter a title for this card..."
              value={newCardTitle}
              onChange={(e) => setNewCardTitle(e.target.value)}
              autoFocus
              rows={3}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleCreateCard();
                }
                if (e.key === 'Escape') {
                  setIsAddingCard(false);
                  setNewCardTitle('');
                }
              }}
            />
            <div className="flex mt-2">
              <button
                className="px-3 py-1 text-sm bg-primary-500 text-white rounded hover:bg-primary-600"
                onClick={handleCreateCard}
              >
                Add Card
              </button>
              <button
                className="p-1 ml-1 text-gray-500 hover:text-gray-700 rounded"
                onClick={() => {
                  setIsAddingCard(false);
                  setNewCardTitle('');
                }}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        ) : (
          <button
            className="mt-2 w-full p-2 text-sm text-gray-600 hover:bg-gray-200 rounded-md flex items-center"
            onClick={() => setIsAddingCard(true)}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add a card
          </button>
        )}
      </div>
    </div>
  );
};