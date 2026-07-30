import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';

export default function SearchBar() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');

  useEffect(() => {
    setQuery(searchParams.get('q') || '');
  }, [searchParams]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  }

  return (
    <form
      className="group flex items-center gap-2 max-w-md rounded-md border border-cream/10 bg-panel px-3 py-1.5 transition-colors focus-within:border-gold/60"
      onSubmit={handleSubmit}
      role="search"
    >
      <Search size={16} className="text-muted shrink-0 group-focus-within:text-gold transition-colors" />
      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search movies"
        aria-label="Search movies"
        className="w-full bg-transparent text-sm text-cream placeholder:text-muted outline-none"
      />
      <button
        type="submit"
        className="hidden md:inline-block text-xs font-medium text-gold hover:text-gold-dim transition-colors shrink-0"
      >
        Search
      </button>
    </form>
  );
}