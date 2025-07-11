import { Outlet } from "react-router-dom"
import Header from "@/components/header"
import Footer from "@/components/footer"
import AuthHandler from "@/handlers/auth-handler"
import { Container } from "@/components/container"

export const MainLayout = () => {
    return (
        <div className="flex flex-col h-screen">
            {/* handler that stores user data */}
            <AuthHandler />
            <Header />

            <Container className="flex-grow">
                <main className="flex-grow">
                    <Outlet/>
                </main>
            </Container>

            <Footer />
        </div>
    )
}