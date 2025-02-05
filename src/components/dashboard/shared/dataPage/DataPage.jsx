"use client"

import { useEffect, useState } from "react";
import './data-page.scss'
import DataTable from "./dataTable/DataTable";
import { leaveDataColums, stopGapArrangementColums } from '@/data'
import FilterByDate from "./filterByDate/FilterByDate";
import { MdFilterList } from "react-icons/md";
import jsPDF from "jspdf";
import DashboardLoading from "@/components/shared/dashboardLoading/DashboardLoading";
import { useDispatch, useSelector } from "react-redux";
import { setLeaves } from "@/redux/slices/commonSlice";
import { getLeaveDataByCategory } from "@/services";
import toast from "react-hot-toast";

const DataPage = (props) => {
  const { leaveData } = useSelector(state => state.common)
  const { substitutes, employees, leaveType, searchParamsObj } = props
  const [isLoading, setIsLoading] = useState(true)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const dispatch = useDispatch()

  let columns = leaveDataColums
  if (leaveType === 'stop gap arrangement') {
    columns = stopGapArrangementColums
  }

  const fetchData = async (searchParamsObj) => {
    const res = await getLeaveDataByCategory(searchParamsObj)
    if (res.error) toast.error("An Error Occured While Fetching Data")
    if (res.leaves) dispatch(setLeaves(res.leaves))
    setIsLoading(false)
  }

  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    // Add Title
    doc.setFontSize(20);
    doc.text('Your PDF Title', 10, 20);

    // Add Description
    doc.setFontSize(12);
    doc.text('Your PDF Description', 10, 30);

    const pdfColumns = columns.map(item => item.headerName)
    doc.autoTable({
      head: [pdfColumns], // Replace with your column headers
      body: rows,
    });

    // Add Footer Signature
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text('Your Footer Signature', doc.internal.pageSize.getWidth() / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });
    }

    doc.save('data.pdf');
  };

  useEffect(() => {
    fetchData(searchParamsObj)
  }, [searchParamsObj])

  return (
    <div className="leave-requests">
      <div className="info">
        <div className="title-and-filter">
          <h2>{leaveType}</h2>
          <div onClick={() => setIsFilterOpen(true)}><MdFilterList size={24} /></div>
        </div>
        {/* <button className="pdf-btn" onClick={() => handleDownloadPDF()}>Download PDF</button> */}
      </div>
      {isLoading
        ? <DashboardLoading />
        : (leaveData?.length > 0)
          ? < DataTable columns={columns} rows={leaveData} />
          : <p>No Data Found</p>
      }
      {isFilterOpen && <FilterByDate setIsFilterOpen={setIsFilterOpen} setIsLoading={setIsLoading} substitutes={substitutes} employees={employees} />}
    </div>
  )
}

export default DataPage
