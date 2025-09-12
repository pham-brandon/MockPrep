import { useAuth, UserButton } from "@clerk/clerk-react"
import { LogIn } from "lucide-react"
import { Button } from "./ui/button"
import { Link } from "react-router-dom"

const ProfileContainer = () => {
    const { isSignedIn } = useAuth()

    return <div className="items-center flex gap-6">
        {isSignedIn ? <UserButton afterSignOutUrl="/"/> : (
            <Link to={"/signin"}>
                <Button size={"sm"} className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
                    <LogIn className="w-4 h-4" />
                    Login
                </Button>
            </Link>
        )}
    </div>
}

export default ProfileContainer