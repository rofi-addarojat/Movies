import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "motion/react";
import { Play, Star, Calendar, Clock, Film, AlertCircle, Download } from "lucide-react";
import { AdBanner } from "@/components/AdBanner";
import type { MovieDetail } from "@/types";

export function Detail() {
  const { detailPath } = useParams<{ detailPath: string }>();
  const [detail, setDetail] = useState<MovieDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string | null>(null);
  const [currentEpisode, setCurrentEpisode] = useState<string | null>(null);
  const [currentSeason, setCurrentSeason] = useState<string | null>(null);

  useEffect(() => {
    const safeFetch = async (url: string) => {
      try {
        const res = await fetch(url);
        if (!res.ok) {
           console.warn(`Fetch failed for ${url} with status ${res.status}`);
           return { success: false, data: null };
        }
        const text = await res.text();
        try {
          return JSON.parse(text);
        } catch (e) {
          console.error(`Failed to parse JSON for ${url}:`, text.substring(0, 50));
          return { success: false, data: null };
        }
      } catch (error) {
        console.error(`Network error for ${url}:`, error);
        return { success: false, data: null };
      }
    };

    const fetchDetail = async () => {
      if (!detailPath) return;
      setIsLoading(true);
      setError(null);
      try {
        const data = await safeFetch(`/api/proxy?action=detail&detailPath=${encodeURIComponent(detailPath)}`);
        if (data.success && data.data) {
          setDetail(data.data);
          setCurrentVideoUrl(data.data.playerUrl);
          
          // Fetch initial stream data for movie or first episode
          if (data.data.type === "movie") {
            // No longer fetching stream data for downloads
          } else if (data.data.seasons && data.data.seasons.length > 0 && data.data.seasons[0].episodes.length > 0) {
            const firstEp = data.data.seasons[0].episodes[0];
            setCurrentSeason(data.data.seasons[0].season.toString());
            setCurrentEpisode(firstEp.episode.toString());
          }
        } else {
          setError("Failed to load movie details.");
        }
      } catch (err) {
        console.error("Detail error:", err);
        setError("An error occurred while fetching details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetail();
  }, [detailPath]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col pt-16">
        <div className="w-full aspect-video bg-slate-900 animate-pulse relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-slate-800" />
          </div>
        </div>
        <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
          <div className="w-48 md:w-64 aspect-[2/3] bg-slate-800 rounded-xl animate-pulse shrink-0 mx-auto md:mx-0 -mt-24 md:-mt-32 relative z-10 border-4 border-slate-900" />
          <div className="flex-1 space-y-6 mt-4 md:mt-0">
            <div className="h-12 bg-slate-800 rounded w-3/4 animate-pulse" />
            <div className="flex gap-4">
              <div className="h-6 bg-slate-800 rounded w-16 animate-pulse" />
              <div className="h-6 bg-slate-800 rounded w-16 animate-pulse" />
              <div className="h-6 bg-slate-800 rounded w-16 animate-pulse" />
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-slate-800 rounded w-24 animate-pulse mb-4" />
              <div className="flex gap-2">
                <div className="h-6 bg-slate-800 rounded-full w-20 animate-pulse" />
                <div className="h-6 bg-slate-800 rounded-full w-24 animate-pulse" />
              </div>
            </div>
            <div className="space-y-3 pt-4">
              <div className="h-4 bg-slate-800 rounded w-24 animate-pulse mb-2" />
              <div className="h-4 bg-slate-800 rounded w-full animate-pulse" />
              <div className="h-4 bg-slate-800 rounded w-full animate-pulse" />
              <div className="h-4 bg-slate-800 rounded w-5/6 animate-pulse" />
              <div className="h-4 bg-slate-800 rounded w-4/6 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !detail) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-center px-4">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Oops! Something went wrong.</h2>
        <p className="text-slate-400 mb-6">{error || "Movie not found."}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full font-medium transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-20 pt-16 relative">
      {/* Blurred Background */}
      {detail && (
        <div className="fixed inset-0 z-0 pointer-events-none">
          <img 
            src={detail.poster} 
            alt="Background" 
            className="w-full h-full object-cover opacity-20 blur-[100px] scale-110"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-slate-950/80" />
        </div>
      )}

      {/* Video Player Section */}
      <div className="w-full bg-black aspect-video relative group z-10 shadow-2xl shadow-black/80 border-b border-white/5">
        {currentVideoUrl ? (
          <>
            <iframe
              src={currentVideoUrl}
              className="w-full h-full border-0"
              allowFullScreen
              sandbox="allow-scripts allow-same-origin allow-presentation"
              title={detail?.title}
            />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 pointer-events-none">
              <div className="pointer-events-auto">
                <AdBanner position="player_overlay" />
              </div>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-900 text-slate-500">
            <Play className="w-16 h-16 opacity-20" />
            <span className="ml-4 font-medium">Video not available</span>
          </div>
        )}
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="flex flex-col md:flex-row gap-10 bg-slate-900/40 backdrop-blur-xl p-6 md:p-10 rounded-3xl border border-white/5 shadow-2xl">
          {/* Poster */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-48 md:w-72 shrink-0 mx-auto md:mx-0 -mt-24 md:-mt-32 relative z-10"
          >
            <img
              src={detail.poster}
              alt={detail.title}
              className="w-full aspect-[2/3] object-cover rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.8)] border-4 border-slate-900/80"
              referrerPolicy="no-referrer"
            />
          </motion.div>

          {/* Meta Info */}
          <div className="flex-1">
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent drop-shadow-lg">{detail.title}</h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm font-bold text-slate-200 mb-8">
              <span className="flex items-center gap-1 text-yellow-500 bg-yellow-500/10 px-3 py-1.5 rounded-full border border-yellow-500/20 backdrop-blur-md">
                <Star className="w-4 h-4 fill-yellow-500" />
                {detail.rating}
              </span>
              <span className="flex items-center gap-1 bg-slate-800/80 px-3 py-1.5 rounded-full border border-slate-700 backdrop-blur-md">
                <Calendar className="w-4 h-4" />
                {detail.year}
              </span>
              <span className="flex items-center gap-1 bg-slate-800/80 px-3 py-1.5 rounded-full border border-slate-700 backdrop-blur-md">
                <Film className="w-4 h-4" />
                {detail.type}
              </span>
              <span className="bg-red-600/20 text-red-500 px-3 py-1.5 rounded-full uppercase tracking-widest text-xs font-black border border-red-500/20 backdrop-blur-md">
                HD
              </span>
            </div>

            <div className="flex flex-wrap gap-4 mb-8 relative">
              {currentVideoUrl ? (
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full">
                  <a
                    href={currentVideoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 bg-white hover:bg-slate-200 text-black px-8 py-3.5 rounded-full font-bold transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.2)] w-full sm:w-auto"
                  >
                    <Play className="w-5 h-5 fill-black" />
                    Open Player
                  </a>
                  <div className="text-sm text-slate-300 flex items-start sm:items-center gap-3 bg-slate-800/60 px-5 py-3.5 rounded-2xl sm:rounded-full border border-slate-700/50 backdrop-blur-md w-full sm:w-auto">
                    <Download className="w-5 h-5 text-red-500 shrink-0 mt-0.5 sm:mt-0" />
                    <span className="leading-relaxed">To download, right-click the video and select <strong>"Save Video As..."</strong></span>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 bg-black/20 p-6 rounded-2xl border border-white/5">
              <div className="md:col-span-3">
                <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-3">Synopsis</h3>
                <p className="text-slate-200 leading-relaxed text-base md:text-lg font-medium">
                  {detail.description}
                </p>
              </div>
              <div className="md:col-span-3">
                <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-3">Genre</h3>
                <div className="flex flex-wrap gap-2">
                  {detail.genre.split(",").map((g, i) => (
                    <span key={i} className="bg-slate-800/80 text-slate-200 px-4 py-1.5 rounded-full text-sm font-semibold border border-slate-700 backdrop-blur-md">
                      {g.trim()}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <AdBanner position="bottom" />
            </div>
          </div>
        </div>

        {/* Seasons & Episodes List */}
        {detail.seasons && detail.seasons.length > 0 && (
          <div className="mt-16 space-y-12 relative z-10">
            {detail.seasons.map((season) => (
              <div key={season.season} className="bg-slate-900/40 backdrop-blur-xl p-6 md:p-10 rounded-3xl border border-white/5 shadow-2xl">
                <h2 className="text-3xl font-black mb-8 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-600/20 flex items-center justify-center">
                    <Play className="w-5 h-5 text-red-500 fill-red-500" />
                  </div>
                  Season {season.season}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {season.episodes.map((ep) => (
                    <button
                      key={ep.episode}
                      onClick={() => {
                        if (ep.playerUrl) setCurrentVideoUrl(ep.playerUrl);
                        setCurrentSeason(season.season.toString());
                        setCurrentEpisode(ep.episode.toString());
                      }}
                      className={`group flex flex-col p-5 rounded-2xl border transition-all duration-300 text-left relative overflow-hidden ${
                        currentVideoUrl === ep.playerUrl
                          ? "bg-red-600/20 border-red-500/50 text-white shadow-[0_0_30px_rgba(220,38,38,0.2)]"
                          : "bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-800 hover:border-slate-600 hover:shadow-xl hover:-translate-y-1"
                      }`}
                    >
                      {currentVideoUrl === ep.playerUrl && (
                        <div className="absolute top-0 left-0 w-1 h-full bg-red-500" />
                      )}
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-black text-slate-400 group-hover:text-slate-300 uppercase tracking-widest transition-colors">
                          Episode {ep.episode}
                        </span>
                        {currentVideoUrl === ep.playerUrl && (
                          <span className="flex h-3 w-3 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                          </span>
                        )}
                      </div>
                      <span className="font-bold text-lg line-clamp-2 leading-tight group-hover:text-white transition-colors">{ep.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
