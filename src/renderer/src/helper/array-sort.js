export function getInProgressSchedules(allSchedules) {
  const inProgressSchedules = [];
  const completedSchedules = [];

  for (let sch in allSchedules){

    if (Array.isArray(allSchedules[sch].checkIn)&&allSchedules[sch].checkIn.length>0 && allSchedules[sch].checkIn.length == allSchedules[sch].clients.length){
      completedSchedules.push(allSchedules[sch])
    }
    else{
      inProgressSchedules.push(allSchedules[sch])
    }
  }
  return {
    progress:inProgressSchedules,
    completed:completedSchedules
  };
}

  
  
export function getIDFromSchedules(arr){
  const memberId= []
  const clientId = []
  for (let i = 0; i < arr.length; i++) {
    if (memberId.findIndex(item => item === arr[i].employeeId) === -1) {
      memberId.push(arr[i].employeeId);
    }
    if (clientId.findIndex(item => item === arr[i].clientId) === -1) {
      clientId.push(arr[i].clientId);
    }
  }
  return   {memberId,clientId}
}

  export function getCompletedSchedules(arr) {
    const currentDate = new Date();
    const completedSchedules  = [];

    for (const schedule of arr) {
      const endDate = new Date(schedule.endAt);
  
      if (currentDate >= endDate) {
        completedSchedules.push(schedule);
      }
    }
  
   return completedSchedules;
  }
  
  export function sortAttendanceData(data) {
    const sortedData = [];
    const memberIds = new Set();
  
    data.forEach((item) => {
      const memberId = item.memberId;
      let memberAttendance;
  
      if (!memberIds.has(memberId)) {
        memberIds.add(memberId);
        memberAttendance = {
          memberID: memberId,
          attendance: [],
        };
        sortedData.push(memberAttendance);
      } else {
        memberAttendance = sortedData.find(
          (entry) => entry.memberID === memberId
        );
      }
  
      const attendanceRecord = {
        checkIn: item.checkIn,
        checkInLocation: item.checkInLocation,
        checkOut: item.checkOut,
        checkOutLocation: item.checkOutLocation,
      };
  
      memberAttendance.attendance.push(attendanceRecord);
    });
  
    return sortedData;
  }


  export function getDataForExpense(data){
    const membersID = [];
    for(const item of data){
      membersID.push(item.memberId);
    }
    return membersID;
  }

  export function getIDSFromExpense(data = []) {
    const IDS = [];
    for (let i = 0; i < data.length; i++) {
      if (IDS.findIndex(item => item === data[i].employeeId) === -1) {
        IDS.push(data[i].employeeId);
      }
    }
    return IDS;
  }

  
  
  export  function mergeEmployeeNamesSchedules(scheduleData, memberData) {

    const memberMap = new Map(memberData.map(member => [member.id, `${member.firstName} ${member.lastName}`]));
  
    return scheduleData.map(schedule => ({
      ...schedule,
      employeeName: memberMap.get(schedule.employeeId) || "Unknown Employee"
    }));
  }
  export  function mergeEmployeeNamesStatus(statusData, memberData) {

    const memberMap = new Map(statusData.map(member => [member.id, `${member.firstName} ${member.lastName}`]));
  
    return statusData.map(status => ({
      ...status,
      employeeName: memberMap.get(status.employeeId) || "Unknown Employee"
    }));
  }
  

export  function mergeEmployeeNames(expenseData, memberData) {

    const memberMap = new Map(memberData.map(member => [member.id, `${member.firstName} ${member.lastName}`]));
  
    return expenseData.map(expense => ({
      ...expense,
      employeeName: memberMap.get(expense.employeeId) || "Unknown Employee"
    }));
  }






