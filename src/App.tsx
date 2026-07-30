import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import GenrePage from './pages/GenrePage';
import SearchResults from './pages/SearchResults';
import Downloads from './pages/Downloads';
import Favorites from './pages/Favorites';
import MovieModal from './components/MovieModal';
import { DownloadsProvider } from './context/DownloadsContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { MovieModalProvider } from './context/MovieModalContext';
import { EASE_OUT } from './lib/motion';

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageTransition>
              <Home />
            </PageTransition>
          }
        />
        <Route
          path="/genre/:slug"
          element={
            <PageTransition>
              <GenrePage />
            </PageTransition>
          }
        />
        <Route
          path="/search"
          element={
            <PageTransition>
              <SearchResults />
            </PageTransition>
          }
        />
        <Route
          path="/downloads"
          element={
            <PageTransition>
              <Downloads />
            </PageTransition>
          }
        />
        <Route
          path="/favorites"
          element={
            <PageTransition>
              <Favorites />
            </PageTransition>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.35, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  );
}

function App() {
  return (
    <DownloadsProvider>
      <FavoritesProvider>
        <MovieModalProvider>
          <BrowserRouter>
            <Navbar />
            <main className="max-w-[1400px] mx-auto px-4 md:px-8 pb-16">
              <AnimatedRoutes />
            </main>
            <MovieModal />
          </BrowserRouter>
        </MovieModalProvider>
      </FavoritesProvider>
    </DownloadsProvider>
  );
}

export default App;