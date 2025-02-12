"use client"

import ZodFormInput from "@/components/shared/zodFormInput/ZodFormInput"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import './addRegularEmployee.scss'
import ZodSelectInput from "@/components/shared/zodSelectInput/ZodSelectInput"
import { useEffect } from "react"
import { createRegularEmployeeData, isNameEditable, isObjectSame } from "@/services"
import toast from "react-hot-toast"
import { addRegularEmployee, editRegularEmployee } from "@/redux/slices/commonSlice"
import { useDispatch } from "react-redux"
import { designationOptions } from "@/data"
import { createRegularEmployee, updateRegularEmployee } from "@/lib/actions/officials"
import { errResponse } from "@/lib/utils"

const regularEmployeeSchema = z.object({
    employee_id: z.string().min(1, { message: "Employee ID Required" }).max(20),
    name: z.string().min(1, { message: "Name Required" }).max(50),
    designation: z.string().min(1, { message: "Designation Required" }).max(20),
    pay: z.number().min(0, { message: "Pay must be non-negative" }),
    leave_balance: z.object({
        cl: z.number().min(0),
        rh: z.number().min(0),
        el: z.number().min(0),
    })
})

const AddRegularEmployee = ({ office, editData, setEditData, setOpen }) => {
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({ resolver: zodResolver(regularEmployeeSchema) })

    const handleClose = () => {
        setOpen(false)
        setEditData(null)
    }

    const onEmployeeDataSubmit = async (data) => {
        const employeeData = {
            ...data,
            pay: Number(data.pay),
            leave_balance: {
                cl: Number(data.leave_balance.cl),
                rh: Number(data.leave_balance.rh),
                el: Number(data.leave_balance.el),
            },
            name: data.name.trim().toLowerCase(),
            designation: data.designation.trim().toLowerCase(),
            office:office.id,
        };

        let res = null;
        if (editData) {
            if (isObjectSame(editData, employeeData)) return toast.error("No changes");
            if (!isNameEditable(editData.name, employeeData.name)) return toast.error("Names are too different and not editable.");

            res = await updateRegularEmployee(editData.documentId, employeeData);
            if (!res.error) {
                toast.success("Employee Updated Successfully");
                setOpen(false);
                return setEditData(null);
            }
        } else {
            res = await createRegularEmployee(employeeData);
            if (!res.error) {
                toast.success("Employee Added Successfully");
                return setOpen(false);
            }
        }

        if (res?.error) toast.error(res.error);
    };


    useEffect(() => {
        if (editData) {
            reset({
                ...editData,
                leave_balance: {
                    cl: editData.leave_balance?.cl || 0,
                    rh: editData.leave_balance?.rh || 0,
                    el: editData.leave_balance?.el || 0,
                }
            })
        }
    }, [editData])

    return (
        <div className="addRegularEmployee">
            <div className="modal">
                <span className="close" onClick={handleClose}>X</span>
                <h1>{editData ? "Update " : "Add New Regular"} Employee</h1>
                <form onSubmit={handleSubmit(onEmployeeDataSubmit, (errors) => {
                    console.error("React Hook Form errors:", errors);
                    toast.error("Please fix the form errors.");
                })}>
                    <div className="item">
                        <label>Employee ID *</label>
                        <ZodFormInput type="text" name="employee_id" register={register} placeholder="Employee ID" error={errors["employee_id"]} />
                    </div>
                    <div className="item">
                        <label>Designation *</label>
                        <ZodSelectInput name="designation" register={register} defaultValue="Select" options={designationOptions} error={errors['designation']} />
                    </div>

                    <div className="item">
                        <label>Name *</label>
                        <ZodFormInput type="text" name="name" register={register} placeholder="Name" error={errors["name"]} />
                    </div>

                    <div className="item">
                        <label>Pay *</label>
                        <ZodFormInput type="number" name="pay" register={register} placeholder="Pay" error={errors["pay"]} />
                    </div>

                    <div className="item">
                        <label>CL *</label>
                        <ZodFormInput type="number" name="leave_balance.cl" register={register} placeholder="Casual Leave" error={errors.leave_balance?.cl} />
                    </div>

                    <div className="item">
                        <label>RH *</label>
                        <ZodFormInput type="number" name="leave_balance.rh" register={register} placeholder="Restricted Holiday" error={errors.leave_balance?.rh} />
                    </div>

                    <div className="item">
                        <label>EL *</label>
                        <ZodFormInput type="number" name="leave_balance.el" register={register} placeholder="Earned Leave" error={errors.leave_balance?.el} />
                    </div>

                    <input type="submit" className={isSubmitting ? "disabled" : ""} defaultValue={isSubmitting ? (editData ? "Updating..." : "Adding...") : (editData ? "Update" : "Add")} disabled={isSubmitting} />
                </form>
            </div>
        </div>
    )
}

export default AddRegularEmployee;