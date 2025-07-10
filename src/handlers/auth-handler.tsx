import { db } from "@/config/firebase.config"
import { LoaderPg } from "@/routes/loader-pg"
import type { User } from "@/types"
import { useAuth, useUser } from "@clerk/clerk-react"
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore"
import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"

const AuthHandler = () => {

    const {isSignedIn} = useAuth()
    const {user} = useUser()
    const pathname = useLocation()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        const storeUserData = async () => {
            if(isSignedIn && user){
                setLoading(true)
                try {
                    
                } catch (error) {
                    const userSnap = await getDoc(doc(db, "users", user.id))
                    if(!userSnap.exists()){
                        const userData : User = {
                            id : user.id,
                            name: user.fullName || user.firstName || "Anonymous",
                            email: user.primaryEmailAddress?.emailAddress || "N/A",
                            imageURL: user.imageUrl,
                            createdAt: serverTimestamp(),
                            updateAt: serverTimestamp()

                        }
                        await setDoc(doc(db, "users", user.id), userData)
                    }
                    console.log("Error storing user data : ", error)
                } finally {
                    setLoading(false)
                }
            }
        }
        storeUserData()
    }, [isSignedIn, user, pathname, navigate])

    if(loading) {
        return <LoaderPg/>
    }

    return null
}
export default AuthHandler