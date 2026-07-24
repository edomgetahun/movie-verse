import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import GenrePage from './pages/GenrePage';
import SearchResults from './pages/SearchResults';
import MovieDetail from './pages/MovieDetails';
import Downloads from './pages/Downloads';
import Favorites from './pages/Favorites';
import { DownloadsProvider } from './context/DownloadsContext';
import { FavoritesProvider } from './context/FavoritesContext';
import './App.css';

function App() {
  return (
    <DownloadsProvider>
      <FavoritesProvider>
        <BrowserRouter>
          <Navbar />
          <main className="page-container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/genre/:slug" element={<GenrePage />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/movie/:id" element={<MovieDetail />} />
              <Route path="/downloads" element={<Downloads />} />
              <Route path="/favorites" element={<Favorites />} />
            </Routes>
          </main>
        </BrowserRouter>
      </FavoritesProvider>
    </DownloadsProvider>
  );
}

export default App;