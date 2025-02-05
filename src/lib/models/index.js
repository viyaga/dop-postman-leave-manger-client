const mongoose = require('mongoose')

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: [true, "Email already registered"],
    },
    password: {
        type: String,
        required: true
    },
    subdivisionName: {
        type: String,
        required: true,
    }
})

const employeeSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        employeeId: {
            type: String,
            required: true,
        },
        employeeType: {
            type: String,
            required: true,
            enum: ['regular', 'substitute']
        },
        designation: {
            type: String,
        },
        officeName: {
            type: String,
        },
        accountNo: {
            type: String,
        }
    },
    {
        timestamps: true,
    }
)

export const Employee = mongoose.models.Employee || mongoose.model('Employee', employeeSchema)
export const Admin = mongoose.models.Admin || mongoose.model('Admin', adminSchema)
