import { auth } from '@/auth'
import RegularEmployee from '@/components/dashboard/employee/regular/RegularEmployee'
import { strapiFetch } from '@/lib/actions/common'
import { getAllOfficials } from '@/lib/actions/officials'
import { errResponse, formatRegularEmployeeData } from '@/services'

const fetchAllOffices = async () => {
  try {
    const res = await strapiFetch({ path: "/offices", revalidateTime: 3600 * 24 * 365 })
    
    return res?.body?.data
  } catch (error) {
    return { error: errResponse(error) }
  }
}

const page = async () => {
  const au = await auth()
  console.log({user:au?.user});
  
  const office = au?.user?.office
  
  if (!office) return <p>An Error Occured While Fetching Data</p>

  let regularEmployees = await getAllOfficials()
  if (regularEmployees?.error) return <p>An Error Occured While Fetching Data</p>
  regularEmployees = formatRegularEmployeeData(regularEmployees)

  return (
    <RegularEmployee office={office} regularEmployees={regularEmployees} />
  )
}

export default page