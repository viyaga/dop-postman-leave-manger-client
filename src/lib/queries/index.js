export const getOfficialsQuery = {
    fields: 'name,designation,employee_id,pay',
    populate: 'leave_balance',
    filters: {
        official_status: 1
    }
}

export const getSubstitutesQuery = {
    fields: 'name,designation,branch_office,sub_office,head_office,date_of_birth,date_of_appointment,employee_id',
    filters: {
        substitute_status: 1
    }
}


export const getHolidaysQuery = {
    fields: 'holiday,date',
}