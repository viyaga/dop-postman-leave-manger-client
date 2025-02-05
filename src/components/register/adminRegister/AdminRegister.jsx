"use client"

import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import { z } from 'zod'
import { registerAdmin } from '@/lib/actions/admin'
import ZodFormInput from '@/components/shared/zodFormInput/ZodFormInput'
import { useForm } from 'react-hook-form'
import ZodSelectInput from '@/components/shared/zodSelectInput/ZodSelectInput'
import { useState } from 'react'
import { subDivisionOptions } from '@/data'

const adminSchema = z.object({
    name: z.string().min(1, { message: "Name Required" }).max(50, { message: "Name must contain at most 50 characters" }),
    email: z.string().email().min(1, { message: "Email Required" }).max(75, { message: "Email must contain at most 75 characters" }),
    password: z.string().min(6, { message: "Password  must contain at least 6 characters" }).max(20, { message: "Password must contain at most 20 characters" }),
    subdivisionName: z.string().min(1, { message: "Subdivision Required" }).max(75, { message: "Subdivision must contain at most 75 characters" })
})

const AdminRegister = () => {
    const [isChecked, setIsChecked] = useState(false)
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(adminSchema) })

    const formInputs = [
        { type: "text", name: "name", placeholder: "Name" },
        { type: "text", name: "email", placeholder: "Email" },
        { type: "password", name: "password", placeholder: "Password" },
    ]

    const onRegister = async ({ name, email, password, subdivisionName }) => {

        if (!name || !email || !password || !subdivisionName) return toast.error("Please enter the required field")
        if (!isChecked) return toast.error("Please Accept Our Terms & Conditions")

        const register = await registerAdmin(name.toLowerCase(), email.toLowerCase(), password, subdivisionName.toLowerCase())
        console.log({ register });
        if (register?.error) {
            toast.error(register.error)
        } else {
            toast.success(register?.success)
            const form = document.getElementById("register")
            form.reset()
        }
    }

    const changeSignUp = () => {
        const wrapper = document.querySelector(".wrapper")
        wrapper.classList.remove("active");
    }

    return (
        <div className="form signup">
            <header onClick={changeSignUp}>Admin</header>
            <form onSubmit={handleSubmit(onRegister)} id='register'>

                {formInputs.map(item => {
                    return <ZodFormInput key={item.name} type={item.type} name={item.name} register={register} placeholder={item.placeholder} error={errors[item.name]} />
                })}

                <ZodSelectInput name='subdivisionName' register={register} defaultValue='Select' options={subDivisionOptions} error={errors['subdivisionName']} />

                <div className="checkbox">
                    <input type="checkbox" id="signupCheck" checked={isChecked} onChange={() => setIsChecked(!isChecked)} />
                    <label htmlFor="signupCheck">I accept all terms &amp; conditions</label>
                </div>
                <input type="submit" defaultValue={isSubmitting ? "Loading..." : "Register"} />
            </form>
        </div>
    )
}

export default AdminRegister