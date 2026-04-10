
import HotelCard from '@/Components/HotelCard'
import {hotels} from '@/hotelData'
import Navigation from '@/Components/Navigation';
import { Switch } from '@/Components/ui/switch';
import Hero from '@/Components/Hero';
import HotelListings from '@/Components/HotelListings';

function HomePage() {


  return (
    <>
     <div className="relative min-h [85vh]">
      <Hero />
     </div>
     <HotelListings />
    </>
  );
}

export default HomePage;
