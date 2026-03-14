import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Film, AlertCircle, Filter } from "lucide-react";
import { MovieCard } from "@/components/MovieCard";
import { SkeletonCard } from "@/components/SkeletonCard";
import { FilterSortBar } from "@/components/FilterSortBar";
import { defaultFilters, applyFilterAndSort, extractFilterOptions, type FilterState } from "@/lib/filterUtils";
import type { MovieItem } from "@/types";

export function Category() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [movies, setMovies] = useState<MovieItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  useEffect(() => {
    const fetchCategory = async () => {
      if (!categoryId) return;
      setIsLoading(true);
      setError(null);
      try {
        const standardCategories = ["trending", "indonesian-movies", "indonesian-drama", "kdrama", "short-tv", "anime", "adult-comedy", "western-tv", "indo-dub"];
        
        let url = `/api/proxy?action=${encodeURIComponent(categoryId)}&page=1`;
        if (!standardCategories.includes(categoryId)) {
          url = `/api/proxy?action=search&q=${encodeURIComponent(categoryId)}`;
        }

        const res = await fetch(url);
        const data = await res.json();
        if (data.success && data.items) {
          setMovies(data.items);
        } else {
          setError("Failed to fetch category movies.");
        }
      } catch (err) {
        console.error("Category error:", err);
        setError("An error occurred while fetching category.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategory();
  }, [categoryId]);

  const { genres, years } = useMemo(() => extractFilterOptions([movies]), [movies]);
  const filteredMovies = useMemo(() => applyFilterAndSort(movies, filters), [movies, filters]);

  const categoryTitle = categoryId
    ? categoryId.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
    : "Category";

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-24 pb-20">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Film className="w-8 h-8 text-red-500" />
            {categoryTitle}
          </h1>
          <p className="text-slate-400 text-lg">
            Explore the best {categoryTitle.toLowerCase()} movies and shows.
          </p>
        </div>

        {!isLoading && !error && movies.length > 0 && (
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
        ) : filteredMovies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filteredMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        ) : movies.length > 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Filter className="w-24 h-24 text-slate-800 mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">No matches found</h2>
            <p className="text-slate-400 max-w-md mx-auto">
              Try adjusting your filters to find what you're looking for.
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Film className="w-24 h-24 text-slate-800 mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">No movies found</h2>
            <p className="text-slate-400 max-w-md mx-auto">
              We couldn't find any movies in this category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
