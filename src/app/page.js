import { auth } from '@/auth'
import Login from '@/components/login/Login'
import { redirect } from 'next/navigation'

const page = async () => {

  const au = await auth()

  if (au?.user?.email) {
    redirect('/dashboard')
  } 

  return (
    <Login />
  )
}

export default page