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
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white tracking-tight">{title}</h2>
          {viewAllLink && (
            <Link
              to={viewAllLink}
              className="group flex items-center gap-1 text-sm font-medium text-slate-400 hover:text-white transition-colors"
            >
              View All
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </div>

        <div className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory scrollbar-hide">
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
