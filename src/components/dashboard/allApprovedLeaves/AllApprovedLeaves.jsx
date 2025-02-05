"use client"

import { useEffect, useState } from "react";
import './allApprovedLeaves.scss'
import { approvedLeaveDataColums } from '@/data'
import { useDispatch, useSelector } from "react-redux";
import { setApprovedLeaves } from "@/redux/slices/commonSlice";
import DashboardLoading from "@/components/shared/dashboardLoading/DashboardLoading";
import { MdFilterList } from "react-icons/md";
import DataTableWithCancel from "./dataTableWithCancel/DataTableWithCancel";
import Filter from "./filter/Filter";
import CancelLeaveApproval from "./cancelLeaveApproval/CancelLeaveApproval";
import { getLeaveDataByCategory } from "@/services";
import toast from "react-hot-toast";

const AllApprovedLeaves = ({ substitutes, employees, searchParamsObj }) => {
  const { allLeaves } = useSelector(state => state.common)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [cancelationData, setCancelationData] = useState(null)
  const dispatch = useDispatch()

  const calculateTotalDays = () => {
    let totalDays = 0;
    for (const leave of allLeaves) {
      totalDays += leave.days;
    }
    return totalDays;
  };

  const fetchData = async (searchParamsObj) => {
    const res = await getLeaveDataByCategory(searchParamsObj)
    if (res.error) toast.error(res.error)
    if (res.leaves) dispatch(setApprovedLeaves(res.leaves))
    setIsLoading(false)
  }

  let totalLeaveDays = 0
  if (allLeaves?.length > 0) {
    totalLeaveDays = calculateTotalDays()
  }

  useEffect(() => {
    fetchData(searchParamsObj)
  }, [searchParamsObj])

  return (
    <div className="approvedLeave">
      <div className="info">
        <div className="title-and-filter">
          <h2>Approved</h2>
          <div className="btn" onClick={() => setIsFilterOpen(true)}><MdFilterList size={24} /></div>
        </div>
        <p className="leave-days">Total: {totalLeaveDays} {totalLeaveDays < 2 ? "Day" : "Days"}</p>
      </div>
      {isLoading
        ? <DashboardLoading />
        : (allLeaves?.length > 0)
          ? < DataTableWithCancel columns={approvedLeaveDataColums} rows={allLeaves} setCancelationData={setCancelationData} />
          : <p>No Data Found</p>
      }
      {isFilterOpen && <Filter setIsFilterOpen={setIsFilterOpen} setIsLoading={setIsLoading} substitutes={substitutes} employees={employees} />}
      {cancelationData && <CancelLeaveApproval cancelationData={cancelationData} setCancelationData={setCancelationData} />}
    </div>
  )
}

export default AllApprovedLeaves
