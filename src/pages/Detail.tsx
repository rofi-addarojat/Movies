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
    const fetchDetail = async () => {
      if (!detailPath) return;
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/proxy?action=detail&detailPath=${encodeURIComponent(detailPath)}`);
        const data = await res.json();
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
    <div className="min-h-screen bg-slate-950 text-white pb-20 pt-16">
      {/* Video Player Section */}
      <div className="w-full bg-black aspect-video relative group">
        {currentVideoUrl ? (
          <>
            <iframe
              src={currentVideoUrl}
              className="w-full h-full border-0"
              allowFullScreen
              sandbox="allow-scripts allow-same-origin allow-presentation"
              title={detail.title}
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

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-48 md:w-64 shrink-0 mx-auto md:mx-0 -mt-24 md:-mt-32 relative z-10"
          >
            <img
              src={detail.poster}
              alt={detail.title}
              className="w-full aspect-[2/3] object-cover rounded-xl shadow-2xl shadow-black/50 border-4 border-slate-900"
              referrerPolicy="no-referrer"
            />
          </motion.div>

          {/* Meta Info */}
          <div className="flex-1">
            <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-4">{detail.title}</h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-slate-300 mb-6">
              <span className="flex items-center gap-1 text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded">
                <Star className="w-4 h-4 fill-yellow-500" />
                {detail.rating}
              </span>
              <span className="flex items-center gap-1 bg-slate-800 px-2 py-1 rounded">
                <Calendar className="w-4 h-4" />
                {detail.year}
              </span>
              <span className="flex items-center gap-1 bg-slate-800 px-2 py-1 rounded">
                <Film className="w-4 h-4" />
                {detail.type}
              </span>
              <span className="bg-red-600/20 text-red-500 px-2 py-1 rounded uppercase tracking-wider text-xs font-bold">
                HD
              </span>
            </div>

            <div className="flex flex-wrap gap-4 mb-6 relative">
              {currentVideoUrl ? (
                <div className="flex items-center gap-4">
                  <a
                    href={currentVideoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-6 py-2.5 rounded-full font-bold transition-colors"
                  >
                    <Play className="w-5 h-5" />
                    Open Player
                  </a>
                  <div className="text-sm text-slate-400 flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-full border border-slate-700/50">
                    <Download className="w-4 h-4" />
                    <span>To download, right-click the video and select "Save Video As..."</span>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="mb-6">
              <h3 className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-2">Genre</h3>
              <div className="flex flex-wrap gap-2">
                {detail.genre.split(",").map((g, i) => (
                  <span key={i} className="bg-slate-800 text-slate-300 px-3 py-1 rounded-full text-xs font-medium">
                    {g.trim()}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-2">Synopsis</h3>
              <p className="text-slate-300 leading-relaxed text-sm md:text-base">
                {detail.description}
              </p>
            </div>
            
            <div className="mt-8">
              <AdBanner position="bottom" />
            </div>
          </div>
        </div>

        {/* Seasons & Episodes List */}
        {detail.seasons && detail.seasons.length > 0 && (
          <div className="mt-12 space-y-8">
            {detail.seasons.map((season) => (
              <div key={season.season}>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Play className="w-6 h-6 text-red-500" />
                  Season {season.season}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {season.episodes.map((ep) => (
                    <button
                      key={ep.episode}
                      onClick={() => {
                        if (ep.playerUrl) setCurrentVideoUrl(ep.playerUrl);
                        setCurrentSeason(season.season.toString());
                        setCurrentEpisode(ep.episode.toString());
                      }}
                      className={`flex flex-col p-4 rounded-xl border transition-all text-left ${
                        currentVideoUrl === ep.playerUrl
                          ? "bg-red-600/10 border-red-500/50 text-white"
                          : "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800 hover:border-slate-700"
                      }`}
                    >
                      <span className="text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">
                        Episode {ep.episode}
                      </span>
                      <span className="font-medium line-clamp-1">{ep.title}</span>
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
