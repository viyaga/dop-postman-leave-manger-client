import ZodFormInput from "@/components/shared/zodFormInput/ZodFormInput"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import './addSubstituteEmployee.scss'
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { createSubstituteEmployeeData, isNameEditable, isObjectSame, updateSubstituteEmployeeData } from "@/services"
import toast from "react-hot-toast"
import { addSubstituteEmployee, editSubstituteEmployee } from "@/redux/slices/commonSlice"

const substituteSchema = z.object({
    name: z.string().min(1, { message: "Name Required" }).max(50),
    accountNo: z.string().min(1, { message: "Invalid" }).max(20),
})

const AddSubstituteEmployee = ({ editData, setEditData, setOpen }) => {
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({ resolver: zodResolver(substituteSchema) })
    const dispatch = useDispatch()

    const formInputs = [
        { type: "text", name: "name", placeholder: "Name", label: "Name" },
        { type: "text", name: "accountNo", placeholder: "Account Number", label: "Account Number" },
    ]

    const handleClose = () => {
        setOpen(false)
        setEditData(null)
    }

    const onEmployeeDataSubmit = async ({ name, accountNo }) => {

        const substituteData = {
            name: name.trim().toLowerCase(),
            accountNo: accountNo.trim()
        }

        let res = null
        if (editData) {

            const existingData = {
                name: editData.name,
                accountNo: editData.accountNo,
            }

            if (isObjectSame(existingData, substituteData)) return toast.error("No changes")

            const isEditable = isNameEditable(editData.name, substituteData.name)
            if (!isEditable) return toast.error("Names are too different and not editable. If you wish to add a new employee, please provide new data. If you intend to edit an employee's name, kindly consult your database manager.", { duration: 10000 })

            res = await updateSubstituteEmployeeData(editData._id, substituteData)
            if (res.success) {
                toast.success(res.success)
                setOpen(false)
                setEditData(null)
                dispatch(editSubstituteEmployee(res.employee))
            }
        } else {
            res = await createSubstituteEmployeeData(substituteData)
            if (res.success) {
                toast.success(res.success)
                setOpen(false)
                dispatch(addSubstituteEmployee(res.employee))
            }
        }

        if (res.error) return toast.error(res.error)

    }

    useEffect(() => {
        if (editData) {
            reset(editData)
        }
    }, [editData])

    return (
        <div className="addSubstituteEmployee">
            <div className="modal">
                <span className="close" onClick={handleClose}>
                    X
                </span>
                <h1>{editData ? "Update Substitute Employee" : "Add New Substitute"}</h1>
                <form onSubmit={handleSubmit(onEmployeeDataSubmit)}>

                    {formInputs.map(item => {
                        return (
                            <div className="item" key={item.label}>
                                <label>{item.label}</label>
                                <ZodFormInput type={item.type} name={item.name} register={register} placeholder={item.placeholder} error={errors[item.name]} />
                            </div>
                        )
                    })}
                    {editData
                        ? <input type="submit" className={isSubmitting ? "disabled" : ""} defaultValue={isSubmitting ? "Updating..." : "Update"} disabled={isSubmitting} />
                        : <input type="submit" className={isSubmitting ? "disabled" : ""} defaultValue={isSubmitting ? "Adding..." : "Add"} disabled={isSubmitting} />
                    }
                </form>
            </div>
        </div>
    )
}

export default AddSubstituteEmployee