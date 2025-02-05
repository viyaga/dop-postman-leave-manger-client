"use client"

import Link from "next/link"

const LinkItem = ({ url, icon, title }) => {
    const handleClose = () => {
        document.getElementById('menu').classList.remove('active')
        document.getElementById('backdrop').classList.remove('active')
    }

    return (
        <Link href={url} className="listItem" onClick={handleClose}>
            {icon}
            <span className="listItemTitle">{title}</span>
        </Link>
    )
}

export default LinkItem