import Hero from "../Components/Hero";

import HotelListings from "../Components/HotelListings";

function HomePage() {

  // const count = useSelector((state) => state.counter);
  // console.log(count);

  // const dispatch = useDispatch();

  return (
    <main>
      <div className="relative min-h-[85vh]">
        <Hero />
      </div>
      {/* <Button onClick={() => dispatch(incrementByAmount(5))}>
        <PlusCircle className="w-4 h-4" />
      </Button> */}
      <HotelListings />
    </main>
  );
}

export default HomePage;
