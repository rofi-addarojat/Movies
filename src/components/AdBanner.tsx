import { useState, useEffect } from "react";
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

  if (!isVisible || !ad) return null;

  const handleClick = () => {
    fetch(`/api/ads/${ad.id}/click`, { method: "POST" }).catch(console.error);
  };

  if (ad.type === "script") {
    // For third-party scripts (AdSense, MGID), the safest way to prevent them 
    // from breaking the React app (e.g., via document.write) is to isolate them in an iframe.
    const iframeContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; background: transparent; overflow: hidden; }
          </style>
        </head>
        <body>
          ${ad.customCode || ''}
        </body>
      </html>
    `;

    return (
      <div className="relative w-full my-4 flex justify-center group" onClick={handleClick}>
        <iframe
          srcDoc={iframeContent}
          className="w-full min-h-[90px] border-0 overflow-hidden"
          scrolling="no"
          title={`Ad-${ad.id}`}
          sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
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
      </div>
    );
  }

  // Banner ad
  return (
    <div className="relative w-full my-4 group">
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
