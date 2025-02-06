import RegularEmployee from '@/components/dashboard/employee/regular/RegularEmployee'
import { strapiFetch } from '@/lib/actions/common'
import { getAllOfficials } from '@/lib/actions/officials'
import { errResponse } from '@/services'

const fetchAllOffices = async () => {
  try {
    const res = await strapiFetch({ path: "/offices", revalidateTime: 3600 * 24 * 365 })
    
    return res?.body?.data
  } catch (error) {
    return { error: errResponse(error) }
  }
}

const transformData = (employees) => {
  return employees.map((emp, index) => ({
    ...emp,
    sNo: index + 1,
    cl: emp.leave_balance?.cl ?? 0,
    rh: emp.leave_balance?.rh ?? 0,
    el: emp.leave_balance?.el ?? 0,
  }));
};

const page = async () => {
  const offices = await fetchAllOffices()
  
  if (offices?.error) return <p>An Error Occured While Fetching Data</p>

  let regularEmployees = await getAllOfficials()
  regularEmployees = transformData(regularEmployees)

  if (regularEmployees?.error) return <p>An Error Occured While Fetching Data</p>

  return (
    <RegularEmployee offices={offices} regularEmployees={regularEmployees} />
  )
}

export default page