"use client"

import ZodFormInput from "@/components/shared/zodFormInput/ZodFormInput"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import './filter.scss'
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import moment from "moment"
import { dateToIsoString, findNumberOfDays } from "@/services"
import toast from "react-hot-toast"
import ZodSelectInput from "@/components/shared/zodSelectInput/ZodSelectInput"

const filterSchema = z.object({
    fromDate: z.string().min(1, { message: "Date Required" }).max(12),
    toDate: z.string().min(1, { message: "Date Required" }).max(12),
    officeId: z.string().max(50),
    employeeId: z.string().max(50),
    substituteId: z.string().max(50),
    leaveType: z.string().max(50),
    remarks: z.string().max(100),
})

const Filter = ({ setIsFilterOpen, setIsLoading, substitutes, employees }) => {

    // get unique offices =======================================
    const officesString = employees.map((item) => {
        const string = JSON.stringify({ _id: item.officeId, officeName: item.officeName })
        return string
    })
    const uniqueOfficeSet = new Set(officesString)
    const offices = Array.from(uniqueOfficeSet).map((jsonString) => JSON.parse(jsonString)).sort((a, b) => a.officeName.localeCompare(b.officeName))

    //====================================================

    const pathname = usePathname()
    const searchParams = useSearchParams()
    const router = useRouter()

    const currentDate = new Date()
    const from = searchParams.get('fromDate') || currentDate
    const to = searchParams.get('toDate') || currentDate

    const defaultValues = {
        fromDate: moment(from).format("YYYY-MM-DD"),
        toDate: moment(to).format("YYYY-MM-DD"),
        officeId: searchParams.get('officeId') || '',
        employeeId: searchParams.get('employeeId') || '',
        substituteId: searchParams.get('substituteId') || '',
        leaveType: searchParams.get('cat') || '',
        remarks: searchParams.get('remarks') || ''
    }

    const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(filterSchema), defaultValues })

    const formInputs = [
        { type: "date", name: "fromDate", placeholder: "From", label: "From" },
        { type: "date", name: "toDate", placeholder: "To", label: "To" },
    ]

    const leaveTypeOptions = ['Paid Leave', 'LWA', 'Stop Gap Arrangement', 'Maternity', 'Training', 'Others']
    const remarkOptions = ['Personal affairs', 'Officiating', 'POD', 'Induction training', 'Maternity leave', 'Medical affairs']

    const onFilterSubmit = async (props) => {
        const { fromDate, toDate, officeId, employeeId, substituteId, leaveType, remarks } = props
        const fromDateIso = dateToIsoString(fromDate)
        const toDateIso = dateToIsoString(toDate)
        const days = findNumberOfDays(fromDate, toDate)
        if (days < 1) return toast.error("Invalid Date")

        router.push(`${pathname}/?cat=${leaveType}&&fromDate=${fromDateIso}&&toDate=${toDateIso}&officeId=${officeId}&employeeId=${employeeId}&substituteId=${substituteId}&remarks=${remarks}`)
        setIsFilterOpen(false)
        setIsLoading(true)
    }

    return (
        <div className="approvedLeaveFilter">
            <div className="modal">
                <span className="close" onClick={() => setIsFilterOpen(false)}>
                    X
                </span>
                <h1>Filter</h1>
                <form onSubmit={handleSubmit(onFilterSubmit)}>

                    {formInputs.map(item => {
                        return (
                            <div className="item" key={item.label}>
                                <label>{item.label}</label>
                                <ZodFormInput type={item.type} name={item.name} register={register} placeholder={item.placeholder} error={errors[item.name]} />
                            </div>
                        )
                    })}
                    <div className="item">
                        <label><p>Office</p><span>(optional)</span></label>
                        <div>
                            <select {...register("officeId")}>
                                <option value="">Any</option>
                                {offices && offices.map((item, index) =>
                                    <option key={index} value={item._id}>{item.officeName}</option>
                                )}
                            </select>
                            {errors.officeId && (
                                <p style={{ paddingTop: '5px', fontWeight: 600, color: 'orange' }} >{errors.officeId.message}</p>
                            )}
                        </div>
                    </div>
                    <div className="item">
                        <label><p>Employee</p><span>(optional)</span></label>
                        <div>
                            <select {...register("employeeId")}>
                                <option value="">Any</option>
                                {employees && employees.sort((a, b) => a.name.localeCompare(b.name)).map((item, index) =>
                                    <option key={index} value={item._id}>{item.name}</option>
                                )}
                            </select>
                            {errors.employeeId && (
                                <p style={{ paddingTop: '5px', fontWeight: 600, color: 'orange' }} >{errors.employeeId.message}</p>
                            )}
                        </div>
                    </div>
                    <div className="item">
                        <label><p>Substitute</p><span>(optional)</span></label>
                        <div>
                            <select {...register("substituteId")}>
                                <option value="">Any</option>
                                {substitutes && substitutes.map((item, index) =>
                                    <option key={index} value={item._id}>{item.name}</option>
                                )}
                            </select>
                            {errors.substituteId && (
                                <p style={{ paddingTop: '5px', fontWeight: 600, color: 'orange' }} >{errors.substituteId.message}</p>
                            )}
                        </div>
                    </div>
                    <div className="item">
                        <label>Leave Type</label>
                        <ZodSelectInput name="leaveType" register={register} defaultValue="Any" options={leaveTypeOptions} error={errors['leaveType']} />
                    </div>
                    <div className="item">
                        <label><p>Remarks</p><span>(optional)</span></label>
                        <ZodSelectInput name="remarks" register={register} defaultValue="Any" options={remarkOptions} error={errors['remarks']} />
                    </div>
                    <input type="submit" defaultValue="Submit" />
                </form>
            </div>
        </div>
    )
}

export default Filter
