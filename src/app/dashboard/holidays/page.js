import Holidays from "@/components/dashboard/holidays/Holidays"
import { getAllHolidays } from "@/lib/actions/holidays"

const HOLIDAY_API = process.env.SERVER_ONE + '/holiday'

const page = async () => {

  const holidayData = await getAllHolidays()
  console.log({holidayData})
  if (holidayData?.error) return <p>An Error Occured While Fetching Data</p>

  return (
    <Holidays holidayData={holidayData} />
  )
}

export default page