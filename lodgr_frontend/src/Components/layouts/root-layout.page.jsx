import { Outlet } from "react-router";
import Navigation from "../Navigation";
import { Toaster } from "sonner";

function RootLayout() {
    return (
        <>
            <Navigation />
            <Outlet />
            <Toaster />
        </>
    );
}

export default RootLayout;