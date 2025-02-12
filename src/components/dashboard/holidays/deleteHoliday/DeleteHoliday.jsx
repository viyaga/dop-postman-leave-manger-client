import './deleteHoliday.scss'
import { deleteHoliday } from '@/redux/slices/commonSlice'
import { useDispatch } from 'react-redux'
import { useTransition } from 'react'
import toast from 'react-hot-toast'
import { delHoliday } from '@/lib/actions/holidays'
import { errResponse } from '@/services'

const DeleteHoliday = ({ deleteData, setDeleteData }) => {
    const [isLoading, startTransiton] = useTransition()
    const dispatch = useDispatch()

    const handleDelete = () => {

        startTransiton(async () => {
            const res = await delHoliday(deleteData.id)

            if (res?.error) {
                return toast.error(errResponse(res?.error))
            }

            toast.success("Deleted Successfully")
            setDeleteData(null)
        })
    }

    return (
        <div className="deleteHoliday">
            <div className="modal">
                <h1>Are you sure you want to delete {deleteData.holiday}&apos;s data? This action cannot be undone</h1>
                <div className="buttons">
                    <button className={isLoading ? "deleteBtn disabled" : "deleteBtn"} onClick={handleDelete} disabled={isLoading}>{isLoading ? "Deleting..." : "Delete"}</button>
                    <button className={isLoading ? "cancelBtn disabled" : "cancelBtn"} onClick={() => setDeleteData(null)} disabled={isLoading}>Cancel</button>
                </div>
            </div>
        </div>
    )
}

export default DeleteHoliday