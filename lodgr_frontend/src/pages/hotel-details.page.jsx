import { useParams } from "react-router";
import  { hotels } from "../hotelData.js";

function HotelDetailsPage() {

    const { _id } = useParams();
    const hotel = hotels.find((hotel) => hotel._id === _id);

    return (
        <main>
            <h1>{hotel.name}</h1>
        </main>
    );
}

export default HotelDetailsPage;