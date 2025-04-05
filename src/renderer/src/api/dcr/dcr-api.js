import axios from "axios";
import { API_URL } from "../../constants/api-url";

export async function getAllDcr(token, id, date) {
  const url = API_URL.backend_url + `dcrAll?dcrDate=${date}&page=0&size=500`;
  var header = {
    "Content-type": "application/json",
    Authorization: "Bearer " + token,
  };
  const resp = await axios(url, {
    method: "get",
    headers: header,
    url: url,
  });
  console.log("Get All DCR", resp.data);
  return resp.data;
}

export async function getMemberDcr(token, id, date) {
  const url =
    API_URL.backend_url +
    `dcrAll?members=${id}&dcrDate=${date}&page=0&size=500`;
  var header = {
    "Content-type": "application/json",
    Authorization: "Bearer " + token,
  };
  const resp = await axios(url, {
    method: "get",
    headers: header,
    url: url,
  });
  console.log("Get member DCR", resp.data);
  return resp.data;
}

export async function getDcrByReportingManager(token, page, id) {
  const url =
    API_URL.backend_url + `dcrByReportingManager/${id}?page=${page}&size=10`;
  var header = {
    "Content-type": "application/json",
    Authorization: "Bearer " + token,
  };
  const resp = await axios(url, {
    method: "get",
    headers: header,
    url: url,
  });
  console.log("Get DCR", resp.data);
  return { data: resp.data.dcrReportingDto, paginationData: resp.data.page };
}

export async function addNewDcr(payload, token) {
  const url = API_URL.backend_url + "dcr";
  var header = {
    "Content-type": "application/json",
    Authorization: "Bearer " + token,
  };
  const resp = await axios(url, {
    method: "post",
    headers: header,
    url: url,
    data: payload,
  });
  return resp.data;
}

// // // to update a product (working fine)

export async function updateCurrentDcr(data, token) {
  const url = API_URL.backend_url + `api/dcr/${data.id}`;
  var header = {
    "Content-type": "application/json",
    Authorization: "Bearer " + token,
  };
  const resp = await axios(url, {
    method: "patch",
    headers: header,
    url: url,
    data: data,
  });
  return resp.data;
}

// // // to delete a product (working fine)

export async function deleteCurrentDcr(token, id) {
  const url = API_URL.backend_url + `api/dcr/${id}`;
  var header = {
    "Content-type": "application/json",
    Authorization: "Bearer " + token,
  };
  const resp = await axios(url, {
    method: "delete",
    headers: header,
    url: url,
  });
  return resp.status;
}

// // //working fine
export async function getDcrDetails(token, id) {
  const url = API_URL.backend_url + `api/dcr/${id}`;
  var header = {
    "Content-type": "application/json",
    Authorization: "Bearer " + token,
  };
  const resp = await axios(url, {
    method: "get",
    headers: header,
    url: url,
  });
  return resp.data;
}

export async function DCRreportingManagers(token, state, city, region) {
  const url =
    API_URL.backend_url +
    `api/members?projection=membersIdName&region=${region}&state=${state}&cityName=${city}`;
  var header = {
    "Content-type": "application/json",
    Authorization: "Bearer " + token,
  };
  const response = await axios({ headers: header, url: url, method: "GET" });
  return response.data._embedded.members;
}
