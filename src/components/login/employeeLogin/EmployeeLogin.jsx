"use client"

import toast from 'react-hot-toast'
import { loginUser } from '@/lib/actions/admin'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import ZodFormInput from '@/components/shared/zodFormInput/ZodFormInput'

const loginSchema = z.object({
	employeeId: z.string().min(1, { message: "Employee Id Required" }).max(20, { message: "Employee Id must contain at most 20 characters" }),
    password: z.string().min(6, { message: "Password  must contain at least 6 characters" }).max(20, { message: "Password must contain at most 20 characters" }),
})

const EmployeeLogin = () => {
	const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(loginSchema) })
	const router = useRouter()

	const formInputs = [
		{ type: "text", name: "employeeId", placeholder: "Employee Id" },
		{ type: "password", name: "password", placeholder: "Password" },
	]

	const onLogin = async ({ employeeId, password }) => {

		if (!employeeId || !password) return toast.error("Please enter the required field")
		const res = await loginUser(employeeId, password)

		if (res?.error) {
			toast.error(res.error)
		} else {
			toast.success(res?.success)
			router.replace('/employee')
		}
	}

	const changeLogin = () => {
		const wrapper = document.querySelector(".wrapper")
		wrapper.classList.add("active")
	}

	return (
		<div className="form login">
			<header onClick={changeLogin}>Employee</header>
			<form onSubmit={handleSubmit(onLogin)}>
				{formInputs.map(item => {
					return (
						<ZodFormInput key={item.name} type={item.type} name={item.name} register={register} placeholder={item.placeholder} error={errors[item.name]} />
					)
				})}
				<a href="#">Forgot password?</a>
				<input type="submit" defaultValue={isSubmitting ? "Loading..." : "Login"} />
			</form>
		</div>
	)
}

export default EmployeeLogin