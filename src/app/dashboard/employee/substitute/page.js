import SubstituteEmployee from '@/components/dashboard/employee/substitute/SubstituteEmployee'
import { getAllSubstitutes } from '@/lib/actions/substitutes'

const page = async () => {
  const substituteEmployeeData = await getAllSubstitutes()
  if (substituteEmployeeData?.error) return <p>An Error Occured While Fetching Data</p>

  return (
    <SubstituteEmployee substituteEmployeeData={substituteEmployeeData} />
  )
}

export default page