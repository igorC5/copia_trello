export interface Card {
  id: string;
  title: string;
  description?: string;
  labels: Label[];
  createdAt: Date;
  backgroundColor?: string;
}

export interface List {
  id: string;
  title: string;
  cards: Card[];
  backgroundColor?: string;
}

export interface Board {
  id: string;
  title: string;
  lists: List[];
  backgroundColor?: string;
}

export type Label = {
  id: string;
  name: string;
  color: string;
};

export type DragEndEvent = {
  active: { id: string; data?: { current?: any } };
  over: { id: string } | null;
};

export type StoreState = {
  boards: Board[];
  activeBoard: string | null;
  
  setActiveBoard: (id: string) => void;
  getActiveBoard: () => Board | undefined;
  
  createBoard: (title: string) => void;
  updateBoardTitle: (id: string, title: string) => void;
  updateBoardBackground: (id: string, color: string) => void;
  deleteBoard: (id: string) => void;
  
  createList: (boardId: string, title: string) => void;
  updateListTitle: (boardId: string, listId: string, title: string) => void;
  updateListBackground: (boardId: string, listId: string, color: string) => void;
  deleteList: (boardId: string, listId: string) => void;
  moveList: (boardId: string, sourceIndex: number, destinationIndex: number) => void;
  
  createCard: (boardId: string, listId: string, title: string) => void;
  updateCard: (boardId: string, listId: string, cardId: string, data: Partial<Card>) => void;
  updateCardBackground: (boardId: string, listId: string, cardId: string, color: string) => void;
  deleteCard: (boardId: string, listId: string, cardId: string) => void;
  moveCard: (
    boardId: string, 
    sourceListId: string, 
    destinationListId: string, 
    sourceIndex: number, 
    destinationIndex: number
  ) => void;
  
  addLabelToCard: (boardId: string, listId: string, cardId: string, label: Label) => void;
  removeLabelFromCard: (boardId: string, listId: string, cardId: string, labelId: string) => void;
};