import Link from "next/link";
import Glass from "@/components/ui/glass";
import { EngineSection } from "@/components/landing/EngineSection";
import { RotatingText } from "@/components/landing/RotatingText";

export default function Home() {
  return (
    <main className="min-h-screen w-full bg-black relative">
      {/* Hero Section */}
      <section className="relative h-screen w-full overflow-hidden">
        {/* Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover z-0 opacity-60"
        >
          <source src="/videos/hero_web.mp4" type="video/mp4" />
        </video>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/40 z-10" />

        {/* Center Content */}
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center">
          <div className="flex flex-col items-center text-center max-w-5xl mx-4">
            <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-white mb-8 drop-shadow-2xl uppercase">
              If You Love It,
              <br />
              <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-emerald-300">
                Bet On It
              </span>
            </h1>
            
            <div className="text-2xl md:text-3xl text-gray-200 max-w-4xl mb-12 font-light leading-snug flex flex-wrap items-center justify-center gap-y-2 gap-x-3">
              <span>AI agents that</span>
              <RotatingText />
              <span>so you can Discover more of what you already love</span>
            </div>

            <Link 
              href="/funds" 
              className="px-10 py-4 rounded-full bg-white text-gray-900 font-bold text-lg hover:bg-gray-100 hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)]"
            >
              Explore Funds
            </Link>
          </div>
        </div>
      </section>

      {/* Engine Section */}
      <EngineSection />
    </main>
  );
}
