import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Collections from './pages/Collections';
import NewArrivals from './pages/NewArrivals';
import SpecialOffers from './pages/SpecialOffers';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import Profile from './pages/Profile';

const pageVariants = {
  initial: { opacity: 0, y: 15, scale: 0.99 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35, ease: [0.25, 1, 0.5, 1] } },
  exit: { opacity: 0, y: -15, scale: 0.99, transition: { duration: 0.2, ease: "easeIn" } }
};

const MainApp = () => {
  const [currentPage, setCurrentPage] = useState('landing');
  const [redirectPage, setRedirectPage] = useState(null);

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
      case 'cart':
        return (
          <Cart 
            setCurrentPage={setCurrentPage} 
            setRedirectPage={setRedirectPage} 
          />
        );
      case 'checkout':
        return <Checkout setCurrentPage={setCurrentPage} />;
      case 'orders':
        return <Orders setCurrentPage={setCurrentPage} />;
      case 'profile':
        return <Profile setCurrentPage={setCurrentPage} />;
      case 'login':
        return (
          <Login 
            setCurrentPage={setCurrentPage} 
            redirectPage={redirectPage} 
            setRedirectPage={setRedirectPage} 
          />
        );
      case 'signup':
        return (
          <Signup 
            setCurrentPage={setCurrentPage} 
            redirectPage={redirectPage} 
            setRedirectPage={setRedirectPage} 
          />
        );
      default:
        return <LandingPage setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div className="app-layout">
      <Navbar setCurrentPage={setCurrentPage} currentPage={currentPage} />
      <main className="app-main" style={{ position: 'relative', overflowX: 'hidden' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};


function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <MainApp />
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
