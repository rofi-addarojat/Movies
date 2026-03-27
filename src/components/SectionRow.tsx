import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { MovieCard } from "./MovieCard";
import { SkeletonCard } from "./SkeletonCard";
import type { MovieItem } from "@/types";

interface SectionRowProps {
  title: string;
  items: MovieItem[];
  isLoading: boolean;
  viewAllLink?: string;
  priority?: boolean;
}

export function SectionRow({ title, items, isLoading, viewAllLink, priority = false }: SectionRowProps) {
  return (
    <section className="py-6 relative z-10">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-8 bg-red-600 rounded-full"></div>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">{title}</h2>
          </div>
          {viewAllLink && (
            <Link
              to={viewAllLink}
              className="group flex items-center gap-1 text-sm font-bold text-slate-400 hover:text-white transition-colors bg-slate-800/50 hover:bg-slate-800 px-4 py-2 rounded-full border border-slate-700/50 backdrop-blur-sm"
            >
              View All
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </div>

        <div className="flex overflow-x-auto gap-4 md:gap-6 pb-6 pt-2 snap-x snap-mandatory custom-scrollbar">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex-none w-[160px] sm:w-[200px] md:w-[240px] snap-start">
                  <SkeletonCard />
                </div>
              ))
            : items.map((movie, index) => (
                <div key={movie.id} className="flex-none w-[160px] sm:w-[200px] md:w-[240px] snap-start">
                  {/* Only prioritize the first 4 items if the row itself is marked as priority */}
                  <MovieCard movie={movie} priority={priority && index < 4} />
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}
