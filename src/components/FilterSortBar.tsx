import React from "react";
import { Filter, ArrowDownWideNarrow } from "lucide-react";
import type { FilterState } from "@/lib/filterUtils";

interface Props {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  availableGenres: string[];
  availableYears: string[];
}

export function FilterSortBar({ filters, setFilters, availableGenres, availableYears }: Props) {
  const handleChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const selectClass = "appearance-none bg-slate-950/50 border border-slate-800/60 text-slate-300 text-sm font-medium rounded-xl focus:ring-2 focus:ring-red-500/50 focus:border-red-500 block px-4 py-2.5 outline-none hover:border-slate-600 hover:bg-slate-900 transition-all cursor-pointer shadow-sm";

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between bg-slate-900/40 backdrop-blur-xl p-5 rounded-2xl border border-white/5 shadow-2xl mb-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 w-full lg:w-auto">
        <div className="flex items-center gap-2.5 text-slate-300 bg-slate-800/50 px-3 py-1.5 rounded-lg border border-white/5">
          <Filter className="w-4 h-4 text-red-500" />
          <span className="text-sm font-semibold tracking-wide uppercase">Filters</span>
        </div>
        
        <div className="flex flex-wrap gap-3 w-full sm:w-auto">
          <div className="relative group">
            <select 
              value={filters.genre} 
              onChange={(e) => handleChange("genre", e.target.value)}
              className={`${selectClass} pr-10`}
            >
              <option value="All">All Genres</option>
              {availableGenres.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-500 group-hover:text-slate-300 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>

          <div className="relative group">
            <select 
              value={filters.year} 
              onChange={(e) => handleChange("year", e.target.value)}
              className={`${selectClass} pr-10`}
            >
              <option value="All">All Years</option>
              {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-500 group-hover:text-slate-300 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>

          <div className="relative group">
            <select 
              value={filters.rating} 
              onChange={(e) => handleChange("rating", e.target.value)}
              className={`${selectClass} pr-10`}
            >
              <option value="All">Any Rating</option>
              <option value="9">9.0+ Rating</option>
              <option value="8">8.0+ Rating</option>
              <option value="7">7.0+ Rating</option>
              <option value="6">6.0+ Rating</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-500 group-hover:text-slate-300 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 w-full lg:w-auto pt-5 lg:pt-0 border-t lg:border-t-0 border-slate-800/50">
        <div className="flex items-center gap-2.5 text-slate-300 bg-slate-800/50 px-3 py-1.5 rounded-lg border border-white/5">
          <ArrowDownWideNarrow className="w-4 h-4 text-red-500" />
          <span className="text-sm font-semibold tracking-wide uppercase">Sort</span>
        </div>
        <div className="relative group flex-1 lg:flex-none">
          <select 
            value={filters.sortBy} 
            onChange={(e) => handleChange("sortBy", e.target.value)}
            className={`${selectClass} pr-10 w-full`}
          >
            <option value="default">Default</option>
            <option value="newest">Newest Release</option>
            <option value="popularity">Highest Rated</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-500 group-hover:text-slate-300 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>
      </div>
    </div>
  );
}
