import DataPage from "@/components/dashboard/shared/dataPage/DataPage"
import { addIdToDataGridRows, dateToIsoString, errResponse } from "@/services"

const fetchData = async () => {
  const API_URL = process.env.SERVER_ONE + '/employee/substitute/substitutes-employees'
  try {
    const response = await fetch(API_URL, { next: { revalidate: 2 } })
    const { employees, substitutes } = await response.json()

    return { employees, substitutes }
  } catch (error) {
    return { error: errResponse(error) }
  }
}

const getLeaveDataByCategory = async (category, fromDate, toDate, officeId, employeeId, substituteId, remarks) => {
  const LEAVE_API = process.env.SERVER_ONE + '/leaves'
  try {
    const response = await fetch(`${LEAVE_API}/${category}/${fromDate}/${toDate}/${officeId}/${employeeId}/${substituteId}/${remarks}`, { next: { revalidate: 2 } })
    const { leaves } = await response.json()
    return leaves
  } catch (error) {
    return { error: errResponse(error) }
  }
}

const page = async ({ searchParams }) => {

  const res = await fetchData()
  if (res.error) return <p>An error occured while fetching try after sometimes</p>

  const leaveType = searchParams?.cat || "pending"
  const fromDate = searchParams?.fromDate || dateToIsoString(Date.now())
  const toDate = searchParams?.toDate || dateToIsoString(Date.now())
  const officeId = searchParams?.officeId || 0
  const employeeId = searchParams?.employeeId || 0
  const substituteId = searchParams?.substituteId || 0
  const remarks = searchParams?.remarks || 0

  const searchParamsObj = {leaveType, fromDate, toDate, officeId, employeeId, substituteId, remarks}

  return (
    <DataPage
      substitutes={res.substitutes} employees={res.employees}
      leaveType={leaveType} searchParamsObj={searchParamsObj}
    />
  )
}

export default page
