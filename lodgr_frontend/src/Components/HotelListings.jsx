import HotelCard from "./HotelCard";
import { hotels,locations } from "../hotelData";
import { useState } from "react";
import LocationsTab from "./LocationsTab";

function HotelListings() {

const [selectedLocation, setSelectedLocation] = useState(0);

const handleLocationSelect = (selectedLocation) => {
setSelectedLocation(selectedLocation._id);
};


const selectedLocationName = locations.find(
(el) => selectedLocation === el._id
).name;

const filteredHotels = selectedLocation === 0 ? 
hotels : hotels.filter((hotel) => {return hotel.location.includes(selectedLocationName);})
    return(
        <section className="px-8 py-8 lg:py-8">
            <div className="mb-12">
                <h2 className="text-3xl text-[#2d3748] md:text-4xl text-center font-bold mb-4">
                Top trending hotels worldwide
                </h2>
                <p className="text-lg text-center text-muted-foreground">
                Discover the most trending hotels worldwide for an unforgettable
                experience.
                </p>
            </div>
            <div className="flex justify-center bg-[#bfd0e8aa] py-0.5 rounded-md space-x-10 mb-8">
                {locations.map((location) => {
                    return(
                        <LocationsTab onClick={handleLocationSelect} location={location} selectedLocation={selectedLocation} key={location._id}/> 
                    );
                })}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-4">
                {filteredHotels.map((hotel) => {
                return <HotelCard key={hotel._id} hotel={hotel} />;
                })}
            </div>
        </section>
    );
}
export default HotelListings;