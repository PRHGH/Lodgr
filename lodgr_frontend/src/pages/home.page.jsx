import Hero from "../Components/Hero";
import HotelsView from "../Components/HotelsView";
import BookingCompletePage from "./booking-complete.page.jsx";
import { useSearchParams } from "react-router";

function HomePage() {
  const [searchParams] = useSearchParams();

  if (searchParams.get("payment_session_id")) {
    return <BookingCompletePage />;
  }

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
