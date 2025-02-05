import axios from 'axios';

const PUBLIC_SERVER_ONE = process.env.NEXT_PUBLIC_SERVER_ONE

// common =================================================
const errResponse = (error) => {
    const message = (error.response && error.response.data && error.response.data.message)
        || error.message || error.toString()
    return message
}

const textCapitalize = (text) => {
    if (!text || (typeof text !== 'string')) return

    // .split(/[ .]/)
    var sentence = text.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    sentence = sentence.split('.').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('.')
    return sentence
}

const addIdToDataGridRows = (data) => {
    return data.map((item, index) => ({ ...item, id: index + 1 }))
}

const findNumberOfDays = (fromDate, toDate) => {
    const differenceInMs = toDate - fromDate;
    const differenceInDays = differenceInMs / (1000 * 60 * 60 * 24);    // Convert milliseconds to days
    const days = Math.round(differenceInDays) + 1
    return days
}

const getMonthAndYear = (date) => {
    const month = date.getMonth()
    const year = date.getFullYear()
    const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']
    return months[month] + year
}

const dateToIsoString = (date) => {
    const dateObj = new Date(date)
    dateObj.setUTCHours(0, 0, 0, 0)
    const dateIsoString = dateObj.toISOString()
    return dateIsoString
}

const isHoliday = (holidays, date) => {
    let holiday = holidays.find((item) => new Date(item.date).getTime() === new Date(date).getTime())?.holiday
    if (!holiday) {
        holiday = new Date(date).getDay() === 0 ? "Sunday" : null
    }

    return holiday
}

const removeInitialFromName = (name) => {
    if (!name || (typeof name !== 'string')) return

    const initialRemovedNameArray = name.split(' ').filter(string => string.length > 1)
    const newName = initialRemovedNameArray.join(' ')
    return newName
}

const calculateLevenshteinDistance = (a, b) => {
    const dp = Array(a.length + 1).fill(null).map(() => Array(b.length + 1).fill(0));

    for (let i = 0; i <= a.length; i++) {
        dp[i][0] = i;
    }

    for (let j = 0; j <= b.length; j++) {
        dp[0][j] = j;
    }

    for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;
            dp[i][j] = Math.min(
                dp[i - 1][j] + 1, // deletion
                dp[i][j - 1] + 1, // insertion
                dp[i - 1][j - 1] + cost // substitution
            );
        }
    }

    return dp[a.length][b.length];
}

const isNameEditable = (nameOne, nameTwo) => {
    let name1 = nameOne.trim().toLowerCase()
    let name2 = nameTwo.trim().toLowerCase()

    name1 = removeInitialFromName(name1)
    name2 = removeInitialFromName(name2)

    const distance = calculateLevenshteinDistance(name1, name2);
    return distance <= 3 // threshold
}

const isObjectSame = (obj1, obj2) => {
    return JSON.stringify(obj1) === JSON.stringify(obj2)
}

// Regular Employees ====================================================================
const REGULAR_EMPLOYEE_API = PUBLIC_SERVER_ONE + '/employee/regular'

const getAllRegularEmployeesData = async () => {
    try {
        const response = await axios.get(REGULAR_EMPLOYEE_API)
        const employees = response.data.employees
        return { employees }
    } catch (error) {
        return { error: errResponse(error) }
    }
}

const createRegularEmployeeData = async (regularEmployeeData) => {
    try {
        const response = await axios.post(REGULAR_EMPLOYEE_API, regularEmployeeData)
        const { message, employee } = response.data
        return { success: message, employee }
    } catch (error) {
        return { error: errResponse(error) }
    }
}


const updateRegularEmployeeData = async (id, regularEmployeeData) => {
    try {
        const response = await axios.put(`${REGULAR_EMPLOYEE_API}/${id}`, regularEmployeeData)
        const { message, employee } = response.data
        return { success: message, employee }
    } catch (error) {
        return { error: errResponse(error) }
    }
}


const deleteRegularEmployeeData = async (id) => {
    try {
        const response = await axios.delete(`${REGULAR_EMPLOYEE_API}/${id}`)
        const { message, employee } = response.data
        return { success: message, employee }
    } catch (error) {
        return { error: errResponse(error) }
    }
}

const getEmployeeName = async (officeId, designation) => {
    try {
        const response = await axios.get(`${REGULAR_EMPLOYEE_API}/name/${officeId}/${designation}`)
        const employeeName = response.data.employeeName
        return { employeeName }
    } catch (error) {
        return { error: errResponse(error) }
    }
}

const formatRegularEmployeeData = (regularEmployeeData) => {
    const sortedData = regularEmployeeData.sort((a, b) => {
        return a.officeName.localeCompare(b.officeName);
    });

    const idAddedData = addIdToDataGridRows(sortedData)
    return idAddedData
}

// Substitute services ======================================================
const SUBSTITUTE_API = PUBLIC_SERVER_ONE + '/employee/substitute'

const getAllSubstituteEmployeesData = async () => {
    try {
        const response = await axios.get(SUBSTITUTE_API)
        const employees = response.data.employees
        return { employees }
    } catch (error) {
        return { error: errResponse(error) }
    }
}

const getNonWorkingSubstitute = async (fromDate, toDate) => {
    try {
        const response = await axios.get(`${SUBSTITUTE_API}/non-working/${fromDate}/${toDate}`)
        const employees = response.data.employees
        return { employees }
    } catch (error) {
        return { error: errResponse(error) }
    }
}

const createSubstituteEmployeeData = async (substituteEmployeeData) => {
    try {
        const response = await axios.post(SUBSTITUTE_API, substituteEmployeeData)
        const { message, employee } = response.data
        return { success: message, employee }
    } catch (error) {
        return { error: errResponse(error) }
    }
}


const updateSubstituteEmployeeData = async (id, substituteEmployeeData) => {
    try {
        const response = await axios.put(`${SUBSTITUTE_API}/${id}`, substituteEmployeeData)
        const { message, employee } = response.data
        return { success: message, employee }
    } catch (error) {
        return { error: errResponse(error) }
    }
}


const deleteSubstituteEmployeeData = async (id) => {
    try {
        const response = await axios.delete(`${SUBSTITUTE_API}/${id}`)
        const { message, employee } = response.data
        return { success: message, employee }
    } catch (error) {
        return { error: errResponse(error) }
    }
}

const formatSubstituteEmployeeData = (substituteEmployeeData) => {
    const sortedData = substituteEmployeeData.sort((a, b) => {
        return a.name.localeCompare(b.name);
    });

    const idAddedData = addIdToDataGridRows(sortedData)
    return idAddedData
}

// Holidays ======================================================
const HOLIDAY_API = PUBLIC_SERVER_ONE + '/holiday'

const getAllHolidayData = async () => {
    try {
        const response = await axios.get(HOLIDAY_API)
        const holidays = response.data.holidays
        return { holidays }
    } catch (error) {
        return { error: errResponse(error) }
    }
}

const createHolidayData = async (HolidayData) => {
    try {
        const response = await axios.post(HOLIDAY_API, HolidayData)
        const { message, holiday } = response.data
        return { success: message, holiday }
    } catch (error) {
        return { error: errResponse(error) }
    }
}


const updateHolidayData = async (id, HolidayData) => {
    try {
        const response = await axios.put(`${HOLIDAY_API}/${id}`, HolidayData)
        const { message, holiday } = response.data
        return { success: message, holiday }
    } catch (error) {
        return { error: errResponse(error) }
    }
}


const deleteHolidayData = async (id) => {
    try {
        const response = await axios.delete(`${HOLIDAY_API}/${id}`)
        const { message, holiday } = response.data
        return { success: message, holiday }
    } catch (error) {
        return { error: errResponse(error) }
    }
}

const formatHolidayData = (HolidayData) => {
    const sortedData = HolidayData.sort((a, b) => {
        return new Date(a.date) - new Date(b.date)
    });

    const idAddedData = addIdToDataGridRows(sortedData)
    return idAddedData
}

// Leave Services ======================================================
const LEAVE_API = PUBLIC_SERVER_ONE + '/leaves'

const getPendngLeaveData = async () => {
    try {
        const response = await axios.get(`${LEAVE_API}/pending`)
        const leaves = response.data.leaves
        return { leaves }
    } catch (error) {
        return { error: errResponse(error) }
    }
}

const getLeaveDataByCategory = async (searchParamsObj) => {
    const { leaveType, fromDate, toDate, officeId, employeeId, substituteId, remarks } = searchParamsObj

    try {
        const response = await axios.get(`${LEAVE_API}/${leaveType}/${fromDate}/${toDate}/${officeId}/${employeeId}/${substituteId}/${remarks}`)
        const leaves = response.data.leaves
        return { leaves }
    } catch (error) {
        return { error: errResponse(error) }
    }
}

const createLeaveData = async (leaveData) => {
    try {
        const response = await axios.post(LEAVE_API, leaveData)
        const { message, leave } = response.data
        return { success: message, leave }
    } catch (error) {
        return { error: errResponse(error) }
    }
}


const updatePendingLeaveData = async (id, leaveData) => {
    try {
        const response = await axios.put(`${LEAVE_API}/pending/${id}`, leaveData)
        const { message, leave } = response.data
        return { success: message, leave }
    } catch (error) {
        return { error: errResponse(error) }
    }
}

const deletePendingLeaveData = async (id) => {
    try {
        const response = await axios.delete(`${LEAVE_API}/pending/${id}`)
        const message = response.data.message
        return { success: message }
    } catch (error) {
        return { error: errResponse(error) }
    }
}

const cancelLeaveApproval = async (id) => {
    try {
        const response = await axios.patch(`${LEAVE_API}/approved/${id}`)
        const message = response.data.message
        return { success: message }
    } catch (error) {
        return { error: errResponse(error) }
    }
}

const formatLeaveData = (leaveData) => {
    const sortedData = leaveData.sort((a, b) => {
        return new Date(a.from) - new Date(b.from)
    });

    const idAddedData = addIdToDataGridRows(sortedData)
    return idAddedData
}

//office services ======================================
const OFFICE_API = PUBLIC_SERVER_ONE + '/office'

const getAllOffices = async () => {
    try {
        const response = await axios.get(OFFICE_API)
        const offices = response.data.offices
        return { offices }
    } catch (error) {
        return { error: errResponse(error) }
    }
}


export {
    errResponse, textCapitalize, addIdToDataGridRows, findNumberOfDays, getMonthAndYear, dateToIsoString, isHoliday, removeInitialFromName, isNameEditable, isObjectSame,
    getAllRegularEmployeesData, createRegularEmployeeData, updateRegularEmployeeData, deleteRegularEmployeeData, getEmployeeName, formatRegularEmployeeData,
    getAllSubstituteEmployeesData, getNonWorkingSubstitute, createSubstituteEmployeeData, updateSubstituteEmployeeData, deleteSubstituteEmployeeData, formatSubstituteEmployeeData,
    getAllHolidayData, createHolidayData, updateHolidayData, deleteHolidayData, formatHolidayData,
    getPendngLeaveData, getLeaveDataByCategory, createLeaveData, updatePendingLeaveData, deletePendingLeaveData, cancelLeaveApproval, formatLeaveData,
    getAllOffices,
}