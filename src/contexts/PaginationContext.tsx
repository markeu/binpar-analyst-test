import { createContext, useContext, useState, ReactNode } from 'react';

export interface PaginationState {
  currentPageUrl?: string;
  nextPageUrl?: string;
  prevPageUrl?: string;
}

const initialPaginationState: PaginationState = {
    currentPageUrl: '',
    nextPageUrl: '',
    prevPageUrl: ''
  };

interface PaginationContextProps {
  paginationState: PaginationState;
  setPaginationState: (state: PaginationState) => void;
}

const PaginationContext = createContext<PaginationContextProps | undefined>(undefined);

export const PaginationProvider = ({ children }: { children: ReactNode }) => {
  const [paginationState, setPaginationState] = useState<PaginationState>(initialPaginationState);

  return (
    <PaginationContext.Provider value={{ paginationState, setPaginationState }}>
      {children}
    </PaginationContext.Provider>
  );
};

export const usePagination = () => {
  const context = useContext(PaginationContext);
  if (!context) {
    throw new Error('usePagination must be used within a PaginationProvider');
  }
  return context;
};
