import ZodFormInput from "@/components/shared/zodFormInput/ZodFormInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import "./addSubstituteEmployee.scss";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { createSubstituteEmployeeData, isNameEditable, isObjectSame, updateSubstituteEmployeeData } from "@/services";
import toast from "react-hot-toast";
import { addSubstituteEmployee, editSubstituteEmployee } from "@/redux/slices/commonSlice";
import { createSubstitute, updateSubstitute } from "@/lib/actions/substitutes";
import moment from "moment";

const substituteSchema = z.object({
    name: z.string().min(1, { message: "Name Required" }).max(50),
    employee_id: z.string().min(1, { message: "Invalid" }).max(20),
    head_office: z.string().nullable(),
    branch_office: z.string().nullable(),
    sub_office: z.string().nullable(),
    date_of_birth: z.string().nullable(),
    date_of_appointment: z.string().nullable(),
    designation: z.string().nullable(),
});

const AddSubstituteEmployee = ({ editData, setEditData, setOpen }) => {
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({ resolver: zodResolver(substituteSchema) });
    const dispatch = useDispatch();
    console.log("editData", editData);


    const formInputs = [
        { type: "text", name: "name", placeholder: "Name", label: "Name" },
        { type: "text", name: "employee_id", placeholder: "Employee ID", label: "Employee ID" },
        { type: "text", name: "head_office", placeholder: "Head Office", label: "Head Office" },
        { type: "text", name: "branch_office", placeholder: "Branch Office", label: "Branch Office" },
        { type: "text", name: "sub_office", placeholder: "Sub Office", label: "Sub Office" },
        { type: "date", name: "date_of_birth", placeholder: "Date of Birth", label: "Date of Birth" },
        { type: "date", name: "date_of_appointment", placeholder: "Date of Appointment", label: "Date of Appointment" },
        { type: "text", name: "designation", placeholder: "Designation", label: "Designation" },
    ];

    const handleClose = () => {
        setOpen(false);
        setEditData(null);
    };

    const onEmployeeDataSubmit = async (data) => {
        const substituteData = {
            ...data,
            name: data.name.trim().toLowerCase(),
            date_of_birth: data.date_of_birth ? new Date(data.date_of_birth) : null,
            date_of_appointment: data.date_of_appointment ? new Date(data.date_of_appointment) : null,
        };

        let res = null;
        if (editData) {
            const existingData = {
                name: editData.name,
                employee_id: editData.employee_id,
                head_office: editData.head_office,
                branch_office: editData.branch_office,
                sub_office: editData.sub_office,
                date_of_birth: editData.date_of_birth,
                date_of_appointment: editData.date_of_appointment,
                designation: editData.designation,
            };

            if (isObjectSame(existingData, substituteData)) return toast.error("No changes");

            const isEditable = isNameEditable(editData.name, substituteData.name);
            if (!isEditable) return toast.error("Names are too different and not editable. Please consult your database manager.", { duration: 10000 });

            res = await updateSubstitute(editData.id, substituteData);
            if (!res.error) {
                toast.success("Substitute Employee Updated Successfully");
                setOpen(false);
                setEditData(null);
                dispatch(editSubstituteEmployee(res))
            }
        } else {
            res = await createSubstitute(substituteData);
            if (!res.error) {
                toast.success("Substitute Employee Added Successfully");
                setOpen(false);
                dispatch(addSubstituteEmployee(res))
            }
        }

        if (res?.error) return toast.error(res.error);
    };

    useEffect(() => {
        if (editData) {
            reset({
                ...editData,
                date_of_birth: moment(editData.date_of_birth).format('YYYY-MM-DD'),
                date_of_appointment: moment(editData.date_of_appointment).format('YYYY-MM-DD')
            });
        }
    }, [editData]);

    return (
        <div className="addSubstituteEmployee">
            <div className="modal">
                <span className="close" onClick={handleClose}>X</span>
                <h1>{editData ? "Update Substitute Employee" : "Add New Substitute"}</h1>
                <form onSubmit={handleSubmit(onEmployeeDataSubmit)}>
                    {formInputs.map(item => (
                        <div className="item" key={item.name}>
                            <label>{item.label}</label>
                            <ZodFormInput type={item.type} name={item.name} register={register} placeholder={item.placeholder} error={errors[item.name]} />
                        </div>
                    ))}
                    <input type="submit" className={isSubmitting ? "disabled" : ""} defaultValue={isSubmitting ? (editData ? "Updating..." : "Adding...") : (editData ? "Update" : "Add")} disabled={isSubmitting} />
                </form>
            </div>
        </div>
    );
};

export default AddSubstituteEmployee;
