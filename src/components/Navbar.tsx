import { Link, NavLink } from 'react-router-dom';
import SearchBar from './SearchBar.tsx';

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand">
          <span className="brand-mark" aria-hidden="true">
            ●
          </span>
          Movie Verse
        </Link>
        <SearchBar />
        <nav className="nav-links">
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
            Home
          </NavLink>
          <NavLink to="/favorites" className={({ isActive }) => (isActive ? 'active' : '')}>
            Favorites
          </NavLink>
          <NavLink to="/downloads" className={({ isActive }) => (isActive ? 'active' : '')}>
            Downloads
          </NavLink>
        </nav>
      </div>
    </header>
  );
}