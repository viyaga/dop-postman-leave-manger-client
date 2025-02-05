"use client"

import { ScaleLoader } from "react-spinners"
import './dashboardLoading.scss'

const DashboardLoading = () => {
    return (
        <div className="dashboard-loading">
            <ScaleLoader color="#36d7b7" />
        </div>
    )
}

export default DashboardLoading