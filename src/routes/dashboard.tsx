import { Headings } from "@/components/headings"
import { Button } from "@/components/ui/button"
import { Separator } from "@radix-ui/react-separator"
import { Plus } from "lucide-react"
import { Link } from "react-router-dom"

export const Dashboard = () => {
  return (
    <div className="w-full p-8">
        {/* Headings */}
        <Headings
          title="Practice"
          description="Start practicing with AI Mock Interviews Now!"
        />
        <Link to={"/practice/create"}></Link>
        <Button size={"sm"}>
            <Plus /> Add New
        </Button>
        <Separator className="my-8" />
        {/* Content */}
        
    </div>
  )
}
