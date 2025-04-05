export const scheduleEnums = {
     "ACTIVE" : 1,
    "INAVTIVE" : 2,
    "PENDING" : 3,
    "DELETE" : 4
}

export const CLIENT_PERMISSIONS = [
    { value: "Create_Manager", label: "Create"},
    { value: "Edit_Manager", label: "Edit"},
    { value: "Delete_Manager", label: "Delete"},
    { value: "Manager", label: "Manager"},
    { value: "View_Manager", label: "View"},
    { value: "Client", label: "Client"},
]

export const RecurrenceTypes = [
    {name: "Daily", value: "Daily"},
    {name: "Weekly", value: "Weekly"},
    {name: "BI-Weekly", value: "BIWeekly"},
    {name: "Monthly", value: "Monthly"},
]

export const JOURNEY_PLAN_FILTER_TYPE = [
    {name: "Pending", value: "Pending"},
    {name: "Progress", value: "Progress"},
    {name: "Completed", value: "Completed"},
    {name: "Incomplete", value: "Incomplete"},
]