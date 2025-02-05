import Navbar from '@/components/dashboard/shared/navbar/Navbar'
import Menu from '@/components/dashboard/shared/menu/Menu'
import Footer from '@/components/dashboard/shared/footer/Footer'
import { redirect } from "next/navigation"
import { auth } from "@/auth"

const layout = async({ children }) => {
    const au = await auth()

    if (!(au?.user?.email)) {
      redirect('/')
    }

    return (
        <div className="main">
            <Navbar />
            <div className="container">
                <div className="menuContainer" id='menu'>
                    <Menu />
                </div>
                <div className="contentContainer">
                    {children}
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default layout