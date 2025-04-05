import axios from "axios";
import { API_URL } from "../../constants/api-url";
import { fetchAPI } from "../api-utils";

export async function getMemberDetail(id, token) {
  const url = API_URL.backend_url + `getMemberById/${id}`;
  var header = {
    "Content-type": "application/json",
    Authorization: "Bearer " + token,
  };
  const response = await axios({
    headers: header,
    url: url,
    method: "GET",
  });
  return response.data;
}

export async function getClientDetail(id, token) {
  const url = API_URL.backend_url + `client-fmcg/getClientFMCGById/${id}`;
  var header = {
    "Content-type": "application/json",
    Authorization: "Bearer " + token,
  };
  const response = await axios({
    headers: header,
    url: url,
    method: "GET",
  });
  return response.data;
}

export async function getAllMembers(page, token, id) {
  // const url = API_URL.backend_url + `getAllMembersWithHierarchy/${id}`;       // hierarchy api url
  const url = API_URL.backend_url + `membersByReportingManager/${id}`;
  var header = {
    "Content-type": "application/json",
    Authorization: "Bearer " + token,
  };
  const response = await axios({
    headers: header,
    url: url,
    method: "GET",
  });
  // const Data = response.data._embedded.members;

  // hierarchy api response
  // return {
  //   data: response.data,
  //   status: response.status,
  //   paginationData: 0,
  // };
  return {
    data: response.data.content,
    status: response.status,
    paginationData: response.data.totalElements,
  };
}

export async function getEveryMemberExist(token, page = 0, id) {
  const url = API_URL.backend_url + `membersAll?page=${page}&size=500`;
  var header = {
    "Content-type": "application/json",
    Authorization: "Bearer " + token,
  };
  const response = await axios({
    headers: header,
    url: url,
    method: "GET",
  });
  // const Data = response.data._embedded.members;

  return {
    data: response.data.member,
    status: response.status,
    paginationData: response.data.page,
  };
}

export async function addMember(token, data) {
  const url = API_URL.backend_url + `mapMemberWithDivision`;
  var header = {
    "Content-type": "application/json",
    Authorization: "Bearer " + token,
  };
  console.log("token", token);
  console.log("data", data);
  const response = await axios({
    headers: header,
    url: url,
    method: "POST",
    data: data,
  });
  return response.data;
}

export async function getAllDesignation(token) {
  const url = API_URL.backend_url + `designation/getAllDesignation`;
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
    data: response.data,
    status: response.status,
  };
}

export async function updateMember(token, data) {
  const url = API_URL.backend_url + `updateMember/${data.id}`;
  var header = {
    "Content-type": "application/json",
    Authorization: "Bearer " + token,
  };
  const resp = await axios({
    headers: header,
    url: url,
    method: "PUT",
    data: data,
  });

  return resp.data;
}

export async function deleteMember(token, id) {
  const url = API_URL.backend_url + `deleteMemberById/${id}`;
  var header = {
    "Content-type": "application/json",
    Authorization: "Bearer " + token,
  };
  const response = await axios({
    headers: header,
    url: url,
    method: "delete",
  });
  return response.status;
}

export async function updatePassword(token, payload) {
  const url = API_URL.backend_url + `forgetPassword/member/resetMemberPassword`;
  var header = {
    "Content-type": "application/json",
    Authorization: "Bearer " + token,
  };
  const response = await axios({
    headers: header,
    url: url,
    method: "post",
    data: payload,
  });
  return response.status;
}
export async function getPermissionOfAMember(id, token) {
  const url = API_URL.backend_url + `getAllPermission/${id}/permission`;
  var header = {
    "Content-type": "application/json",
    Authorization: "Bearer " + token,
  };
  const response = await axios({
    headers: header,
    url: url,
    method: "get",
  });

  return { permission: response?.data || [], status: response.status };
}

export async function getPermissionOfClientFmcg(id, token) {
  const url = API_URL.backend_url + `getAllClientFmcg/${id}/permission`;
  var header = {
    "Content-type": "application/json",
    Authorization: "Bearer " + token,
  };
  const response = await axios({
    headers: header,
    url: url,
    method: "get",
  });

  return { permission: response?.data || [], status: response.status };
}
export async function getPermissionOfMember(id, token, permissionGroupId) {
  const url =
    API_URL.backend_url +
    `member/${id}/permission/all?permissionGroupId=${permissionGroupId}`;
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

export async function updatePermissionOfAMember(token, payload) {
  const url =
    API_URL.backend_url + `member-permission/assignOrUpdatePermission`;
  var header = {
    "Content-type": "application/json",
    Authorization: "Bearer " + token,
  };
  const response = await axios({
    headers: header,
    url: url,
    method: "post",
    data: payload,
  });

  return response.data;
}

export async function getAllReportingMembers(token, state, city, region) {
  const url =
    API_URL.backend_url +
    `api/members?projection=membersIdName&region=${region}&state=${state}${city
      .map((e) => "&cities=" + e.id)
      .join("")}`;
  var header = {
    "Content-type": "application/json",
    Authorization: "Bearer " + token,
  };
  const response = await axios({ headers: header, url: url, method: "GET" });
  return response.data._embedded.members;
}

export async function getAllMemberProjection(ids, token) {
  let url = API_URL.backend_url + `api/members?projection=membersIdName`;
  for (let i = 0; i < ids.length; i++) {
    url = url + `&id=${ids[i]}`;
  }
  var header = {
    "Content-type": "application/json",
    Authorization: "Bearer " + token,
  };
  const response = await axios({
    headers: header,
    url: url,
    method: "GET",
  });
  return response.data._embedded.members;
}

export async function uploadFile(token, payload) {
  const url = API_URL.backend_url + `upload`;
  var header = {
    "Content-type": "multipart/form-data",
    Authorization: "Bearer " + token,
  };
  const response = await axios({
    headers: header,
    url: url,
    method: "post",
    data: payload,
  });

  return response.data.key;
}

export async function getAllState(token) {
  const url = API_URL.backend_url + "states/allStates?page=0&pageSize=60";
  var header = {
    "Content-type": "application/json",
    Authorization: "Bearer " + token,
  };
  const resp = await axios({
    headers: header,
    method: "GET",
    url: url,
  });
  return resp.data.content;
}

export async function getAllMembersWithHierarchy(id, token) {
  const url = API_URL.backend_url + `getAllMembersWithHierarchy/${id}`;
  var header = {
    "Content-type": "application/json",
    Authorization: "Bearer " + token,
  };

  const resp = await axios({
    headers: header,
    method: "GET",
    url: url,
  });
  return resp.data;
}

export async function apiGetAllMemberByReportingManagerPaginated(
  reportingId,
  page
) {
  return await fetchAPI({
    method: "GET",
    url: `${API_URL.backend_url}membersByReportingManager/${reportingId}?page=${page}&pageSize=100&sortBy=createdDate&sortDirection=desc`,
  });
}

export async function apiGetAllMemberPaginated(page) {
  return await fetchAPI({
    method: "GET",
    url: `${API_URL.backend_url}membersAll?page=${page}&size=100&sortBy=createdDate&sortDirection=desc`,
  });
}
