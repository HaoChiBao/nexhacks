import Link from "next/link";
import Glass from "@/components/ui/glass";
import { EngineSection } from "@/components/landing/EngineSection";

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
          <Glass className="p-12 md:p-16 flex flex-col items-center text-center max-w-4xl mx-4">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 drop-shadow-2xl">
              The Future of
              <br />
              <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-emerald-300">
                Fund Management
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 max-w-2xl mb-10 font-light leading-relaxed">
              Discover, analyze, and invest in the next generation of strategies.
              <br/>
              From geopolitics to climate science, captured in real-time.
            </p>

            <Link 
              href="/funds" 
              className="px-10 py-4 rounded-full bg-white text-gray-900 font-bold text-lg hover:bg-gray-100 hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)]"
            >
              Explore Funds
            </Link>
          </Glass>
        </div>
      </section>

      {/* Engine Section */}
      <EngineSection />
    </main>
  );
}
