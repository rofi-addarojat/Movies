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
    <Link to={`/detail/${encodeURIComponent(movie.detailPath)}`} className="group block relative w-full aspect-[2/3] rounded-xl overflow-hidden bg-slate-900 shadow-lg transition-all duration-300 hover:shadow-red-600/20 hover:shadow-2xl hover:-translate-y-1">
      <motion.div
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full h-full relative"
      >
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding="async"
          referrerPolicy="no-referrer"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-red-600/90 backdrop-blur-sm flex items-center justify-center shadow-[0_0_30px_rgba(220,38,38,0.6)] transform scale-50 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300 delay-75">
              <Play className="w-6 h-6 text-white fill-white ml-1" />
            </div>
          </div>
          
          <div className="relative z-10 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <h3 className="text-white font-bold text-sm md:text-base line-clamp-2 mb-1.5 drop-shadow-md">{movie.title}</h3>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
              <span className="bg-red-600/80 text-white px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider backdrop-blur-md">{movie.type}</span>
              <span className="drop-shadow-md font-semibold">{movie.year}</span>
            </div>
          </div>
        </div>

        {/* Rating Badge */}
        {movie.rating && movie.rating !== "N/A" && (
          <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-md px-2 py-1 rounded-md flex items-center gap-1 shadow-lg border border-white/10">
            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
            <span className="text-xs font-bold text-white">{movie.rating}</span>
          </div>
        )}
      </motion.div>
    </Link>
  );
}
