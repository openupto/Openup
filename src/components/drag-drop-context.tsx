import { createContext, useContext, useState, ReactNode } from 'react';

interface DragDropContextType {
  draggedItem: string | null;
  setDraggedItem: (id: string | null) => void;
  dragOverItem: string | null;
  setDragOverItem: (id: string | null) => void;
  isDragging: boolean;
}

const DragDropContext = createContext<DragDropContextType | undefined>(undefined);

export function DragDropProvider({ children }: { children: ReactNode }) {
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [dragOverItem, setDragOverItem] = useState<string | null>(null);

  const isDragging = draggedItem !== null;

  return (
    <DragDropContext.Provider value={{
      draggedItem,
      setDraggedItem,
      dragOverItem,
      setDragOverItem,
      isDragging
    }}>
      {children}
    </DragDropContext.Provider>
  );
}

export function useDragDrop() {
  const context = useContext(DragDropContext);
  if (context === undefined) {
    throw new Error('useDragDrop must be used within a DragDropProvider');
  }
  return context;
}