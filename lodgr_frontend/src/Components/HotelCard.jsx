import { MapPin, Star } from "lucide-react";
import { Link } from "react-router";    

function HotelCard({ hotel }) {
    if (!hotel) {
        return null;
    }

    return(
        <Link to={"/hotels/" + hotel._id} className="block group relative border-2 border-[#0c56d50e] p-3 rounded-3xl transition-shadow hover:shadow-lg">
            <div className="relative aspect-4/3 overflow-hidden rounded-xl">
                <img
                    src={hotel.image}
                    alt={hotel.name}
                    className="object-cover w-full h-full absolute transition-transform group-hover:scale-105"
                />
            </div>
            <div className="mt-3 space-y-2">
                <h3 className="font-semibold text-lg">{hotel.name}</h3>
                <div className="flex items-center text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{hotel.location}</span>
                </div>
                <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    <span className="font-medium">
                        {hotel.rating ?? "No rating"}
                    </span>
                    <span className="text-muted-foreground">
                        ({hotel.reviews?.length ?? "No"} Reviews)
                    </span>
                </div>
                <div className="flex items-baseline space-x-2">
                    <span className="text-xl font-bold">${hotel.price}</span>
                </div>
            </div>

        </Link>
    );
}

export default HotelCard;
