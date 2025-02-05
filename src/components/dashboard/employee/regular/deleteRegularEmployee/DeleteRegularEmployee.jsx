import { deleteRegularEmployeeData } from '@/services'
import './deleteRegularEmployee.scss'
import { useDispatch } from 'react-redux'
import { useTransition } from 'react'
import toast from 'react-hot-toast'
import { deleteRegularEmployee } from '@/redux/slices/commonSlice'

const DeleteRegularEmployee = ({ deleteData, setDeleteData }) => {
    const [isLoading, startTransiton] = useTransition()
    const dispatch = useDispatch()

    const handleDelete = () => {

        startTransiton(async () => {
            const res = await deleteRegularEmployeeData(deleteData._id)

            if (res.error) {
                return toast.error(res.error)
            }

            if (res.success) {
                toast.success(res.success)
                setDeleteData(null)
                dispatch(deleteRegularEmployee(deleteData))
            }
        })
    }

    return (
        <div className="deleteRegularEmployee">
            <div className="modal">
                <h1>Are you sure you want to delete regular employee {deleteData.name}? This action cannot be undone</h1>
                <div className="buttons">
                    <button className={isLoading ? "deleteBtn disabled" : "deleteBtn"} onClick={handleDelete} disabled={isLoading} >{isLoading ? "Deleting..." : "Delete"}</button>
                    <button className={isLoading ? "cancelBtn disabled" : "cancelBtn"} onClick={() => setDeleteData(null)} disabled={isLoading} >Cancel</button>
                </div>
            </div>
        </div>
    )
}

export default DeleteRegularEmployee