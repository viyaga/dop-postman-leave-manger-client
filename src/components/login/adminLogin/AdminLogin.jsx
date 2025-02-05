"use client"

import ZodFormInput from '@/components/shared/zodFormInput/ZodFormInput'
import ZodSelectInput from '@/components/shared/zodSelectInput/ZodSelectInput'
import { subDivisionOptions } from '@/data'
import { loginUser } from '@/lib/actions/admin'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import React, { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { z } from 'zod'
// import { registerUser } from '@/lib/actions'

const loginSchema = z.object({
    email: z.string().email().min(1, { message: "Email Required" }).max(75, { message: "Email must contain at most 75 characters" }),
    password: z.string().min(6, { message: "Password  must contain at least 6 characters" }).max(20, { message: "Password must contain at most 20 characters" }),
    subdivisionName: z.string().min(1, { message: "Subdivision Required" }).max(75, { message: "Subdivision must contain at most 75 characters" })
})

const AdminLogin = () => {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(loginSchema) })
    const [isChecked, setIsChecked] = useState(false)
    const router = useRouter()

    const formInputs = [
        { type: "text", name: "email", placeholder: "Email" },
        { type: "password", name: "password", placeholder: "Password" },
    ]

    const onLogin = async ({ email, password, subdivisionName }) => {

        if (!email || !password || !subdivisionName) return toast.error("Please enter the required field")

        const res = await loginUser(email.toLowerCase(), password, subdivisionName.toLowerCase())

        if (res?.error) {
            toast.error(res.error)
        } else {
            toast.success(res?.success)
            const form = document.getElementById("adminLogin")
            form.reset()
            router.replace('/dashboard/')
        }
    }

    const changeSignUp = () => {
        const wrapper = document.querySelector(".wrapper")
        wrapper.classList.remove("active");

    }

    return (
        <div className="form signup">
            <header onClick={changeSignUp}>Admin</header>
            <form onSubmit={handleSubmit(onLogin)} id='adminLogin'>

                {formInputs.map(item => {
                    return (
                        <ZodFormInput key={item.name} type={item.type} name={item.name} register={register} placeholder={item.placeholder} error={errors[item.name]} />
                    )
                })}

                <ZodSelectInput name='subdivisionName' register={register} defaultValue='Select' options={subDivisionOptions} error={errors['subdivisionName']} />

                <div className="checkbox">
                    <input type="checkbox" id="admionLoginRememberMe" checked={isChecked} onChange={() => setIsChecked(!isChecked)} />
                    <label htmlFor="admionLoginRememberMe">Remember Me</label>
                </div>
                <input type="submit" defaultValue={isSubmitting ? "Loading..." : "Login"} />
            </form>
        </div>
    )
}

export default AdminLogin