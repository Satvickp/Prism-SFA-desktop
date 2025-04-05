import axios from "axios";
import { API_URL } from "../../constants/api-url";
// import { useSelector } from "react-redux";

export async function getAllAttendance(token, reportingManagerId, month, year) {
  let url =
    API_URL.backend_url +
    `attendance/attendanceByReportingManagerIdWIthMonthAndYear?reportingManagerId=${reportingManagerId}&month=${
      month <= 9 ? `0${month}&page=0&pageSize=10` : month
    }&year=${year}`;
  var header = {
    "Content-type": "application/json",
    Authorization: "Bearer " + token,
  };
  const response = await axios({
    headers: header,
    url: url,
    method: "get",
  });
  return response.data;
}
export async function getAllAttendanceByReportingManagerId(
  token,
  reportingManagerId,
  month,
  year
) {
  let url =
    API_URL.backend_url +
    `attendance/attendanceByReportingManagerIdWIthMonthAndYear?reportingManagerId=${reportingManagerId}&month=${
      month <= 9 ? `0${month}&page=0&pageSize=10` : month
    }&year=${year}`;
  var header = {
    "Content-type": "application/json",
    Authorization: "Bearer " + token,
  };
  const response = await axios({
    headers: header,
    url: url,
    method: "get",
  });
  return response.data;
}

// export async function getAllAttendanceByReportingManagerId(token, reportingManagerId, month, year) {
//   let url =
//     API_URL.backend_url +
//     `attendance/attendanceByReportingManagerIdWIthMonthAndYear/Segregated?reportingManagerId=${reportingManagerId}&month=${
//       month <= 9 ? `0${month}` : month
//     }&year=${year}`;
//   var header = {
//     "Content-type": "application/json",
//     Authorization: "Bearer " + token,
//   };
//   const response = await axios({
//     headers: header,
//     url: url,
//     method: "get",
//   });
//   return response.data;
// }

export async function getMemberAttendance(
  token,
  firstName,
  lastName,
  reportingManagerId,
  month,
  year,
  memberId
) {
  let url =
    API_URL.backend_url +
    `attendance/attendanceByName?firstName=${firstName}&lastName=${lastName}&reportingManagerId=${reportingManagerId}&month=${
      month <= 9 ? `0${month}` : month
    }&year=${year}&page=0&pageSize=10&sortBy=id&sortDirection=asc`;
  // let url = API_URL.backend_url + `attendance/attendanceByReportingManagerIdWIthMonthAndYear?reportingManagerId=${reportingManagerId}&month=${month < 9 ? month : `0${month}`}&year=${year}`;
  var header = {
    "Content-type": "application/json",
    Authorization: "Bearer " + token,
  };
  const response = await axios({
    headers: header,
    url: url,
    method: "get",
  });
  return response.data;
}

// export async function getAllAttendance(token,Ids,from,to,memberId) {

// function getFormatTime(checkTime){
//   const formattedTime = new Date(checkTime.slice(0, 23).replace(" ","T") + "Z")
//   return formattedTime.toISOString();
// }

// const checkIntime = getFormatTime(from)
// const checkOutTime = getFormatTime(to)

//   let url = API_URL.backend_url + `attendance/current?checkIn=${checkIntime}&checkIn${checkOutTime}&memberId${memberId}`;
//   for (let id of Ids) url += `&memberId=${id}`;
//   var header = {
//     "Content-type": "application/json",
//     Authorization: "Bearer " + token,
//   };
//   const response = await axios({
//     headers: header,
//     url: url,
//     method: "get",
//   });
//   return response.data._embedded.attendance;
// }

export async function getMemberName(token, Ids) {
  let url = API_URL.backend_url + `api/members?page=0&size=20`;
  for (var i in Ids) {
    url = url.concat(`&Id=${Ids[i].memberID}`);
  }

  var header = {
    "Content-type": "application/json",
    Authorization: "Bearer " + token,
  };
  const response = await axios({
    headers: header,
    url: url,
    method: "get",
  });
  const data = response.data._embedded;

  const memberDataMap = new Map(
    data.members.map((member) => [member.id, member])
  );

  // Merge the data
  const mergedData = Ids.map((attendanceRecord) => {
    const memberID = attendanceRecord.memberID;
    if (memberDataMap.has(memberID)) {
      const member = memberDataMap.get(memberID);
      attendanceRecord.memberName = `${member.firstName} ${member.lastName}`;
    }
    return attendanceRecord;
  });

  return mergedData;
}

export async function getMemberAttendanceById(token, id, month, year) {
  const url =
    API_URL.backend_url +
    `attendance/attendanceByIdWIthMonthAndYear?memberId=${id}&month=${month}&year=${year}`;
  var header = {
    "Content-type": "application/json",
    Authorization: "Bearer " + token,
  };
  const response = await axios({
    headers: header,
    url: url,
    method: "get",
  });
  return response.data;
}

export async function apiGetAllAttendanceByMonthAndYear(
  token,
  month,
  year,
  page
) {
  const url =
    API_URL.backend_url +
    `attendance/getAllByMonthAndYear?month=${month}&year=${year}&page=${page}&pageSize=10&sortBy=createdDate&sortDirection=desc`;
  var header = {
    "Content-type": "application/json",
    Authorization: "Bearer " + token,
  };
  const response = await axios({
    headers: header,
    url: url,
    method: "get",
  });
  return response.data;
}
