import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Search, Menu, X, PlayCircle } from "lucide-react";
import { useDebounce } from "use-debounce";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import type { MovieItem } from "@/types";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch] = useDebounce(searchQuery, 500);
  const [searchResults, setSearchResults] = useState<MovieItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setShowDropdown(false);
    setSearchQuery("");
  }, [location.pathname]);

  useEffect(() => {
    if (debouncedSearch.trim() === "") {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    const safeFetch = async (url: string) => {
      try {
        const res = await fetch(url);
        if (!res.ok) {
           console.warn(`Fetch failed for ${url} with status ${res.status}`);
           return { success: false, items: [] };
        }
        const text = await res.text();
        try {
          return JSON.parse(text);
        } catch (e) {
          console.error(`Failed to parse JSON for ${url}:`, text.substring(0, 50));
          return { success: false, items: [] };
        }
      } catch (error) {
        console.error(`Network error for ${url}:`, error);
        return { success: false, items: [] };
      }
    };

    const fetchSearch = async () => {
      setIsSearching(true);
      try {
        const data = await safeFetch(`/api/proxy?action=search&q=${encodeURIComponent(debouncedSearch)}`);
        if (data.success && data.items) {
          setSearchResults(data.items.slice(0, 5));
          setShowDropdown(true);
        }
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsSearching(false);
      }
    };

    fetchSearch();
  }, [debouncedSearch]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowDropdown(false);
    }
  };

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-500",
        isScrolled 
          ? "bg-slate-950/80 backdrop-blur-xl shadow-lg shadow-black/40 border-b border-white/5 py-1" 
          : "bg-gradient-to-b from-black/90 via-black/50 to-transparent py-3"
      )}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-red-700 shadow-lg shadow-red-600/30 group-hover:shadow-red-600/50 transition-all duration-300 overflow-hidden">
              <div className="absolute inset-0 bg-white/20 group-hover:opacity-0 transition-opacity duration-300"></div>
              <PlayCircle className="w-6 h-6 text-white fill-white/20" />
            </div>
            <span className="text-2xl font-black tracking-tighter uppercase bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent group-hover:from-white group-hover:to-white transition-all duration-300">
              Dirga<span className="text-red-600">Movies</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1 bg-white/5 p-1 rounded-full border border-white/10 backdrop-blur-md">
            <Link to="/" className="px-4 py-2 rounded-full text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-all">Home</Link>
            <Link to="/category/trending" className="px-4 py-2 rounded-full text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-all">Trending</Link>
            <Link to="/category/action" className="px-4 py-2 rounded-full text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-all">Action</Link>
            <Link to="/category/horror" className="px-4 py-2 rounded-full text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-all">Horror</Link>
            <Link to="/category/indonesian-movies" className="px-4 py-2 rounded-full text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-all">Indonesia</Link>
            <Link to="/category/indonesian-drama" className="px-4 py-2 rounded-full text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-all">Indo Drama</Link>
            <Link to="/category/kdrama" className="px-4 py-2 rounded-full text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-all">K-Drama</Link>
            <Link to="/category/anime" className="px-4 py-2 rounded-full text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-all">Anime</Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <form onSubmit={handleSearchSubmit} className="relative group">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-4 h-4 text-slate-400 group-focus-within:text-red-500 transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Search movies, dramas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => {
                  if (searchResults.length > 0) setShowDropdown(true);
                }}
                onBlur={() => {
                  setTimeout(() => setShowDropdown(false), 200);
                }}
                className="w-64 lg:w-80 bg-slate-900/40 border border-slate-700/50 rounded-full py-2 pl-10 pr-4 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-600/50 focus:border-red-500/50 focus:bg-slate-900/80 transition-all backdrop-blur-sm shadow-inner"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <div className="hidden lg:flex items-center gap-1 text-[10px] font-medium text-slate-500 bg-slate-800/50 px-1.5 py-0.5 rounded border border-slate-700/50">
                  <kbd>Ctrl</kbd>+<kbd>K</kbd>
                </div>
              </div>
            </form>

            <AnimatePresence>
              {showDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full mt-2 w-full bg-slate-900 border border-slate-800 rounded-xl shadow-xl overflow-hidden"
                >
                  {isSearching ? (
                    <div className="p-4 text-center text-sm text-slate-400">Searching...</div>
                  ) : searchResults.length > 0 ? (
                    <div className="flex flex-col max-h-[400px] overflow-y-auto custom-scrollbar">
                      {searchResults.map((movie) => (
                        <Link
                          key={movie.id}
                          to={`/detail/${encodeURIComponent(movie.detailPath)}`}
                          className="flex items-start gap-4 p-3 hover:bg-slate-800/80 transition-colors group border-b border-slate-800/50 last:border-0"
                        >
                          <div className="relative w-12 h-16 shrink-0 rounded-md overflow-hidden bg-slate-800 shadow-md">
                            <img
                              src={movie.poster}
                              alt={movie.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <div className="flex flex-col flex-1 min-w-0 py-1">
                            <span className="text-sm font-bold text-slate-200 group-hover:text-red-400 transition-colors truncate mb-1">
                              {movie.title}
                            </span>
                            <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                              {movie.year && (
                                <span className="bg-slate-800/80 px-1.5 py-0.5 rounded text-[10px]">
                                  {movie.year}
                                </span>
                              )}
                              {movie.type && (
                                <span className="uppercase tracking-wider text-[10px]">
                                  {movie.type}
                                </span>
                              )}
                              {movie.rating && movie.rating !== "N/A" && (
                                <span className="flex items-center gap-0.5 text-yellow-500 ml-auto">
                                  <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                                  {movie.rating}
                                </span>
                              )}
                            </div>
                          </div>
                        </Link>
                      ))}
                      <Link
                        to={`/search?q=${encodeURIComponent(searchQuery)}`}
                        className="p-3 text-center text-sm text-red-500 hover:text-red-400 hover:bg-slate-800/80 transition-colors border-t border-slate-800 font-semibold sticky bottom-0 bg-slate-900/95 backdrop-blur-sm"
                      >
                        View all results for "{searchQuery}"
                      </Link>
                    </div>
                  ) : (
                    <div className="p-4 text-center text-sm text-slate-400">No results found</div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            className="md:hidden p-2 text-slate-300 hover:text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-slate-950 border-t border-slate-800 overflow-hidden"
          >
            <div className="p-4 flex flex-col gap-4">
              <form onSubmit={handleSearchSubmit} className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </form>
              <nav className="flex flex-col gap-2 text-sm font-medium text-slate-300">
                <Link to="/" className="p-2 hover:bg-slate-900 rounded-lg transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
                <Link to="/category/trending" className="p-2 hover:bg-slate-900 rounded-lg transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Trending</Link>
                <Link to="/category/action" className="p-2 hover:bg-slate-900 rounded-lg transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Action</Link>
                <Link to="/category/horror" className="p-2 hover:bg-slate-900 rounded-lg transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Horror</Link>
                <Link to="/category/indonesian-movies" className="p-2 hover:bg-slate-900 rounded-lg transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Indonesia</Link>
                <Link to="/category/indonesian-drama" className="p-2 hover:bg-slate-900 rounded-lg transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Indo Drama</Link>
                <Link to="/category/kdrama" className="p-2 hover:bg-slate-900 rounded-lg transition-colors" onClick={() => setIsMobileMenuOpen(false)}>K-Drama</Link>
                <Link to="/category/anime" className="p-2 hover:bg-slate-900 rounded-lg transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Anime</Link>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
