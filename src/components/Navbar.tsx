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

    const fetchSearch = async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/proxy?action=search&q=${encodeURIComponent(debouncedSearch)}`);
        const data = await res.json();
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
        "fixed top-0 w-full z-50 transition-all duration-300",
        isScrolled ? "bg-slate-950/90 backdrop-blur-md shadow-md shadow-black/20" : "bg-gradient-to-b from-black/80 to-transparent"
      )}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 text-red-600 hover:text-red-500 transition-colors">
            <PlayCircle className="w-8 h-8 fill-red-600/20" />
            <span className="text-2xl font-black tracking-tighter uppercase">DirgaMovies</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <Link to="/category/trending" className="hover:text-white transition-colors">Trending</Link>
            <Link to="/category/kdrama" className="hover:text-white transition-colors">K-Drama</Link>
            <Link to="/category/anime" className="hover:text-white transition-colors">Anime</Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative hidden sm:block">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search movies, dramas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => {
                  if (searchResults.length > 0) setShowDropdown(true);
                }}
                onBlur={() => {
                  // Delay hiding to allow clicking results
                  setTimeout(() => setShowDropdown(false), 200);
                }}
                className="w-64 bg-slate-900/50 border border-slate-700/50 rounded-full py-1.5 pl-10 pr-4 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all"
              />
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
