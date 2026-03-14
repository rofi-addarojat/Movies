import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Play, Info, Star } from "lucide-react";
import { SectionRow } from "@/components/SectionRow";
import { FilterSortBar } from "@/components/FilterSortBar";
import { AdBanner } from "@/components/AdBanner";
import { defaultFilters, applyFilterAndSort, extractFilterOptions, type FilterState } from "@/lib/filterUtils";
import type { MovieItem } from "@/types";

export function Home() {
  const [trending, setTrending] = useState<MovieItem[]>([]);
  const [indoMovies, setIndoMovies] = useState<MovieItem[]>([]);
  const [indoDrama, setIndoDrama] = useState<MovieItem[]>([]);
  const [actionMovies, setActionMovies] = useState<MovieItem[]>([]);
  const [horrorMovies, setHorrorMovies] = useState<MovieItem[]>([]);
  const [kdrama, setKdrama] = useState<MovieItem[]>([]);
  const [anime, setAnime] = useState<MovieItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [heroMovie, setHeroMovie] = useState<MovieItem | null>(null);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  useEffect(() => {
    const fetchAll = async () => {
      setIsLoading(true);
      try {
        const [trendingRes, indoMoviesRes, indoDramaRes, actionRes, horrorRes, kdramaRes, animeRes] = await Promise.all([
          fetch("/api/proxy?action=trending&page=1").then((res) => res.json()),
          fetch("/api/proxy?action=indonesian-movies&page=1").then((res) => res.json()),
          fetch("/api/proxy?action=indonesian-drama&page=1").then((res) => res.json()),
          fetch("/api/proxy?action=search&q=action").then((res) => res.json()),
          fetch("/api/proxy?action=search&q=horror").then((res) => res.json()),
          fetch("/api/proxy?action=kdrama&page=1").then((res) => res.json()),
          fetch("/api/proxy?action=anime&page=1").then((res) => res.json()),
        ]);

        if (trendingRes.success) {
          setTrending(trendingRes.items);
        }
        if (indoMoviesRes.success) {
          setIndoMovies(indoMoviesRes.items);
        }
        if (indoDramaRes.success) setIndoDrama(indoDramaRes.items);
        if (actionRes.success) setActionMovies(actionRes.items);
        if (horrorRes.success) setHorrorMovies(horrorRes.items);
        if (kdramaRes.success) setKdrama(kdramaRes.items);
        if (animeRes.success) setAnime(animeRes.items);

        // Prioritize Trending for Hero Section to make it more global
        if (trendingRes.success && trendingRes.items.length > 0) {
          setHeroMovie(trendingRes.items[0]);
        } else if (indoMoviesRes.success && indoMoviesRes.items.length > 0) {
          setHeroMovie(indoMoviesRes.items[0]);
        }
      } catch (error) {
        console.error("Failed to fetch homepage data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAll();
  }, []);

  const { genres, years } = useMemo(() => 
    extractFilterOptions([trending, indoMovies, indoDrama, actionMovies, horrorMovies, kdrama, anime]), 
  [trending, indoMovies, indoDrama, actionMovies, horrorMovies, kdrama, anime]);

  const filteredTrending = useMemo(() => applyFilterAndSort(trending, filters), [trending, filters]);
  const filteredIndoMovies = useMemo(() => applyFilterAndSort(indoMovies, filters), [indoMovies, filters]);
  const filteredIndoDrama = useMemo(() => applyFilterAndSort(indoDrama, filters), [indoDrama, filters]);
  const filteredAction = useMemo(() => applyFilterAndSort(actionMovies, filters), [actionMovies, filters]);
  const filteredHorror = useMemo(() => applyFilterAndSort(horrorMovies, filters), [horrorMovies, filters]);
  const filteredKdrama = useMemo(() => applyFilterAndSort(kdrama, filters), [kdrama, filters]);
  const filteredAnime = useMemo(() => applyFilterAndSort(anime, filters), [anime, filters]);

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-20">
      {/* Hero Section */}
      <section className="relative w-full h-[80vh] min-h-[600px] flex items-center justify-start overflow-hidden">
        {isLoading ? (
          <div className="absolute inset-0 bg-slate-900 animate-pulse" />
        ) : heroMovie ? (
          <>
            <div className="absolute inset-0">
              <img
                src={heroMovie.poster}
                alt={heroMovie.title}
                className="w-full h-full object-cover opacity-60 scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="max-w-2xl"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">
                    #1 Trending
                  </span>
                  <span className="flex items-center gap-1 text-yellow-500 font-bold text-sm">
                    <Star className="w-4 h-4 fill-yellow-500" />
                    {heroMovie.rating}
                  </span>
                  <span className="text-slate-300 text-sm font-medium">{heroMovie.year}</span>
                  <span className="text-slate-300 text-sm font-medium border border-slate-700 px-2 py-0.5 rounded">
                    {heroMovie.type}
                  </span>
                </div>

                <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 leading-tight">
                  {heroMovie.title}
                </h1>

                <div className="flex items-center gap-4">
                  <Link
                    to={`/detail/${encodeURIComponent(heroMovie.detailPath)}`}
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-red-600/30"
                  >
                    <Play className="w-5 h-5 fill-white" />
                    Play Now
                  </Link>
                  <Link
                    to={`/detail/${encodeURIComponent(heroMovie.detailPath)}`}
                    className="flex items-center gap-2 bg-slate-800/80 hover:bg-slate-700 text-white px-8 py-3 rounded-full font-bold transition-all backdrop-blur-md border border-slate-700"
                  >
                    <Info className="w-5 h-5" />
                    More Info
                  </Link>
                </div>
              </motion.div>
            </div>
          </>
        ) : null}
      </section>

      {/* Content Rows */}
      <div className="relative z-20 -mt-32 space-y-8">
        <div className="container mx-auto px-4">
          <AdBanner position="top" />
          <FilterSortBar filters={filters} setFilters={setFilters} availableGenres={genres} availableYears={years} />
        </div>

        {(isLoading || filteredTrending.length > 0) && (
          <SectionRow title="Trending Now" items={filteredTrending} isLoading={isLoading} viewAllLink="/category/trending" priority={true} />
        )}
        {(isLoading || filteredAction.length > 0) && (
          <SectionRow title="Action Movies" items={filteredAction} isLoading={isLoading} viewAllLink="/category/action" />
        )}
        {(isLoading || filteredIndoMovies.length > 0) && (
          <SectionRow title="Film Indonesia" items={filteredIndoMovies} isLoading={isLoading} viewAllLink="/category/indonesian-movies" />
        )}
        {(isLoading || filteredIndoDrama.length > 0) && (
          <SectionRow title="Drama Indonesia" items={filteredIndoDrama} isLoading={isLoading} viewAllLink="/category/indonesian-drama" />
        )}
        {(isLoading || filteredHorror.length > 0) && (
          <SectionRow title="Horror Movies" items={filteredHorror} isLoading={isLoading} viewAllLink="/category/horror" />
        )}

        <div className="container mx-auto px-4">
          <AdBanner position="bottom" />
        </div>

        {(isLoading || filteredKdrama.length > 0) && (
          <SectionRow title="K-Drama Hits" items={filteredKdrama} isLoading={isLoading} viewAllLink="/category/kdrama" />
        )}
        {(isLoading || filteredAnime.length > 0) && (
          <SectionRow title="Anime" items={filteredAnime} isLoading={isLoading} viewAllLink="/category/anime" />
        )}

        {!isLoading && filteredTrending.length === 0 && filteredAction.length === 0 && filteredIndoMovies.length === 0 && filteredIndoDrama.length === 0 && filteredHorror.length === 0 && filteredKdrama.length === 0 && filteredAnime.length === 0 && (
          <div className="container mx-auto px-4 py-12 text-center">
            <h3 className="text-2xl font-bold text-white mb-2">No matches found</h3>
            <p className="text-slate-400">Try adjusting your filters to see more content.</p>
          </div>
        )}
      </div>
    </div>
  );
}
