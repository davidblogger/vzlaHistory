/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext } from 'react';
import { usePassport } from '../hooks/usePassport';

const PassportContext = createContext(null);

export function PassportProvider({ children }) {
  const passport = usePassport();
  return (
    <PassportContext.Provider value={passport}>
      {children}
    </PassportContext.Provider>
  );
}

export function usePassportContext() {
  const ctx = useContext(PassportContext);
  if (!ctx) throw new Error('usePassportContext must be used within PassportProvider');
  return ctx;
}
