import { useState } from "react";
import { Link, NavLink } from "react-router";
import { Button } from "./ui/button";
import { ArrowUpRight, Globe2, Menu, Plus, Search, X } from "lucide-react";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/clerk-react";

const navLinkClass = ({ isActive }) =>
  `inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition ${
    isActive
      ? "bg-neutral-950 text-white"
      : "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-950"
  }`;

const adminLinkClass = ({ isActive }) =>
  `inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold shadow-sm transition ${
    isActive
      ? "bg-[#c9a46a] text-neutral-950"
      : "bg-neutral-950 text-white hover:bg-[#c9a46a] hover:text-neutral-950"
  }`;

function Navigation() {
  const { user } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-background/85 py-3 backdrop-blur">
      <nav className="editorial-shell">
        <div className="flex h-14 items-center justify-between rounded-full border border-black/10 bg-white px-3 shadow-sm sm:px-5">
        <div className="flex items-center gap-4 md:gap-8">
          <Link to="/" className="flex items-center gap-3" aria-label="Lodgr home">
            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white text-neutral-950">
              <img
                src="/logo.svg"
                alt=""
                className="block h-8 w-8"
                style={{ transform: "translateX(12%)" }}
              />
            </span>
            <span>
              <span className="block text-2xl font-semibold leading-none tracking-normal text-neutral-950">Lodgr</span>
              <span className="hidden text-xs text-neutral-500 sm:block">
                Editorial stays
              </span>
            </span>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            <NavLink to="/hotels" className={navLinkClass}>
              <Search className="h-4 w-4" />
              Hotels
            </NavLink>
            {user?.publicMetadata?.role === "admin" && (
              <NavLink to="/admin/create-hotel" className={adminLinkClass}>
                <Plus className="h-4 w-4" />
                Create Hotel
              </NavLink>
            )}
          </div>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 rounded-full text-neutral-700 hover:bg-neutral-100 hover:text-neutral-950"
          >
            <Globe2 className="h-4 w-4" />
            EN
          </Button>

          <SignedOut>
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="rounded-full text-neutral-700 hover:bg-neutral-100 hover:text-neutral-950"
            >
              <Link to="/sign-in">Log In</Link>
            </Button>
            <Button size="sm" asChild className="black-pill h-9 rounded-full px-4">
              <Link to="/sign-up">
                Book now
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </SignedOut>

          <SignedIn>
            <Button
              size="sm"
              asChild
              className="rounded-full bg-neutral-950 text-white hover:bg-neutral-800"
            >
              <Link to="/my-account">My Account</Link>
            </Button>
            <UserButton />
          </SignedIn>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="rounded-full text-neutral-950 hover:bg-neutral-100 md:hidden"
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          <span className="sr-only">{isMenuOpen ? "Close menu" : "Open menu"}</span>
        </Button>
        </div>
      </nav>

      {isMenuOpen && (
        <div className="editorial-shell mt-2 md:hidden">
          <div className="flex flex-col gap-2 rounded-2xl border border-black/10 bg-white p-3 shadow-lg">
            <NavLink
              to="/hotels"
              className={navLinkClass}
              onClick={() => setIsMenuOpen(false)}
            >
              <Search className="h-4 w-4" />
              Hotels
            </NavLink>

            {user?.publicMetadata?.role === "admin" && (
              <NavLink
                to="/admin/create-hotel"
                className={adminLinkClass}
                onClick={() => setIsMenuOpen(false)}
              >
                <Plus className="h-4 w-4" />
                Create Hotel
              </NavLink>
            )}

            <Button
              variant="ghost"
              size="sm"
              className="justify-start gap-2 rounded-full text-neutral-700 hover:bg-neutral-100 hover:text-neutral-950"
            >
              <Globe2 className="h-4 w-4" />
              EN
            </Button>

            <div className="mt-2 border-t border-black/10 pt-3">
              <SignedOut>
                <div className="grid gap-2">
                  <Button
                    variant="ghost"
                    asChild
                    className="justify-start rounded-full text-neutral-700 hover:bg-neutral-100 hover:text-neutral-950"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Link to="/sign-in">Log In</Link>
                  </Button>
                  <Button
                    asChild
                    className="black-pill rounded-full"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Link to="/sign-up">Sign Up</Link>
                  </Button>
                </div>
              </SignedOut>

              <SignedIn>
                <Button
                  asChild
                  className="w-full rounded-full bg-neutral-950 text-white hover:bg-neutral-800"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Link to="/my-account">My Account</Link>
                </Button>
              </SignedIn>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navigation;
