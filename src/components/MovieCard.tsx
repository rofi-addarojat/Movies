import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Play, Star } from "lucide-react";
import type { MovieItem } from "@/types";

interface MovieCardProps {
  movie: MovieItem;
  priority?: boolean;
}

export function MovieCard({ movie, priority = false }: MovieCardProps) {
  return (
    <Link to={`/detail/${encodeURIComponent(movie.detailPath)}`} className="group block relative w-full aspect-[2/3] rounded-xl overflow-hidden bg-slate-900">
      <motion.div
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="w-full h-full relative"
      >
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full h-full object-cover"
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding="async"
          referrerPolicy="no-referrer"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-red-600/90 flex items-center justify-center shadow-lg shadow-red-600/50 transform scale-50 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300 delay-100">
              <Play className="w-5 h-5 text-white fill-white ml-1" />
            </div>
          </div>
          
          <div className="relative z-10 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <h3 className="text-white font-bold text-sm line-clamp-2 mb-1">{movie.title}</h3>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
              <span className="bg-slate-800 px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wider">{movie.type}</span>
              <span>{movie.year}</span>
            </div>
          </div>
        </div>

        {/* Rating Badge */}
        {movie.rating && movie.rating !== "N/A" && (
          <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md flex items-center gap-1 shadow-lg border border-white/10">
            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
            <span className="text-xs font-bold text-white">{movie.rating}</span>
          </div>
        )}
      </motion.div>
    </Link>
  );
}
