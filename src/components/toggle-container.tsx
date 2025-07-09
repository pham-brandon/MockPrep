import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { NavigationRoutes } from "./navigation-routes"
import { useAuth } from "@clerk/clerk-react"
import { NavLink } from "react-router-dom"
import { cn } from "@/lib/utils"

export const ToggleContainer = () => {
    const {userId} = useAuth()
    return (
        <Sheet>
            <SheetTrigger className="block md:hidden"><Menu /></SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle />
                </SheetHeader>

                <nav className="flex flex-col items-start gap-6">
                <NavigationRoutes isMobile />
                {userId && (
                            <NavLink to={"/practice"} className={(isActive)=> cn("text-base text-neutral-600", isActive && "text-neutral-900 font-semibold")}>

                            Start Mock Interview
                        </NavLink>
                )}
                </nav>
            </SheetContent>
        </Sheet>
  )
}
