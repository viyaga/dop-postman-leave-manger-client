import ZodFormInput from "@/components/shared/zodFormInput/ZodFormInput"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import './addHoliday.scss'
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import toast from "react-hot-toast"
import moment from "moment"
import { createHoliday, updateHoliday } from "@/lib/actions/holidays"

const holidaySchema = z.object({
    holiday: z.string().min(1, { message: "Holiday Required" }).max(50),
    date: z.string().min(1, { message: "Date Required" }).max(20),
})

const AddHoliday = ({ editData, setEditData, setOpen }) => {
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({ resolver: zodResolver(holidaySchema) })

    const formInputs = [
        { type: "text", name: "holiday", placeholder: "Holiday Name", label: "Holiday" },
        { type: "date", name: "date", placeholder: "Date", label: "Date" },
    ]

    const handleClose = () => {
        setOpen(false)
        setEditData(null)
    }

    const onHolidayDataSubmit = async ({ holiday, date }) => {

        let res = null
        if (editData) {
            res = await updateHoliday(editData.id, { holiday: holiday.toLowerCase(), date })
            if (!res.error) {
                toast.success("Holiday Updated Successfully")
                setOpen(false)
                setEditData(null)
            }
        } else {
            res = await createHoliday({ holiday, date })
            if (!res.error) {
                toast.success("Holiday Added Successfully")
                setOpen(false)
            }
        }

        if (res.error) return toast.error(res.error)
    }

    useEffect(() => {
        if (editData) {
            reset({ ...editData, date: moment(editData.date).format('YYYY-MM-DD') })
        }
    }, [editData])

    return (
        <div className="addHoliday">
            <div className="modal">
                <span className="close" onClick={handleClose}>
                    X
                </span>
                <h1>{editData ? "Update" : "Add New"} Holiday</h1>
                <form onSubmit={handleSubmit(onHolidayDataSubmit)}>

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

export default AddHoliday