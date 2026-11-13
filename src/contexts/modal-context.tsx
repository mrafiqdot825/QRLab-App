import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

interface ModalContextType {
  scannerOpen: boolean;
  openScanner: () => void;
  closeScanner: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [scannerOpen, setScannerOpen] = useState(false);

  const openScanner = useCallback(() => setScannerOpen(true), []);
  const closeScanner = useCallback(() => setScannerOpen(false), []);

  const value = useMemo(
    () => ({ scannerOpen, openScanner, closeScanner }),
    [scannerOpen, openScanner, closeScanner]
  );

  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>;
};

export const useModals = (): ModalContextType => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModals must be used within a ModalProvider');
  }
  return context;
};
