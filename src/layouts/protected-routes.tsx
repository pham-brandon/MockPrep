import { useAuth } from "@clerk/clerk-react"
import { LoaderPg } from "@/routes/loader-pg";
import { Navigate } from "react-router-dom";

const ProtectedRoutes = ({children} : {children : React.ReactNode}) => {
  
    const {isLoaded, isSignedIn} = useAuth()

    if(!isLoaded) {
        return<LoaderPg />
    }

    if (!isSignedIn) {
        return <Navigate to={"/signin"} replace/>
    }
    return children
  
}

export default ProtectedRoutes