import { cancelLeaveApproval, deletePendingLeaveData } from '@/services'
import './cancelLeaveApproval.scss'
import { cancelLeave, deletePendingLeave } from '@/redux/slices/commonSlice'
import { useDispatch } from 'react-redux'
import { useTransition } from 'react'
import toast from 'react-hot-toast'

const CancelLeaveApproval = ({ cancelationData, setCancelationData }) => {
    const [isLoading, startTransiton] = useTransition()
    const dispatch = useDispatch()

    const handleCancellation = () => {

        startTransiton(async () => {
            const res = await cancelLeaveApproval(cancelationData._id)

            if (res.error) {
                return toast.error(res.error)
            }

            if (res.success) {
                toast.success(res.success)
                dispatch(cancelLeave(cancelationData))
                setCancelationData(null)
            }
        })
    }

    return (
        <div className="deleteLeave">
            <div className="modal">
                <h1>Confirm cancellation of {cancelationData.name}&apos;s leave approval?</h1>
                <div className="buttons">
                    <button className="deleteBtn" onClick={handleCancellation}>{isLoading ? "Cancelling..." : "Confirm"}</button>
                    <button className="cancelBtn" onClick={() => setCancelationData(null)}>Back</button>
                </div>
            </div>
        </div>
    )
}

export default CancelLeaveApproval