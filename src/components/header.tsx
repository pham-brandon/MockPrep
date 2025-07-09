import { cn } from "@/lib/utils"
import { useAuth } from "@clerk/clerk-react"
import { Container } from "lucide-react"
import { LogoContainer } from "./logo-container"
import { NavigationRoutes } from "./navigation-routes"
import { NavLink } from "react-router-dom"
import ProfileContainer from "./profile-container"
import { ToggleContainer } from "./toggle-container"

const Header = () => {
  const {userId} = useAuth()

  return (
    <header 
      className={cn("w-full border-b duration-150 transition-all ease-in-out")}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-4 w-full">
          {/*logo*/}
          <LogoContainer />
          {/*nav*/}
          <nav className="hidden md:flex items-center gap-3">
            <NavigationRoutes />
            {userId && (
                          <NavLink to={"/practice"} className={(isActive)=> cn("text-base text-neutral-600", isActive && "text-neutral-900 font-semibold")}>

                          Start Mock Interview
                      </NavLink>
            )}
          </nav>
          
          <div className="ml-auto flex gap-6 items-center">
            {/* profile */}
            <ProfileContainer />
            {/* mobile */}
            <ToggleContainer />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header