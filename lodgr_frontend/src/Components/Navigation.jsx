import { Button } from "./ui/button";
import { Globe } from "lucide-react";

function Navigation() {
    return(
        <nav className="bg-[#2d3748] text-white border-[#e5e7eb] px-4 sm:px-6 py-3 shadow-md backdrop-blur-md justify-between mx-4 my-3 rounded-full flex items-center relative">
            <div className="flex items-center space-x-8">
                <a href="#" className="text-3xl font-bold">
                    Lodgr
                </a>
                <div className="hidden md:flex space-x-6">
                    <a href={"#"} className="transition-colors text-sm hover:text-[#becee4]">
                        Home
                    </a>
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

                <Button 
                    variant="ghost" 
                    size="sm" 
                    asChild
                    className="text-sm hidden md:flex rounded-full hover:bg-[#5eead4]"
                >
                    <a href={"#"}>Log In</a>    
                </Button>

                <Button size="sm" asChild className="text-sm bg-[#475569] border-2 border-[#475569] rounded-full hover:bg-[#64748b] hover:text-[#5eead4] hover:border-[#5eead4]">
                    <a href={"#"}>Sign Up</a>
                </Button>

            </div>
        </nav>
    );
}
export default Navigation;