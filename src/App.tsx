import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
import './App.css';

function App() {
  return (
    <DownloadsProvider>
      <FavoritesProvider>
        <MovieModalProvider>
          <BrowserRouter>
            <Navbar />
            <main className="page-container">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/genre/:slug" element={<GenrePage />} />
                <Route path="/search" element={<SearchResults />} />
                <Route path="/downloads" element={<Downloads />} />
                <Route path="/favorites" element={<Favorites />} />
              </Routes>
            </main>
            <MovieModal />
          </BrowserRouter>
        </MovieModalProvider>
      </FavoritesProvider>
    </DownloadsProvider>
  );
}

export default App;