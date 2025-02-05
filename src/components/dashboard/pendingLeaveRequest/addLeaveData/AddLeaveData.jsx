import ZodFormInput from "@/components/shared/zodFormInput/ZodFormInput"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import './addLeaveData.scss'
import ZodSelectInput from "@/components/shared/zodSelectInput/ZodSelectInput"
import toast from "react-hot-toast"
import { createLeaveData, findNumberOfDays, getEmployeeName, getMonthAndYear, getNonWorkingSubstitute, isHoliday, updatePendingLeaveData } from "@/services"
import { useDispatch } from "react-redux"
import { addLeave, editLeave } from "@/redux/slices/commonSlice"
import { useEffect } from "react"
import moment from "moment"
import { designationOptions } from "@/data"

const leaveSchema = z.object({
    name: z.string().min(1, { message: "Name Required" }).max(50),
    designation: z.string().min(1, { message: "Designation Required" }).max(20),
    officeName: z.string().min(1, { message: "Office Required" }).max(50),
    from: z.string().min(1, { message: "Invalid Date" }).max(20),
    to: z.string().min(1, { message: "Invalid Date" }).max(20),
    substituteName: z.string().min(1, { message: "Substitute Required" }).max(50),
    accountNo: z.string().min(1, { message: "Account NO Required" }).max(20),
    remarks: z.string().min(1, { message: "Remarks Required" }).max(100),
    leaveType: z.string().min(1, { message: "Leave Type Required" }).max(100),
    status: z.string().min(1, { message: "Status Required" }).max(20),
})

const AddLeaveData = ({ substitutes, employees, holidays, editData, setEditData, setOpen }) => {
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset, getValues, setValue } = useForm({ resolver: zodResolver(leaveSchema), defaultValues: { employeeId: '' } })
    const dispatch = useDispatch()

    //Alter substitutes array ==================================
    const combinedDutyIndex = substitutes.findIndex(substitute => substitute.name === "combined duty")

    if (combinedDutyIndex !== -1) {
        const combinedDutyEle = substitutes.splice(combinedDutyIndex, 1)[0]
        substitutes.unshift(combinedDutyEle)
    }
    // =========================================================

    // get unique offices =======================================
    const officesString = employees.map((item) => {
        const string = JSON.stringify({ _id: item.officeId, officeName: item.officeName })
        return string
    })
    const uniqueOfficeSet = new Set(officesString)
    const offices = Array.from(uniqueOfficeSet).map((jsonString) => JSON.parse(jsonString)).sort((a, b) => a.officeName.localeCompare(b.officeName))
    //====================================================

    const remarkOptions = ['Personal affairs', 'Officiating', 'Stop Gap arrangement', 'POD', 'Induction training', 'Maternity leave', 'Medical affairs']
    const leaveTypeOptions = ['Paid Leave', 'LWA', 'Stop Gap Arrangement', 'Maternity', 'Training', 'Others']
    const leaveStatusOptions = ['Pending', 'Approved']

    const handleClose = () => {
        setOpen(false)
        setEditData(null)
    }

    const fetchEmployeeName = async (e) => {
        if (!editData && !e?.target?.value) {
            setValue('name', '')
        }

        if (getValues('officeName')) {
            const employee = employees.find((data) => ((data.officeId === getValues('officeName')) && (data.designation === e.target.value)))

            if (!employee?.name) {
                setValue('name', '')
                toast.error("Employee Not Found")
                return
            }

            setValue('name', employee.name)
        }

    }

    const fetchEmployeeName1 = async (e) => {
        if (!e.target.value) return setValue('name', '')

        if (!getValues('designation') || !e.target.value) return

        const employee = employees.find((data) => ((data.designation === getValues('designation')) && (data.officeId === e.target.value)))

        if (!employee?.name) {
            setValue('name', '')
            toast.error("Employee Not Found")
            return
        }

        console.log({ employee });
        setValue('name', employee.name)

    }

    const getEmployeeAccount = (e) => {
        if (e.target.value === "combined duty") {
            setValue('accountNo', "NA")
            return
        }
        const accountNo = substitutes.filter((item) => item._id === e.target.value)[0]?.accountNo
        setValue('accountNo', accountNo)
    }

    const checkIsHoliday = (date, elementId) => {
        const holiday = isHoliday(holidays, date)
        if (holiday) {
            return document.getElementById(elementId).innerHTML = holiday
        }

        document.getElementById(elementId).innerHTML = ""
    }

    const onLeaveDataSubmit = async (props) => {
        const { from, to } = props

        const fromDate = new Date(from)
        const toDate = new Date(to)
        const days = findNumberOfDays(fromDate, toDate)

        if (days < 1) return toast.error("Invalid Date")
        if (fromDate.getMonth() !== toDate.getMonth()) return toast.error("Send separate leave letters for different months")


        const leaveData = {
            employeeId: employees.find((data) => ((data.designation === props.designation) && (data.officeId === props.officeName)))?._id,
            name: props.name.toLowerCase(),
            designation: props.designation.toLowerCase(),
            officeId: props.officeName,
            officeName: offices.find((office) => office._id === props.officeName)?.officeName,
            leaveMonth: getMonthAndYear(fromDate),
            from: fromDate,
            to: toDate,
            days: days,
            substituteId: props.substituteName,
            substituteName: substitutes.find((item) => item._id === props.substituteName)?.name,
            accountNo: props.accountNo,
            remarks: props.remarks,
            leaveType: props.leaveType,
            status: props.status === 'approved' ? 1 : 0,
        }

        let res = null
        if (editData) {
            res = await updatePendingLeaveData(editData._id, leaveData)
            if (res.success) {
                toast.success(res.success)
                setOpen(false)
                setEditData(null)
                dispatch(editLeave(res.leave))
            }
        } else {
            res = await createLeaveData(leaveData)
            if (res.success) {
                toast.success(res.success)
                setOpen(false)
                dispatch(addLeave(res.leave))
            }
        }

        if (res.error) return toast.error(res.error, { duration: 7000 })

    }

    useEffect(() => {
        if (editData) {
            console.log({ editData });
            reset({
                ...editData, status: editData.status === 1 ? 'approved' : 'pending',
                from: moment(editData.from).format('YYYY-MM-DD'), to: moment(editData.to).format('YYYY-MM-DD'),
                officeName: editData.officeId, substituteName: editData.substituteId,
            })
        }
    }, [editData])

    return (
        <div className="addLeaveRequest">
            <div className="modal">
                <span className="close" onClick={handleClose}>
                    X
                </span>
                <h1>{editData ? "Update" : "Add New"} Request</h1>
                <form onSubmit={handleSubmit(onLeaveDataSubmit)}>

                    <div className="item">
                        <label>Designation *</label>
                        <ZodSelectInput name="designation" register={register} onChangeFunction={fetchEmployeeName} defaultValue="Select" options={designationOptions} error={errors['designation']} />
                    </div>

                    <div className="item">
                        <label>Office *</label>
                        <div>
                            <select {...register("officeName")} onChange={fetchEmployeeName1}>
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
                        <label>Name *</label>
                        <ZodFormInput type="text" disabled={true} name="name" register={register} placeholder="Name" error={errors["name"]} />
                    </div>

                    <div className="item">
                        <label>Remarks</label>
                        <ZodSelectInput name="remarks" register={register} defaultValue="Select" options={remarkOptions} error={errors['remarks']} />
                    </div>

                    <div className="item">
                        <label><p>From *</p><span id="fromDate"></span></label>
                        <ZodFormInput type="date" name="from" register={register} placeholder="From *" error={errors["from"]} onChangeFunction={(e) => checkIsHoliday(e.target.value, "fromDate")} />
                    </div>

                    <div className="item">
                        <label><p>To *</p><span id="toDate"></span></label>
                        <ZodFormInput type="date" name="to" register={register} placeholder="To *" error={errors["to"]} onChangeFunction={(e) => checkIsHoliday(e.target.value, "toDate")} />
                    </div>

                    <div className="item">
                        <label>Substitute *</label>
                        <div>
                            <select {...register("substituteName")} onChange={getEmployeeAccount}>
                                <option value="">Select</option>
                                {substitutes && substitutes.map((item, index) =>
                                    <option key={index} value={item._id}>{item.name}</option>
                                )}
                            </select>
                            {errors.substituteName && (
                                <p style={{ paddingTop: '5px', fontWeight: 600, color: 'orange' }}>{errors.substituteName.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="item">
                        <label>Account *</label>
                        <ZodFormInput type="text" disabled={true} name="accountNo" register={register} placeholder="Account Number" error={errors["accountNo"]} />
                    </div>

                    <div className="item">
                        <label>Leave Type</label>
                        <ZodSelectInput name="leaveType" register={register} defaultValue="Select" options={leaveTypeOptions} error={errors['leaveType']} />
                    </div>
                    <div className="item">
                        <label>Status *</label>
                        <ZodSelectInput name="status" register={register} defaultValue="Select" options={leaveStatusOptions} error={errors['status']} />
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

export default AddLeaveData
