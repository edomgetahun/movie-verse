import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import SearchBar from './SearchBar.tsx';

const LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/favorites', label: 'Favorites', end: false },
  { to: '/downloads', label: 'Downloads', end: false },
];

export default function Navbar() {
  const location = useLocation();

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-40 border-b border-cream/[0.08] bg-void/85 backdrop-blur-md"
    >
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 h-16 flex items-center gap-4 md:gap-8">
        <Link to="/" className="flex items-center gap-2 shrink-0 font-display text-xl tracking-wider text-cream">
          <span aria-hidden="true" className="text-gold text-lg leading-none">
            ●
          </span>
          Movie Verse
        </Link>

        <div className="flex-1 min-w-0">
          <SearchBar />
        </div>

        <nav className="hidden sm:flex items-center gap-1 shrink-0">
          {LINKS.map((link) => {
            const isActive = link.end ? location.pathname === link.to : location.pathname.startsWith(link.to);
            return (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className="relative px-3 py-2 text-sm font-medium text-muted hover:text-cream transition-colors"
              >
                <span className={isActive ? 'relative z-10 text-cream' : 'relative z-10'}>{link.label}</span>
                {isActive && (
                  <motion.span
                    layoutId="nav-active-pill"
                    className="absolute inset-0 rounded-md bg-panel-raised"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>
    </motion.header>
  );
}