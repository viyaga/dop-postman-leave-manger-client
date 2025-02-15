import { deleteSubstituteEmployeeData } from '@/services'
import './deleteSubstituteEmployee.scss'
import { useDispatch } from 'react-redux'
import { useTransition } from 'react'
import toast from 'react-hot-toast'
import { deleteSubstitute } from '@/lib/actions/substitutes'
import { deleteSubstituteEmployee } from '@/redux/slices/commonSlice'

const DeleteSubstituteEmployee = ({ deleteData, setDeleteData }) => {
    const [isLoading, startTransiton] = useTransition()
    const dispatch = useDispatch()

    const handleDelete = () => {

        startTransiton(async () => {
            const res = await deleteSubstitute(deleteData.id)

            if (res?.error) {
                return toast.error("Failed to delete data")
            }

            toast.success("Data deleted successfully")
            setDeleteData(null)
            dispatch(deleteSubstituteEmployee(deleteData))
        })
    }

    return (
        <div className="deleteSubstitute">
            <div className="modal">
                <h1>Are you sure you want to delete {deleteData.name}&apos;s data? This action cannot be undone</h1>
                <div className="buttons">
                    <button className={isLoading ? "deleteBtn disabled" : "deleteBtn"} onClick={handleDelete} disabled={isLoading} >{isLoading ? "Deleting..." : "Delete"}</button>
                    <button className={isLoading ? "cancelBtn disabled" : "cancelBtn"} onClick={() => setDeleteData(null)} disabled={isLoading} >Cancel</button>
                </div>
            </div>
        </div>
    )
}

export default DeleteSubstituteEmployee