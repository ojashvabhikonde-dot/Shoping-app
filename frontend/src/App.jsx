import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Collections from './pages/Collections';
import NewArrivals from './pages/NewArrivals';
import SpecialOffers from './pages/SpecialOffers';

const MainApp = () => {
  const [currentPage, setCurrentPage] = useState('landing');

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage setCurrentPage={setCurrentPage} />;
      case 'collections':
        return <Collections setCurrentPage={setCurrentPage} />;
      case 'new-arrivals':
        return <NewArrivals setCurrentPage={setCurrentPage} />;
      case 'special-offers':
        return <SpecialOffers setCurrentPage={setCurrentPage} />;
      case 'login':
        return <Login setCurrentPage={setCurrentPage} />;
      case 'signup':
        return <Signup setCurrentPage={setCurrentPage} />;
      default:
        return <LandingPage setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div className="app-layout">
      <Navbar setCurrentPage={setCurrentPage} currentPage={currentPage} />
      <main className="app-main">
        {renderPage()}
      </main>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
