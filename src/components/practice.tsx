import { Outlet } from "react-router-dom"

export const Practice = () => {
  return (
    <div className="md:px-12 flex-col">
        <Outlet />
    </div>
  )
}
