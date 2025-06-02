import React, { useState } from 'react';
import { DndContext, DragOverlay, closestCorners, PointerSensor, useSensor, useSensors, DragStartEvent, DragOverEvent, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import { ListContainer } from './ListContainer';
import { CardItem } from './CardItem';
import { BoardHeader } from './BoardHeader';
import { BoardSettings } from './BoardSettings';
import { useBoardStore } from '../store/boardStore';

export const Board: React.FC = () => {
  const { 
    getActiveBoard,
    createList, 
    moveList, 
    moveCard
  } = useBoardStore();
  
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeData, setActiveData] = useState<any>(null);
  const [isAddingList, setIsAddingList] = useState(false);
  const [newListTitle, setNewListTitle] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  
  const board = getActiveBoard();
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );
  
  if (!board) {
    return <div className="p-8">No active board found.</div>;
  }
  
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
    setActiveData(event.active.data.current);
  };
  
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    
    if (!over) return;
    
    const activeId = active.id;
    const overId = over.id;
    
    if (activeId === overId) return;
    
    const activeData = active.data.current;
    const isActiveACard = activeData?.type === 'card';
    
    if (!isActiveACard) return;
    
    const activeListId = activeData.listId;
    
    // Find the list that contains the over element
    let overListId = overId;
    
    // If over element is a card, get its list id
    if (over.data.current?.type === 'card') {
      overListId = over.data.current.listId;
    }
    
    if (activeListId !== overListId) {
      const activeIndex = board.lists
        .find((list) => list.id === activeListId)
        ?.cards.findIndex((card) => card.id === activeId) || 0;
      
      const overList = board.lists.find((list) => list.id === overListId);
      
      if (!overList) return;
      
      // If over is a card, insert at its position, otherwise append
      let overIndex = 0;
      
      if (over.data.current?.type === 'card') {
        overIndex = overList.cards.findIndex((card) => card.id === overId);
      } else {
        overIndex = overList.cards.length;
      }
      
      moveCard(board.id, activeListId, overListId, activeIndex, overIndex);
    }
  };
  
  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    setActiveData(null);
    
    const { active, over } = event;
    
    if (!over) return;
    
    const activeId = active.id;
    const overId = over.id;
    
    if (activeId === overId) return;
    
    const activeData = active.data.current;
    
    if (activeData?.type === 'list') {
      const activeIndex = board.lists.findIndex((list) => list.id === activeId);
      const overIndex = board.lists.findIndex((list) => list.id === overId);
      
      if (activeIndex !== -1 && overIndex !== -1) {
        moveList(board.id, activeIndex, overIndex);
      }
    }
    
    if (activeData?.type === 'card') {
      const activeListId = activeData.listId;
      
      if (over.data.current?.type === 'card') {
        const overListId = over.data.current.listId;
        
        if (activeListId === overListId) {
          const listIndex = board.lists.findIndex((list) => list.id === activeListId);
          
          if (listIndex === -1) return;
          
          const activeIndex = board.lists[listIndex].cards.findIndex(
            (card) => card.id === activeId
          );
          const overIndex = board.lists[listIndex].cards.findIndex(
            (card) => card.id === overId
          );
          
          if (activeIndex !== -1 && overIndex !== -1) {
            moveCard(
              board.id,
              activeListId,
              overListId,
              activeIndex,
              overIndex
            );
          }
        }
      }
    }
  };
  
  const handleCreateList = () => {
    if (newListTitle.trim()) {
      createList(board.id, newListTitle.trim());
      setNewListTitle('');
      setIsAddingList(false);
    }
  };
  
  const renderDragOverlay = () => {
    if (!activeId || !activeData) return null;
    
    if (activeData.type === 'card') {
      const cardList = board.lists.find((list) => list.id === activeData.listId);
      if (!cardList) return null;
      
      const card = cardList.cards.find((c) => c.id === activeId);
      if (!card) return null;
      
      return (
        <CardItem 
          card={card} 
          listId={activeData.listId} 
          boardId={board.id} 
        />
      );
    }
    
    return null;
  };
  
  return (
    <div 
      className="flex flex-col h-full"
      style={{ backgroundColor: board.backgroundColor || '#0079bf' }}
    >
      <BoardHeader 
        boardId={board.id} 
        title={board.title} 
        onOpenSettings={() => setShowSettings(true)} 
      />
      
      <div className="flex-grow p-4 overflow-x-auto custom-scrollbar">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="flex h-full items-start">
            <SortableContext 
              items={board.lists.map((list) => list.id)}
              strategy={horizontalListSortingStrategy}
            >
              {board.lists.map((list) => (
                <ListContainer
                  key={list.id}
                  id={list.id}
                  title={list.title}
                  cards={list.cards}
                  boardId={board.id}
                />
              ))}
            </SortableContext>
            
            {isAddingList ? (
              <div className="bg-gray-100 rounded-md p-2 shadow-sm w-72 flex-shrink-0">
                <input
                  type="text"
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-primary-500"
                  placeholder="Digite o titulo da lista..."
                  value={newListTitle}
                  onChange={(e) => setNewListTitle(e.target.value)}
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleCreateList();
                    if (e.key === 'Escape') {
                      setIsAddingList(false);
                      setNewListTitle('');
                    }
                  }}
                />
                <div className="flex mt-2">
                  <button
                    className="px-3 py-1 text-sm bg-primary-500 text-white rounded hover:bg-primary-600"
                    onClick={handleCreateList}
                  >
                    Adicionar
                  </button>
                  <button
                    className="px-3 py-1 text-sm ml-2"
                    onClick={() => {
                      setIsAddingList(false);
                      setNewListTitle('');
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <button
                className="bg-white/20 hover:bg-white/30 transition-colors text-white w-72 h-10 rounded-md flex items-center justify-center flex-shrink-0"
                onClick={() => setIsAddingList(true)}
              >
                <Plus className="h-5 w-5 mr-1" />
                Adicionar lista
              </button>
            )}
          </div>
          
          <DragOverlay>{renderDragOverlay()}</DragOverlay>
        </DndContext>
      </div>
      
      {showSettings && (
        <BoardSettings 
          boardId={board.id} 
          onClose={() => setShowSettings(false)} 
        />
      )}
    </div>
  );
};