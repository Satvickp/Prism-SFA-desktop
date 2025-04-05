import axios from "axios";
import { API_URL } from "../../constants/api-url";
export async function createSchedules(token,data){
    // const url = API_URL.backend_url + `schedules/map`;
    const url = API_URL.backend_url + `beet-journey-plans/bulk`;
    var header = {
      "Content-type": "application/json",
      Authorization: "Bearer " + token,
    };
    const response = await axios({
      headers: header,
      url: url,
      method: "POST",
      data: data,
    });
    return data
}
export async function getAllSchedulesByReportingManager(startAt, endAt,token,id){
  // const url = API_URL.backend_url + `schedulesAllById?id=${id}`;
  // const url = API_URL.backend_url + `getAllSchedulesByReportingManagerId/${id}&page=${page}&size=500`;
  const url = API_URL.backend_url + `beet-logs/findByStartAndEndDateByMemberId/${id}?startDate=${startAt}&endDate=${endAt}`;
  var header = {
    "Content-type": "application/json",
    Authorization: "Bearer " + token,
  };
  const response = await axios({
    headers: header,
    url: url,
    method: "GET",
  });
  if(response.status === 404){
    return []
  }
  return response
}
export async function getAllSchedules(page,token,id){
  // const url = API_URL.backend_url + `schedulesAllById?id=${id}`;
  const url = API_URL.backend_url + `schedulesAll?&page=${page}&size=500`;
  var header = {
    "Content-type": "application/json",
    Authorization: "Bearer " + token,
  };
  const response = await axios({
    headers: header,
    url: url,
    method: "GET",
  });
  return {
    data: response.data.schedules,
    paginationData: response.data.page,
  };
}
export async function getSchedulesByDate(date,token,id, day){
  const url = API_URL.backend_url + `schedulesByInputDateAndDay/${id}?inputDate=${date}&inputDay=${day[0].label}`;
  var header = {
    "Content-type": "application/json",
    Authorization: "Bearer " + token,
  };
  const response = await axios({
    headers: header,
    url: url,
    method: "GET",
  });
  return  response.data
}

export async function approveEmployeeSchedule(payload, token, id){
  const url = API_URL.backend_url + `schedules/${id}`;
  var header = {
    "Content-type": "application/json",
    Authorization: "Bearer " + token,
  };
  const response = await axios({
    headers: header,
    url: url,
    method: "PUT",
    data: payload,
  });
  return  response.data
}

export async function deleteSchedule(token, id){
  const url = API_URL.backend_url + `beet-journey-plans/${id}`;
  var header = {
    "Content-type": "application/json",
    Authorization: "Bearer " + token,
  };
  const response = await axios({
    headers: header,
    url: url,
    method: "DELETE",
  });
  return  response
}
