"use client"

import { useEffect, useState } from "react";
import './pendingLeaveRequest.scss'
import { leaveDataColums } from '@/data'
import DataTableWithActions from "../shared/dataTableWithActions/DataTableWithActions";
import AddLeaveData from "./addLeaveData/AddLeaveData";
import { useDispatch, useSelector } from "react-redux";
import { setLeaves } from "@/redux/slices/commonSlice";
import DeleteLeaveData from "./deleteLeaveData/DeleteLeaveData";
import DashboardLoading from "@/components/shared/dashboardLoading/DashboardLoading";
import { getPendngLeaveData } from "@/services";
import toast from "react-hot-toast";

const PendingLeaveRequest = ({ substitutes, employees, holidays }) => {
  const { leaveData } = useSelector(state => state.common)
  const [loading, setIsLoading] = useState(true)
  const [deleteData, setDeleteData] = useState(null)
  const [editData, setEditData] = useState(null)
  const [open, setOpen] = useState(false)
  const dispatch = useDispatch()

  const fetchData = async () => {
    const res = await getPendngLeaveData()
    if (res.error) toast.error("An Error Occured While Fetching Data")
    if (res.leaves) dispatch(setLeaves(res.leaves))
    setIsLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className="pendingLeave">
      <div className="info">
        <h2>Pending</h2>
        <button onClick={() => setOpen(true)}>Add New</button>
      </div>
      {loading
        ? <DashboardLoading />
        : (leaveData?.length > 0)
          ? < DataTableWithActions columns={leaveDataColums} rows={leaveData} setOpen={setOpen} setEditData={setEditData} setDeleteData={setDeleteData} />
          : <p>No Data Found</p>
      }
      {open && <AddLeaveData substitutes={substitutes} employees={employees} holidays={holidays} editData={editData} setEditData={setEditData} setOpen={setOpen} />}
      {deleteData && <DeleteLeaveData deleteData={deleteData} setDeleteData={setDeleteData} />}
    </div>
  )
}

export default PendingLeaveRequest