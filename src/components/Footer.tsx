import { PlayCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-white/5 py-16 mt-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-red-950/20 pointer-events-none" />
      <div className="container mx-auto px-4 flex flex-col items-center gap-8 relative z-10">
        <div className="flex items-center gap-2 group">
          <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500 to-red-700 shadow-lg shadow-red-600/30 group-hover:shadow-red-600/50 transition-all duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-white/20 group-hover:opacity-0 transition-opacity duration-300"></div>
            <PlayCircle className="w-8 h-8 text-white fill-white/20" />
          </div>
          <span className="text-3xl font-black tracking-tighter uppercase bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent group-hover:from-white group-hover:to-white transition-all duration-300">
            Dirga<span className="text-red-600">Movies</span>
          </span>
        </div>
        <p className="text-slate-400 text-sm text-center max-w-lg leading-relaxed font-medium">
          DirgaMovies is a free movie streaming platform. We do not host any files on our server.
          All contents are provided by non-affiliated third parties.
        </p>
        <div className="flex flex-wrap justify-center gap-6 text-sm font-bold">
          <a href="#" className="text-slate-300 hover:text-white transition-colors bg-slate-900/50 px-4 py-2 rounded-full border border-slate-800 hover:border-slate-600 hover:bg-slate-800">Terms of Service</a>
          <a href="#" className="text-slate-300 hover:text-white transition-colors bg-slate-900/50 px-4 py-2 rounded-full border border-slate-800 hover:border-slate-600 hover:bg-slate-800">Privacy Policy</a>
          <a href="#" className="text-slate-300 hover:text-white transition-colors bg-slate-900/50 px-4 py-2 rounded-full border border-slate-800 hover:border-slate-600 hover:bg-slate-800">DMCA</a>
        </div>
        <div className="w-full max-w-md h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent my-4" />
        <p className="text-slate-500 text-xs font-semibold tracking-wider uppercase">
          &copy; {new Date().getFullYear()} DirgaMovies. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
