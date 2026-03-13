import { Outlet } from "react-router";
import Navigation from "../Navigation";

function RootLayout() {
    return (
        <>
            <Navigation />
            <Outlet />
        </>
    );
}

export default RootLayout;