import { funds } from "@/lib/data/funds";
import { FundCard } from "@/components/funds/FundCard";
import Glass from "@/components/ui/glass";
import Link from "next/link";
import { PillarsSection } from "@/components/landing/PillarsSection";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  // Duplicate funds to ensure seamless infinite scroll
  // We need enough items to fill the column height and loop
  const displayFunds = [...funds, ...funds, ...funds, ...funds];

  return (
    <main className="bg-background-dark min-h-screen">
      <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
        {/* Background Section */}
        {/* Tilted Container */}
        <div 
          className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none"
          style={{
              width: '200%',
              height: '200%',
              left: '-50%',
              top: '-50%',
              transform: 'rotate(-45deg)', // Tilted to -45deg as requested
          }}
        >
          <div style={{ transform: 'rotate(0deg)' }} className="w-full h-full flex gap-6 justify-center opacity-30 blur-[2px] select-none">
              {/* Columns */}
              {/* We create 3 columns with staggered animations */}
              {[0, 1, 2, 3].map((columnIndex) => (
                  <div 
                      key={columnIndex} 
                      className="flex flex-col gap-6 animate-scroll-up"
                      style={{
                          animationDuration: `${60 + columnIndex * 10}s`, // Varied speeds
                          marginTop: `${columnIndex * -100}px` // Staggered start
                      }}
                  >
                      {displayFunds.map((fund, i) => (
                          <div key={`${columnIndex}-${i}`} className="transform scale-[0.65] origin-center opacity-80">
                              {/* Using a wrapper to handle the scaling without affecting layout flow too much */}
                              <div className="w-[350px]">
                                  <FundCard fund={fund} index={i % funds.length} />
                              </div>
                          </div>
                      ))}
                  </div>
              ))}
          </div>
          
          {/* Overlay Gradient to fade edges if needed, or just let it fill */}
          <div className="absolute inset-0 bg-background-dark/30 z-10"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-20 flex flex-col items-center justify-center text-center px-4">
          <Glass className="p-12 md:p-16 flex flex-col items-center">
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

      {/* Pillars Section */}
      <PillarsSection />

      <Footer />
    </main>
  );
}
