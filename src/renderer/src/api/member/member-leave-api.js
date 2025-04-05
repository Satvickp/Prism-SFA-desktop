import axios from "axios";
import { API_URL } from "../../constants/api-url";

export async function createLeave(token, payload) {
  const url = API_URL.backend_url + `leaves`;
  var header = {
    "Content-type": "application/json",
    Authorization: "Bearer " + token,
  };
  const response = await axios({
    headers: header,
    url: url,
    method: "POST",
    data: payload,
  });
  return response.data;
}

// export async function getLeaveTypes(token) {
//   const url = API_URL.backend_url + `api/leaveType`;
//   var header = {
//     "Content-type": "application/json",
//     Authorization: "Bearer " + token,
//   };
//   const response = await axios({
//     headers: header,
//     url: url,
//     method: "GET",
//   });
//   return response.data._embedded.leaveType;
// }

export async function getLeaveTypes(token) {
  const leaveType = [
    { id: 1, name: "Flexi" },
    { id: 2, name: "Personal" },
    { id: 3, name: "Paid" },
    { id: 4, name: "Medical" },
    { id: 5, name: "Vacation" },
    { id: 6, name: "Other" },
  ];

  return leaveType;
}

export async function deleteLeave(token, id) {
  const url = API_URL.backend_url + `leavesById/${id}`;
  var header = {
    "Content-type": "application/json",
    Authorization: "Bearer " + token,
  };
  const response = await axios({
    headers: header,
    url: url,
    method: "DELETE",
  });
  return response.data;
}

export async function getAllLeaves(token, page, actionBy) {
  // &actionBy=${actionBy}
  const url =
    API_URL.backend_url + `leaveAll?page=${page}&pageSize=500&sortBy=startAt`;
  // const url = API_URL.backend_url + `leavesByEmployeeId/${actionBy}?page=${page}&pageSize=10`
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
    data: response.data.content,
    paginationData: {
      totalElements: response.data.totalElements,
      totalPages: response.data.totalPages,
      page: response.data.page,
    },
  };
}
export async function getAllLeavesByManagerId(token, page, actionBy) {
  // &actionBy=${actionBy}
  const url =
    API_URL.backend_url +
    `getEmployeeLeavesByManager/${actionBy}?page=${page}&pageSize=500&sortBy=startAt`;
  // const url = API_URL.backend_url + `leavesByEmployeeId/${actionBy}?page=${page}&pageSize=10`
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
    data: response.data.content,
    paginationData: {
      totalElements: response.data.totalElements,
      totalPages: response.data.totalPages,
      page: response.data.page,
    },
  };
}
export async function getAllLeavesByMemberId(token, page, actionBy) {
  // &actionBy=${actionBy}
  const url =
    API_URL.backend_url +
    `leavesByEmployeeId/${actionBy}?page=${page}&pageSize=1000&sortBy=startAt`;
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
    data: response.data.content,
    paginationData: {
      totalElements: response.data.totalElements,
      totalPages: response.data.totalPages,
      page: response.data.page,
    },
  };
}

export async function updateLeave(token, id, payload) {
  const url = API_URL.backend_url + `updateLeaveById/${id}`;
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
  return response.data;
}
