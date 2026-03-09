import { PlayCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 py-12 mt-12">
      <div className="container mx-auto px-4 flex flex-col items-center gap-6">
        <div className="flex items-center gap-2 text-red-600">
          <PlayCircle className="w-8 h-8 fill-red-600/20" />
          <span className="text-2xl font-black tracking-tighter uppercase">DirgaMovies</span>
        </div>
        <p className="text-slate-500 text-sm text-center max-w-md">
          DirgaMovies is a free movie streaming platform. We do not host any files on our server.
          All contents are provided by non-affiliated third parties.
        </p>
        <div className="flex gap-4 text-sm font-medium">
          <a href="#" className="text-red-500 hover:text-red-400 transition-colors">Terms of Service</a>
          <a href="#" className="text-red-500 hover:text-red-400 transition-colors">Privacy Policy</a>
          <a href="#" className="text-red-500 hover:text-red-400 transition-colors">DMCA</a>
        </div>
        <p className="text-slate-600 text-xs">
          &copy; {new Date().getFullYear()} DirgaMovies. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
