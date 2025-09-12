import { cn } from "@/lib/utils"
import { LogoContainer } from "./logo-container"
import ProfileContainer from "./profile-container"
import { ToggleContainer } from "./toggle-container"

const Header = () => {
  

  return (
    <header 
      className={cn("w-full border-b duration-150 transition-all ease-in-out")}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between w-full">
          {/*logo*/}
          <LogoContainer />
          
          <div className="flex-1 hidden md:block">
            {/* Empty flex-1 to push content to the right */}
          </div>
          
          <div className="flex items-center gap-4">
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