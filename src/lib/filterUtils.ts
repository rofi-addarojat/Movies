import type { MovieItem } from "@/types";

export interface FilterState {
  genre: string;
  year: string;
  rating: string;
  sortBy: string;
}

export const defaultFilters: FilterState = {
  genre: "All",
  year: "All",
  rating: "All",
  sortBy: "default",
};

export function applyFilterAndSort(movies: MovieItem[], filters: FilterState): MovieItem[] {
  let result = [...movies];

  if (filters.genre !== "All") {
    result = result.filter(m => m.genre?.toLowerCase().includes(filters.genre.toLowerCase()));
  }
  
  if (filters.year !== "All") {
    result = result.filter(m => m.year?.toString() === filters.year);
  }
  
  if (filters.rating !== "All") {
    const minRating = parseFloat(filters.rating);
    result = result.filter(m => {
      const r = parseFloat(m.rating as string);
      return !isNaN(r) && r >= minRating;
    });
  }

  if (filters.sortBy === "newest") {
    result.sort((a, b) => {
      const yearA = parseInt(a.year as string) || 0;
      const yearB = parseInt(b.year as string) || 0;
      return yearB - yearA;
    });
  } else if (filters.sortBy === "popularity") {
    result.sort((a, b) => {
      const rA = parseFloat(a.rating as string) || 0;
      const rB = parseFloat(b.rating as string) || 0;
      return rB - rA;
    });
  }

  return result;
}

export function extractFilterOptions(moviesArray: MovieItem[][]) {
  const allMovies = moviesArray.flat();
  const genres = new Set<string>();
  const years = new Set<string>();

  allMovies.forEach(m => {
    if (m.genre) {
      m.genre.split(",").forEach(g => {
        const trimmed = g.trim();
        if (trimmed) genres.add(trimmed);
      });
    }
    if (m.year && m.year !== "N/A") {
      years.add(m.year.toString());
    }
  });

  return {
    genres: Array.from(genres).sort(),
    years: Array.from(years).sort((a, b) => parseInt(b) - parseInt(a))
  };
}
