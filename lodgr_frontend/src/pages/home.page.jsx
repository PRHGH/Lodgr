import Hero from "../Components/Hero";
import HotelsView from "../Components/HotelsView";

function HomePage() {
  return (
    <main className="pb-16">
      <div className="relative">
        <Hero />
      </div>
      <HotelsView />
    </main>
  );
}

export default HomePage;
