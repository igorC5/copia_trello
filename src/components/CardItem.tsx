import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Pencil, Trash, X, Palette } from 'lucide-react';
import { Card as CardType, Label } from '../types';
import { useBoardStore } from '../store/boardStore';

const COLORS = [
  '#ffffff',
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

interface CardItemProps {
  card: CardType;
  listId: string;
  boardId: string;
  onClick?: () => void;
}

export const CardItem: React.FC<CardItemProps> = ({ card, listId, boardId, onClick }) => {
  const { updateCard, deleteCard, updateCardBackground } = useBoardStore();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(card.title);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: card.id,
    data: {
      type: 'card',
      card,
      listId,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    backgroundColor: card.backgroundColor || '#ffffff',
  };

  const handleSaveTitle = () => {
    if (title.trim()) {
      updateCard(boardId, listId, card.id, { title: title.trim() });
      setIsEditing(false);
    }
  };

  const handleDeleteCard = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this card?')) {
      deleteCard(boardId, listId, card.id);
    }
  };

  const handleColorSelect = (color: string, e: React.MouseEvent) => {
    e.stopPropagation();
    updateCardBackground(boardId, listId, card.id, color);
    setShowColorPicker(false);
  };

  if (isEditing) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="rounded-md shadow-sm p-3 mb-2 cursor-pointer hover:shadow-md transition-shadow"
        onClick={(e) => e.stopPropagation()}
      >
        <textarea
          className="w-full p-1 text-sm border border-primary-200 rounded resize-none focus:outline-none focus:border-primary-400"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
          rows={2}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSaveTitle();
            }
            if (e.key === 'Escape') {
              setIsEditing(false);
              setTitle(card.title);
            }
          }}
        />
        <div className="flex justify-end mt-2 space-x-1">
          <button
            className="text-xs px-2 py-1 bg-primary-500 text-white rounded hover:bg-primary-600"
            onClick={handleSaveTitle}
          >
            Save
          </button>
          <button
            className="text-xs px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
            onClick={() => {
              setIsEditing(false);
              setTitle(card.title);
            }}
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="rounded-md shadow-sm p-3 mb-2 cursor-pointer hover:shadow-md transition-shadow group relative"
      onClick={onClick}
    >
      {card.labels.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {card.labels.map((label: Label) => (
            <span
              key={label.id}
              className="inline-block h-2 w-8 rounded-sm"
              style={{ backgroundColor: label.color }}
              title={label.name}
            />
          ))}
        </div>
      )}
      <p className="text-sm text-gray-800 break-words">{card.title}</p>
      <div className="mt-2 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          className="text-gray-500 hover:text-gray-700 mr-1"
          onClick={(e) => {
            e.stopPropagation();
            setShowColorPicker(!showColorPicker);
          }}
        >
          <Palette className="h-3.5 w-3.5" />
        </button>
        <button
          className="text-gray-500 hover:text-gray-700 mr-1"
          onClick={(e) => {
            e.stopPropagation();
            setIsEditing(true);
          }}
        >
          <Pencil className="h-3.5 w-3.5" />
        </button>
        <button
          className="text-gray-500 hover:text-red-600"
          onClick={handleDeleteCard}
        >
          <Trash className="h-3.5 w-3.5" />
        </button>
      </div>
      
      {showColorPicker && (
        <div 
          className="absolute right-0 bottom-full mb-2 p-2 bg-white rounded-md shadow-lg z-10"
          onClick={e => e.stopPropagation()}
        >
          <div className="grid grid-cols-6 gap-1">
            {COLORS.map((color) => (
              <button
                key={color}
                className="w-6 h-6 rounded-md border border-gray-200 hover:border-primary-500"
                style={{ backgroundColor: color }}
                onClick={(e) => handleColorSelect(color, e)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};