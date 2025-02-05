"use client"

import { MdClose } from "react-icons/md"

const CloseBtn = () => {
    const handleClose = () => {
        document.getElementById('menu').classList.remove('active')
        document.getElementById('backdrop').classList.remove('active')
    }

    return (
        <div className="close" onClick={handleClose}>
            <MdClose size={24} />
        </div>
    )
}

export default CloseBtn