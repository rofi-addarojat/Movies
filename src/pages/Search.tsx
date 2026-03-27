import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Search as SearchIcon, AlertCircle, Filter } from "lucide-react";
import { MovieCard } from "@/components/MovieCard";
import { SkeletonCard } from "@/components/SkeletonCard";
import { FilterSortBar } from "@/components/FilterSortBar";
import { defaultFilters, applyFilterAndSort, extractFilterOptions, type FilterState } from "@/lib/filterUtils";
import type { MovieItem } from "@/types";

export function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState<MovieItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  useEffect(() => {
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
      if (!query.trim()) {
        setResults([]);
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const data = await safeFetch(`/api/proxy?action=search&q=${encodeURIComponent(query)}`);
        if (data.success && data.items) {
          setResults(data.items);
        } else {
          setError("Failed to fetch search results.");
        }
      } catch (err) {
        console.error("Search error:", err);
        setError("An error occurred while searching.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSearch();
  }, [query]);

  const { genres, years } = useMemo(() => extractFilterOptions([results]), [results]);
  const filteredResults = useMemo(() => applyFilterAndSort(results, filters), [results, filters]);

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-24 pb-20">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <SearchIcon className="w-8 h-8 text-red-500" />
            Search Results
          </h1>
          <p className="text-slate-400 text-lg">
            Showing results for <span className="text-white font-semibold">"{query}"</span>
          </p>
        </div>

        {!isLoading && !error && results.length > 0 && (
          <FilterSortBar filters={filters} setFilters={setFilters} availableGenres={genres} availableYears={years} />
        )}

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Oops! Something went wrong.</h2>
            <p className="text-slate-400">{error}</p>
          </div>
        ) : filteredResults.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filteredResults.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        ) : results.length > 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Filter className="w-24 h-24 text-slate-800 mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">No matches found</h2>
            <p className="text-slate-400 max-w-md mx-auto">
              Try adjusting your filters to find what you're looking for.
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <SearchIcon className="w-24 h-24 text-slate-800 mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">No movies found</h2>
            <p className="text-slate-400 max-w-md mx-auto">
              We couldn't find any movies or TV shows matching "{query}". Try searching with different keywords.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
