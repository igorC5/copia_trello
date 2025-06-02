import { create } from 'zustand';
import { nanoid } from 'nanoid';
import { persist } from 'zustand/middleware';
import { Board, Card, Label, StoreState } from '../types';

const getDefaultBoard = (): Board => ({
  id: nanoid(),
  title: 'Meu primeiro quadro',
  lists: [
    {
      id: nanoid(),
      title: 'To Do',
      cards: [
        {
          id: nanoid(),
          title: 'Learn drag and drop',
          description: 'Study how to implement drag and drop in React',
          labels: [{ id: nanoid(), name: 'Learning', color: '#3B82F6' }],
          createdAt: new Date(),
        },
        {
          id: nanoid(),
          title: 'Create project structure',
          labels: [],
          createdAt: new Date(),
        },
      ],
    },
    {
      id: nanoid(),
      title: 'In Progress',
      cards: [
        {
          id: nanoid(),
          title: 'Build UI components',
          description: 'Create reusable components for the app',
          labels: [{ id: nanoid(), name: 'UI', color: '#0EA5E9' }],
          createdAt: new Date(),
        },
      ],
    },
    {
      id: nanoid(),
      title: 'Done',
      cards: [],
    },
  ],
  backgroundColor: '#0079bf',
});

export const useBoardStore = create<StoreState>()(
  persist(
    (set, get) => ({
      boards: [getDefaultBoard()],
      activeBoard: getDefaultBoard().id,
      
      setActiveBoard: (id) => set({ activeBoard: id }),
      
      getActiveBoard: () => {
        const state = get();
        return state.boards.find((board) => board.id === state.activeBoard);
      },
      
      createBoard: (title) => {
        const newBoard: Board = {
          id: nanoid(),
          title,
          lists: [
            {
              id: nanoid(),
              title: 'To Do',
              cards: [],
            },
            {
              id: nanoid(),
              title: 'In Progress',
              cards: [],
            },
            {
              id: nanoid(),
              title: 'Done',
              cards: [],
            },
          ],
          backgroundColor: '#0079bf',
        };
        
        set((state) => ({
          boards: [...state.boards, newBoard],
          activeBoard: newBoard.id,
        }));
      },
      
      updateBoardTitle: (id, title) =>
        set((state) => ({
          boards: state.boards.map((board) =>
            board.id === id ? { ...board, title } : board
          ),
        })),
      
      updateBoardBackground: (id, color) =>
        set((state) => ({
          boards: state.boards.map((board) =>
            board.id === id ? { ...board, backgroundColor: color } : board
          ),
        })),
      
      deleteBoard: (id) => {
        const state = get();
        const updatedBoards = state.boards.filter((board) => board.id !== id);
        const newActiveBoard = updatedBoards.length > 0 ? updatedBoards[0].id : null;
        
        set({
          boards: updatedBoards,
          activeBoard: newActiveBoard,
        });
      },
      
      createList: (boardId, title) =>
        set((state) => ({
          boards: state.boards.map((board) => {
            if (board.id !== boardId) return board;
            
            return {
              ...board,
              lists: [
                ...board.lists,
                {
                  id: nanoid(),
                  title,
                  cards: [],
                },
              ],
            };
          }),
        })),
      
      updateListTitle: (boardId, listId, title) =>
        set((state) => ({
          boards: state.boards.map((board) => {
            if (board.id !== boardId) return board;
            
            return {
              ...board,
              lists: board.lists.map((list) =>
                list.id === listId ? { ...list, title } : list
              ),
            };
          }),
        })),

      updateListBackground: (boardId, listId, color) =>
        set((state) => ({
          boards: state.boards.map((board) => {
            if (board.id !== boardId) return board;
            
            return {
              ...board,
              lists: board.lists.map((list) =>
                list.id === listId ? { ...list, backgroundColor: color } : list
              ),
            };
          }),
        })),
      
      deleteList: (boardId, listId) =>
        set((state) => ({
          boards: state.boards.map((board) => {
            if (board.id !== boardId) return board;
            
            return {
              ...board,
              lists: board.lists.filter((list) => list.id !== listId),
            };
          }),
        })),
      
      moveList: (boardId, sourceIndex, destinationIndex) =>
        set((state) => {
          const boardIndex = state.boards.findIndex((board) => board.id === boardId);
          if (boardIndex === -1) return state;
          
          const newBoards = [...state.boards];
          const board = { ...newBoards[boardIndex] };
          const lists = [...board.lists];
          
          const [removed] = lists.splice(sourceIndex, 1);
          lists.splice(destinationIndex, 0, removed);
          
          board.lists = lists;
          newBoards[boardIndex] = board;
          
          return { boards: newBoards };
        }),
      
      createCard: (boardId, listId, title) =>
        set((state) => ({
          boards: state.boards.map((board) => {
            if (board.id !== boardId) return board;
            
            return {
              ...board,
              lists: board.lists.map((list) => {
                if (list.id !== listId) return list;
                
                return {
                  ...list,
                  cards: [
                    ...list.cards,
                    {
                      id: nanoid(),
                      title,
                      description: '',
                      labels: [],
                      createdAt: new Date(),
                    },
                  ],
                };
              }),
            };
          }),
        })),
      
      updateCard: (boardId, listId, cardId, data) =>
        set((state) => ({
          boards: state.boards.map((board) => {
            if (board.id !== boardId) return board;
            
            return {
              ...board,
              lists: board.lists.map((list) => {
                if (list.id !== listId) return list;
                
                return {
                  ...list,
                  cards: list.cards.map((card) => {
                    if (card.id !== cardId) return card;
                    return { ...card, ...data };
                  }),
                };
              }),
            };
          }),
        })),

      updateCardBackground: (boardId, listId, cardId, color) =>
        set((state) => ({
          boards: state.boards.map((board) => {
            if (board.id !== boardId) return board;
            
            return {
              ...board,
              lists: board.lists.map((list) => {
                if (list.id !== listId) return list;
                
                return {
                  ...list,
                  cards: list.cards.map((card) => {
                    if (card.id !== cardId) return card;
                    return { ...card, backgroundColor: color };
                  }),
                };
              }),
            };
          }),
        })),
      
      deleteCard: (boardId, listId, cardId) =>
        set((state) => ({
          boards: state.boards.map((board) => {
            if (board.id !== boardId) return board;
            
            return {
              ...board,
              lists: board.lists.map((list) => {
                if (list.id !== listId) return list;
                
                return {
                  ...list,
                  cards: list.cards.filter((card) => card.id !== cardId),
                };
              }),
            };
          }),
        })),
      
      moveCard: (boardId, sourceListId, destinationListId, sourceIndex, destinationIndex) =>
        set((state) => {
          const boardIndex = state.boards.findIndex((board) => board.id === boardId);
          if (boardIndex === -1) return state;
          
          const newBoards = [...state.boards];
          const board = { ...newBoards[boardIndex] };
          const lists = [...board.lists];
          
          const sourceListIndex = lists.findIndex((list) => list.id === sourceListId);
          const destinationListIndex = lists.findIndex((list) => list.id === destinationListId);
          
          if (sourceListIndex === -1 || destinationListIndex === -1) return state;
          
          const sourceCards = [...lists[sourceListIndex].cards];
          const destinationCards = sourceListId === destinationListId 
            ? sourceCards 
            : [...lists[destinationListIndex].cards];
          
          const [removed] = sourceCards.splice(sourceIndex, 1);
          
          if (sourceListId === destinationListId) {
            sourceCards.splice(destinationIndex, 0, removed);
          } else {
            destinationCards.splice(destinationIndex, 0, removed);
            lists[destinationListIndex] = {
              ...lists[destinationListIndex],
              cards: destinationCards,
            };
          }
          
          lists[sourceListIndex] = {
            ...lists[sourceListIndex],
            cards: sourceCards,
          };
          
          board.lists = lists;
          newBoards[boardIndex] = board;
          
          return { boards: newBoards };
        }),
      
      addLabelToCard: (boardId, listId, cardId, label: Label) =>
        set((state) => ({
          boards: state.boards.map((board) => {
            if (board.id !== boardId) return board;
            
            return {
              ...board,
              lists: board.lists.map((list) => {
                if (list.id !== listId) return list;
                
                return {
                  ...list,
                  cards: list.cards.map((card) => {
                    if (card.id !== cardId) return card;
                    
                    if (card.labels.some((l) => l.id === label.id)) {
                      return card;
                    }
                    
                    return {
                      ...card,
                      labels: [...card.labels, label],
                    };
                  }),
                };
              }),
            };
          }),
        })),
      
      removeLabelFromCard: (boardId, listId, cardId, labelId) =>
        set((state) => ({
          boards: state.boards.map((board) => {
            if (board.id !== boardId) return board;
            
            return {
              ...board,
              lists: board.lists.map((list) => {
                if (list.id !== listId) return list;
                
                return {
                  ...list,
                  cards: list.cards.map((card) => {
                    if (card.id !== cardId) return card;
                    
                    return {
                      ...card,
                      labels: card.labels.filter((label) => label.id !== labelId),
                    };
                  }),
                };
              }),
            };
          }),
        })),
    }),
    {
      name: 'trello-clone-storage',
    }
  )
);