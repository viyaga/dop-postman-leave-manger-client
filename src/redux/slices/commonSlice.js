"use client"

import { formatRegularEmployeeData, formatSubstituteEmployeeData, formatHolidayData, formatLeaveData } from "@/services";

const { createSlice } = require("@reduxjs/toolkit");

const initialState = {
    isSidebarOpen: false,
    isDashboardLoading: false,
    leaveData: [],
    allLeaves: [],
    employee: {
        regular: [],
        substitute: [],
    },
    holidays: [],
}


const commonSlice = createSlice({
    name: 'common',
    initialState,
    reducers: {
        setSideBarOpen: (state, action) => {
            state.isSidebarOpen = action.payload
        },
        setDashboardLoading: (state, action) => {
            state.isDashboardLoading = action.payload
        },

        // Pending Leave Data ==========================================================
        setLeaves: (state, action) => {
            const formatedData = formatLeaveData(action.payload)
            state.leaveData = formatedData
        },
        addLeave: (state, action) => {
            if (action.payload?.status === 0) {
                state.leaveData.push(action.payload)
                const formatedData = formatLeaveData(state.leaveData)
                state.leaveData = formatedData
            }
        },
        editLeave: (state, action) => {
            if (action.payload?.status === 0) {
                const data = state.leaveData.filter((item) => item._id !== action.payload._id)
                data.push(action.payload)
                const formatedData = formatLeaveData(data)
                state.leaveData = formatedData
            } else {
                const data = state.leaveData.filter((item) => item._id !== action.payload._id)
                const formatedData = formatLeaveData(data)
                state.leaveData = formatedData
            }
        },
        deleteLeave: (state, action) => {
            const data = state.leaveData.filter((item) => item._id !== action.payload._id)
            const formatedData = formatLeaveData(data)
            state.leaveData = formatedData
        },

        // All Leaves ==========================================================
        setApprovedLeaves: (state, action) => {
            const formatedData = formatLeaveData(action.payload)
            state.allLeaves = formatedData
        },
        cancelLeave: (state, action) => {
            const data = state.allLeaves.filter((item) => item._id !== action.payload._id)
            const formatedData = formatLeaveData(data)
            state.allLeaves = formatedData

            state.leaveData.push(action.payload)
            const formatedData1 = formatLeaveData(state.leaveData)
            state.leaveData = formatedData1
        },

        // Regular employee =============================
        setRegularEmployee: (state, action) => {
            const formatedData = formatRegularEmployeeData(action.payload)
            state.employee.regular = action.payload
        },
        addRegularEmployee: (state, action) => {
            state.employee.regular.push(action.payload)
            const formatedData = formatRegularEmployeeData(state.employee.regular)
            state.employee.regular = formatedData
        },
        editRegularEmployee: (state, action) => {
            const data = state.employee.regular.filter((item) => item._id !== action.payload._id)
            data.push(action.payload)
            const formatedData = formatRegularEmployeeData(data)
            state.employee.regular = formatedData
        },
        deleteRegularEmployee: (state, action) => {
            const data = state.employee.regular.filter((item) => item._id !== action.payload._id)
            const formatedData = formatRegularEmployeeData(data)
            state.employee.regular = formatedData
        },

        // substitute employee ================================================
        setSubstituteEmployee: (state, action) => {
            const formatedData = formatSubstituteEmployeeData(action.payload)
            state.employee.substitute = formatedData
        },
        addSubstituteEmployee: (state, action) => {
            state.employee.substitute.push(action.payload)
            const formatedData = formatSubstituteEmployeeData(state.employee.substitute)
            state.employee.substitute = formatedData
        },
        editSubstituteEmployee: (state, action) => {
            const data = state.employee.substitute.filter((item) => item._id !== action.payload._id)
            data.push(action.payload)
            const formatedData = formatSubstituteEmployeeData(data)
            state.employee.substitute = formatedData
        },
        deleteSubstituteEmployee: (state, action) => {
            const data = state.employee.substitute.filter((item) => item._id !== action.payload._id)
            const formatedData = formatSubstituteEmployeeData(data)
            state.employee.substitute = formatedData
        },

        //holidays ============================================================
        setHoliday: (state, action) => {
            const formatedData = formatHolidayData(action.payload)
            state.holidays = formatedData
        },
        addHoliday: (state, action) => {
            state.holidays.push(action.payload)
            const formatedData = formatHolidayData(state.holidays)
            state.holidays = formatedData
        },
        editHoliday: (state, action) => {
            const data = state.holidays.filter((item) => item._id !== action.payload._id)
            data.push(action.payload)
            const formatedData = formatHolidayData(data)
            state.holidays = formatedData
        },
        deleteHoliday: (state, action) => {
            const data = state.holidays.filter((item) => item._id !== action.payload._id)
            const formatedData = formatHolidayData(data)
            state.holidays = formatedData
        },
    }
})

export const {
    setSideBarOpen, setDashboardLoading,
    setLeaves, addLeave, editLeave, deleteLeave, setApprovedLeaves, cancelLeave,
    setRegularEmployee, addRegularEmployee, editRegularEmployee, deleteRegularEmployee,
    setSubstituteEmployee, addSubstituteEmployee, editSubstituteEmployee, deleteSubstituteEmployee,
    setHoliday, addHoliday, editHoliday, deleteHoliday,
} = commonSlice.actions
export default commonSlice.reducer