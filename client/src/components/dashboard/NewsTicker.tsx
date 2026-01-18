"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface Headline {
  title: string;
  url: string;
  source: string;
}

export function NewsTicker() {
  const [headlines, setHeadlines] = useState<Headline[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      try {
        const res = await fetch('/api/highlights');
        if (!res.ok) throw new Error('Failed');
        const data = await res.json();
        setHeadlines(data);
      } catch (e) {
        console.error("Failed to fetch news ticker", e);
      } finally {
        setLoading(false);
      }
    }
    
    // Initial fetch
    fetchNews();
    
    // Poll every 120s
    const interval = setInterval(fetchNews, 120000);
    return () => clearInterval(interval);
  }, []);

  if (!headlines.length && !loading) return null;
  if (!headlines.length && loading) return (
      <div className="w-full h-10 bg-black items-center flex border-y border-border-dark px-4">
          <div className="w-4 h-4 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin mr-3"></div>
          <span className="text-xs text-gray-500 font-mono animate-pulse">Initializing News Feed...</span>
      </div>
  );

  return (
    <div className="w-full bg-[#050505] h-9 border-b border-border-dark overflow-hidden flex items-center relative group">
      {/* Label */}
      <div className="bg-emerald-600/90 backdrop-blur-sm text-white text-[10px] font-bold tracking-widest uppercase px-4 h-full flex items-center z-10 relative shadow-lg shadow-emerald-500/20">
        NEWS
      </div>
      
      {/* Fade Gradients */}
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#050505] to-transparent z-10 pointer-events-none"></div>

      {/* Scrolling Container */}
      <div className="flex-1 overflow-hidden h-full flex items-center relative">
        <div className="flex animate-scroll whitespace-nowrap group-hover:[animation-play-state:paused] w-max">
          
          {/* First loop */}
          <div className="flex items-center gap-10 pr-10">
            {headlines.map((item, i) => (
              <TickerItem key={`${item.url}-${i}`} item={item} />
            ))}
          </div>

          {/* Second loop (for seamless infinite scroll) */}
          <div className="flex items-center gap-10 pr-10">
            {headlines.map((item, i) => (
              <TickerItem key={`${item.url}-${i}-dup`} item={item} />
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}

function TickerItem({ item }: { item: Headline }) {
  return (
    <div className="inline-flex items-center group/item transition-colors">
      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50 mr-3"></div>
      <a 
        href={item.url} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="text-gray-300 text-xs font-medium hover:text-emerald-400 hover:underline transition-colors mr-2"
      >
        {item.title}
      </a>
      <span className="text-gray-600 text-[10px] font-mono uppercase tracking-wider">— {item.source}</span>
    </div>
  );
}
