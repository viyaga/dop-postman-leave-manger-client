"use client"

import ZodFormInput from "@/components/shared/zodFormInput/ZodFormInput"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import './addRegularEmployee.scss'
import ZodSelectInput from "@/components/shared/zodSelectInput/ZodSelectInput"
import { useEffect } from "react"
import { createRegularEmployeeData, isNameEditable, isObjectSame, updateRegularEmployeeData } from "@/services"
import toast from "react-hot-toast"
import { addRegularEmployee, editRegularEmployee } from "@/redux/slices/commonSlice"
import { useDispatch } from "react-redux"
import { designationOptions } from "@/data"

const regularEmployeeSchema = z.object({
    name: z.string().min(1, { message: "Name Required" }).max(50),
    designation: z.string().min(1, { message: "Designation Required" }).max(20),
    officeName: z.string().min(1, { message: "Office Required" }).max(50),
})

const AddRegularEmployee = ({ offices, editData, setEditData, setOpen }) => {
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({ resolver: zodResolver(regularEmployeeSchema) })
    const dispatch = useDispatch()

    const handleClose = () => {
        setOpen(false)
        setEditData(null)
    }

    const onEmployeeDataSubmit = async ({ name, designation, officeName }) => {

        const employeeData = {
            name: name.trim().toLowerCase(),
            designation: designation.trim().toLowerCase(),
            officeId: officeName,
            officeName: offices.find((item) => item._id === officeName).officeName,
        }

        let res = null
        if (editData) {

            const existingData = {
                name: editData.name,
                designation: editData.designation,
                officeId: editData.officeId,
                officeName: editData.officeName,
            }

            if (isObjectSame(existingData, employeeData)) return toast.error("No changes")

            const isEditable = isNameEditable(editData.name, employeeData.name)
            if (!isEditable) return toast.error("Names are too different and not editable. If you wish to add a new employee, please provide new data. If you intend to edit an employee's name, kindly consult your database manager.", { duration: 10000 })

            res = await updateRegularEmployeeData(editData._id, employeeData)
            if (res.success) {
                toast.success(res.success)
                setOpen(false)
                setEditData(null)
                dispatch(editRegularEmployee(res.employee))
            }
        } else {
            res = await createRegularEmployeeData(employeeData)
            if (res.success) {
                toast.success(res.success)
                setOpen(false)
                dispatch(addRegularEmployee(res.employee))
            }
        }

        if (res.error) return toast.error(res.error)


    }

    useEffect(() => {
        if (editData) {
            reset({ ...editData, officeName: editData.officeId })
        }
    }, [editData])

    return (
        <div className="addRegularEmployee">
            <div className="modal">
                <span className="close" onClick={handleClose}>
                    X
                </span>
                <h1>{editData ? "Update " : "Add New Regular"} Employee</h1>
                <form onSubmit={handleSubmit(onEmployeeDataSubmit)}>

                    <div className="item">
                        <label>Office *</label>
                        <div>
                            <select {...register("officeName")}>
                                <option value="">Select</option>
                                {offices && offices.map((item, index) =>
                                    <option key={index} value={item._id}>{item.officeName}</option>
                                )}
                            </select>
                            {errors.officeName && (
                                <p style={{ paddingTop: '5px', fontWeight: 600, color: 'orange' }} >{errors.officeName.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="item">
                        <label>Designation *</label>
                        <ZodSelectInput name="designation" register={register} defaultValue="Select" options={designationOptions} error={errors['designation']} />
                    </div>

                    <div className="item">
                        <label>Name *</label>
                        <ZodFormInput type="text" name="name" register={register} placeholder="Name" error={errors["name"]} />
                    </div>
                    {editData
                        ? <input type="submit" className={isSubmitting ? "disabled" : ""} defaultValue={isSubmitting ? "Updating..." : "Update"} disabled={isSubmitting} />
                        : <input type="submit" className={isSubmitting ? "disabled" : ""} defaultValue={isSubmitting ? "Adding..." : "Add"} disabled={isSubmitting} />
                    }

                </form>
            </div>
        </div>
    )
}

export default AddRegularEmployee
