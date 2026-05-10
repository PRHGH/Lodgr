import { Outlet } from "react-router";
import Navigation from "../Navigation";
import { Toaster } from "sonner";
import Footer from "../Footer";

function RootLayout() {
    return (
        <>
            <Navigation />
            <Outlet />
            <Footer />
            <Toaster />
        </>
    );
}

export default RootLayout;
