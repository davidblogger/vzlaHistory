import { useState, useCallback } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import DocumentationPage from './pages/DocumentationPage';
import HistoricalPassportDashboard from './components/HistoricalPassportDashboard';
import { PassportProvider, usePassportContext } from './context/PassportContext';
import './App.css';

function AppLayout() {
  const [passportOpen, setPassportOpen] = useState(false);
  const passport = usePassportContext();

  const handleOpenPassport = useCallback(() => setPassportOpen(true), []);
  const handleClosePassport = useCallback(() => setPassportOpen(false), []);

  return (
    <>
      <Navbar onOpenPassport={handleOpenPassport} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/documentacion" element={<DocumentationPage />} />
      </Routes>
      <Footer />
      {passportOpen && (
        <HistoricalPassportDashboard
          passport={passport}
          onClose={handleClosePassport}
        />
      )}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <PassportProvider>
        <AppLayout />
      </PassportProvider>
    </BrowserRouter>
  );
}
