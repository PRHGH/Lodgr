import { cn } from "@/lib/utils";
import { useState, useEffect, useCallback } from "react";
import AISearch from "./AISearch";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router";

const heroImages = [
  "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1800&q=80",
  "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1800&q=80",
  "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=1800&q=80",
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1800&q=80",
];

function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goToSlide = useCallback(
    (index) => {
      if (index === currentSlide || isTransitioning) return;
      setIsTransitioning(true);
      setCurrentSlide(index);
    },
    [currentSlide, isTransitioning]
  );

  useEffect(() => {
    if (!isTransitioning) return undefined;
    const transitionTimeout = setTimeout(() => setIsTransitioning(false), 500);
    return () => clearTimeout(transitionTimeout);
  }, [isTransitioning]);

  useEffect(() => {
    if (isTransitioning) return undefined;
    const intervalId = setInterval(() => {
      goToSlide((currentSlide + 1) % heroImages.length);
    }, 4500);
    return () => clearInterval(intervalId);
  }, [currentSlide, isTransitioning, goToSlide]);

  return (
    <section className="editorial-shell">
      <div className="relative min-h-[620px] overflow-hidden rounded-[2rem] border border-black/10 bg-neutral-950 shadow-2xl shadow-black/10 md:min-h-[680px]">
      {heroImages.map((image, index) => (
        <div
          key={image}
          className={cn(
            "absolute inset-0 bg-cover bg-center transition-opacity duration-500",
            currentSlide === index ? "opacity-100" : "opacity-0"
          )}
          style={{ backgroundImage: `url(${image})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/35 to-black/70" />
        </div>
      ))}

      <div className="relative z-10 flex min-h-[620px] flex-col justify-center px-5 py-10 text-white sm:px-10 lg:px-16 md:min-h-[680px]">
        <span className="mb-6 w-fit rounded-full border border-white/20 bg-white/15 px-4 py-2 text-xs font-medium uppercase text-white backdrop-blur">
          AI-powered booking
        </span>
        <h1 className="max-w-4xl text-center text-4xl font-semibold leading-[1.02] sm:text-left md:text-6xl lg:text-7xl">
          Discover top hotels, compare stays, and book your perfect escape.
        </h1>
        <p className="mt-5 max-w-2xl text-center text-base text-white/80 sm:text-left md:text-lg">
          Describe the mood, pace, and place. Lodgr searches curated hotels by meaning, then helps you move from inspiration to booking.
        </p>
        <div className="mt-8 max-w-4xl">
          <AISearch />
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm text-white/75 sm:justify-start">
          <Link to="/hotels" className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 font-medium text-neutral-950">
            Explore hotels
            <ArrowUpRight className="h-4 w-4" />
          </Link>
          <span>100 curated stays across 25 destinations</span>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {heroImages.map((image, index) => (
          <button
            key={image}
            onClick={() => goToSlide(index)}
            className={cn(
              "h-2 rounded-full transition-all",
              currentSlide === index ? "w-9 bg-white" : "w-2 bg-white/50"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
      </div>
    </section>
  );
}

export default Hero;
