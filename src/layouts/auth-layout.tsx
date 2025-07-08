import { Outlet } from "react-router-dom"

const AuthLayout = () => {
  return (
    <div className="w-screen h-screen flex items-center overflow-hidden justify-center relative">
        <img src="/assets/images/auth-bg.png" 
        alt="" 
        className="absolute w-full h-full object-cover opacity-20" />
        <Outlet />
    </div>
  )
}

export default AuthLayout