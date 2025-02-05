import PendingLeaveRequest from '@/components/dashboard/pendingLeaveRequest/PendingLeaveRequest'
import { errResponse } from '@/services'

const fetchData = async () => {
  const API_URL = process.env.SERVER_ONE + '/employee/substitute/substitutes-employees-holidays'
  try {
    const response = await fetch(API_URL, { next: { revalidate: 3600 } })
    const { employees, substitutes, holidays } = await response.json()

    return { employees, substitutes, holidays }
  } catch (error) {
    return { error: errResponse(error) }
  }
}

const page = async () => {

  const res = await fetchData()
  if (res.error) return <p>An error occured try after sometimes</p>

  return (
    <PendingLeaveRequest substitutes={res.substitutes} employees={res.employees} holidays={res.holidays} />
  )
}

export default page