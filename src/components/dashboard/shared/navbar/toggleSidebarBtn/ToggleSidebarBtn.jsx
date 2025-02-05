'use client'

import { MdMenu } from "react-icons/md"

const ToggleSidebarBtn = () => {
    const openSideBar = () => {
        document.getElementById('menu').classList.add('active')
        document.getElementById('backdrop').classList.add('active')
    }
    return (
        <div className="menu-bar" onClick={openSideBar}>
            <MdMenu size={24} />
        </div>
    )
}

export default ToggleSidebarBtn