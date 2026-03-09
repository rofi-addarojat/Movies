import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";

interface Ad {
  id: number;
  title: string;
  type: string;
  imageUrl: string;
  targetUrl: string;
  position: string;
  customCode?: string;
}

interface AdBannerProps {
  position: "top" | "bottom" | "player_overlay";
}

export function AdBanner({ position }: AdBannerProps) {
  const [ads, setAds] = useState<Ad[]>([]);
  const [isVisible, setIsVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const res = await fetch("/api/ads");
        const data = await res.json();
        if (data.success) {
          const matchingAds = data.data.filter((ad: Ad) => ad.position === position);
          setAds(matchingAds);
          
          // Record impressions
          matchingAds.forEach((ad: Ad) => {
            fetch(`/api/ads/${ad.id}/impression`, { method: "POST" }).catch(console.error);
          });
        }
      } catch (e) {
        console.error("Failed to fetch ads", e);
      }
    };

    fetchAds();
  }, [position]);

  // Select a random ad from the matching position
  const ad = ads.length > 0 ? ads[Math.floor(Math.random() * ads.length)] : null;

  useEffect(() => {
    if (ad?.type === "script" && ad.customCode && containerRef.current) {
      // Clear previous content
      containerRef.current.innerHTML = "";
      
      try {
        // Create a contextual fragment to safely execute scripts
        const fragment = document.createRange().createContextualFragment(ad.customCode);
        containerRef.current.appendChild(fragment);
      } catch (e) {
        console.error("Failed to inject ad script:", e);
      }
    }
  }, [ad]);

  if (!isVisible || !ad) return null;

  const handleClick = () => {
    fetch(`/api/ads/${ad.id}/click`, { method: "POST" }).catch(console.error);
  };

  if (ad.type === "script") {
    return (
      <div className="relative w-full my-4 flex justify-center group">
        <div className="absolute top-0 left-0 bg-black/60 backdrop-blur-md px-2 py-1 rounded-br text-[10px] font-bold text-white uppercase tracking-wider z-10">
          Ad
        </div>
        <button 
          onClick={() => setIsVisible(false)}
          className="absolute top-0 right-0 bg-black/60 backdrop-blur-md p-1 rounded-bl text-white opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-red-600"
        >
          <X className="w-4 h-4" />
        </button>
        <div 
          ref={containerRef} 
          className="w-full min-h-[50px] flex items-center justify-center overflow-hidden"
          onClick={handleClick}
        />
      </div>
    );
  }

  if (ad.type === "direct") {
    // For direct ads, we might want to just render a small text link or a button
    return (
      <div className="relative w-full bg-slate-900 border border-slate-800 rounded-lg p-4 my-4 flex items-center justify-between group">
        <div className="flex flex-col">
          <span className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Sponsored</span>
          <a 
            href={ad.targetUrl} 
            target="_blank" 
            rel="noreferrer" 
            onClick={handleClick}
            className="text-lg font-bold text-white hover:text-red-500 transition-colors"
          >
            {ad.title}
          </a>
        </div>
        <button 
          onClick={() => setIsVisible(false)}
          className="p-2 text-slate-500 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    );
  }

  // Banner ad
  return (
    <div className="relative w-full my-4 group">
      <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold text-white uppercase tracking-wider z-10">
        Ad
      </div>
      <button 
        onClick={() => setIsVisible(false)}
        className="absolute top-2 right-2 bg-black/60 backdrop-blur-md p-1 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-red-600"
      >
        <X className="w-4 h-4" />
      </button>
      <a 
        href={ad.targetUrl} 
        target="_blank" 
        rel="noreferrer" 
        onClick={handleClick}
        className="block w-full rounded-xl overflow-hidden border border-slate-800 hover:border-slate-600 transition-colors"
      >
        {ad.imageUrl ? (
          <img 
            src={ad.imageUrl} 
            alt={ad.title} 
            className="w-full h-auto max-h-[120px] object-cover"
            onError={(e) => {
              // Fallback if image fails to load
              (e.target as HTMLImageElement).style.display = 'none';
              (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
            }}
          />
        ) : null}
        <div className={`w-full bg-slate-900 p-6 text-center ${ad.imageUrl ? 'hidden' : ''}`}>
          <h3 className="text-xl font-bold text-white mb-2">{ad.title}</h3>
          <span className="text-red-500 font-medium">Click to learn more</span>
        </div>
      </a>
    </div>
  );
}
