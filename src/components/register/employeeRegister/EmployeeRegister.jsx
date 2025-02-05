"use client"

import React, { useTransition } from 'react'
import toast from 'react-hot-toast'
import { loginUser } from '@/lib/actions/admin'
import { useRouter } from 'next/navigation'

const EmployeeRegister = () => {
	const [isPending, startTransition] = useTransition()
	const router = useRouter()

	const onLogin = (formData) => {
		// const { email, password } = Object.fromEntries(formData)
		// if (!email || !password) return toast.error("Please enter the required field")
	
		// startTransition(async () => {
		// 	const res = await loginUser(email, password)

		// 	if (res?.error) {
		// 		toast.error(res.error)
		// 	} else {
		// 		toast.success(res?.success)
		// 		router.replace('/dashboard')
		// 	}
		// })
	}

	const changeLogin = () => {
		const wrapper = document.querySelector(".wrapper")
		wrapper.classList.add("active")
	}

	return (
		<div className="form login">
			<header onClick={changeLogin}>Employee</header>
			<form action={onLogin}>
				<input type="text" placeholder="Employee Id" name='email' />
				<input type="password" placeholder="Password" name='password' />
				<a href="#">Forgot password?</a>
				<input type="submit" defaultValue={isPending ? "Loading..." : "Register"} />
			</form>
		</div>
	)
}

export default EmployeeRegister