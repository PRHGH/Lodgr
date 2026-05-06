import { useRef, useState } from "react";
import { Link } from "react-router";
import { Button } from "./ui/button";
import { Globe, Menu, X } from "lucide-react";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/clerk-react";

function Navigation() {
    const { user } = useUser();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);

    return(
        <nav className="bg-[#2d3748] text-white border-[#e5e7eb] px-4 sm:px-6 py-3 shadow-md backdrop-blur-md justify-between mx-4 my-3 rounded-full flex items-center relative">
            <div className="flex items-center space-x-8">
                <Link to="/" className="text-3xl font-bold">
                    Lodgr
                </Link>
                <div className="hidden md:flex space-x-6">
                    <Link to="/" className="transition-colors text-sm hover:text-[#becee4]">
                        Home
                    </Link>
                </div>
            </div>

            <div className="flex items-center space-x-4">   
                <Button 
                    variant="ghost" 
                    size="sm"
                    className="justify-start h-8 px-2 rounded-full hover:bg-[#5eead4]"
                >
                    <Globe className="mr-2 h-4 w-4" />  
                    EN
                </Button>

                <SignedOut>
                    <Button
                        variant="ghost"
                        size="sm"
                        asChild
                        className="text-sm hidden md:flex rounded-full hover:bg-[#5eead4]"
                    >
                        <Link to="/sign-in">Log In</Link>
                    </Button>

                    <Button size="sm" asChild className="text-sm bg-[#475569] border-2 border-[#475569] rounded-full hover:bg-[#64748b] hover:text-[#5eead4] hover:border-[#5eead4]">
                        <Link to="/sign-up">Sign Up</Link>
                    </Button>
                </SignedOut>

                <SignedIn>
                    <UserButton />
                    <Button
                        size="sm"
                        asChild
                        className="bg-[#475569] border-2 border-[#475569] text-white rounded-full hover:bg-[#64748b] hover:text-[#5eead4] hover:border-[#5eead4] text-xs hidden md:flex"
                    >
                        <Link to="/account">My Account</Link>
                    </Button>
                </SignedIn>

            <div className="relative md:hidden">
              <Button
                // ref={buttonRef}
                variant="ghost"
                size="icon"
                className="relative z-20"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-expanded={isMenuOpen}
              >
                {isMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
                <span className="sr-only">
                  {isMenuOpen ? "Close menu" : "Open menu"}
                </span>
              </Button>

              {/* Dropdown Menu */}
              {isMenuOpen && (
                <div
                  ref={menuRef}
                  className="absolute right-0 mt-2 w-56 rounded-xl bg-black border border-gray-800 shadow-lg py-2 px-3 animate-in fade-in slide-in-from-top-5 duration-200 z-50"
                  style={{ top: "calc(100% + 8px)" }}
                >
                  <div className="flex flex-col space-y-3 py-2">
                    <a
                      href="/"
                      className="text-sm font-medium hover:text-gray-300 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Home
                    </a>
                    {user?.publicMetadata?.role === "admin" && (
                      <a
                        href="/hotels/create"
                        className="text-sm font-medium hover:text-gray-300 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Create Hotel
                      </a>
                    )}
                    <div className="h-px bg-white/20 my-1"></div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="justify-start h-8 px-2"
                    >
                      <Globe className="h-4 w-4 mr-2" />
                      EN
                    </Button>
                    <SignedOut>
                      <>
                        <Link
                          to="/sign-in"
                          className="text-sm font-medium hover:text-gray-300 transition-colors"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Log In
                        </Link>
                        <Button
                          size="sm"
                          className="bg-white text-black hover:bg-gray-200 w-full mt-2"
                          asChild
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <Link to="/sign-up">Sign Up</Link>
                        </Button>
                      </>
                    </SignedOut>
                    <SignedIn>
                      <Button
                        size="sm"
                        className="bg-white text-black hover:bg-gray-200 w-full mt-2"
                        asChild
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Link to="/account">My Account</Link>
                      </Button>
                    </SignedIn>
                  </div>
                </div>
              )}
            </div>

            </div>
        </nav>
    );
}
export default Navigation;
