import axios from "axios";
import { API_URL } from "../../constants/api-url";
//get all client api
export async function getAllClientsByReportingManager(token, page, id) {
  const url =
    API_URL.backend_url + `getAllClientByMemberId/${id}?page=${page}&pageSize=500`;
  var header = {
    "Content-type": "application/json",
    Authorization: "Bearer " + token,
  };
  const response = await axios(url, {
    method: "get",
    headers: header,
    url: url,
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
export async function getAllClients(token, page, id) {
  const url =
    API_URL.backend_url + `clientAll?page=${page}&pageSize=20`;
  var header = {
    "Content-type": "application/json",
    Authorization: "Bearer " + token,
  };
  const response = await axios(url, {
    method: "get",
    headers: header,
    url: url,
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

export async function addClient(payload, token) {
  const url = API_URL.backend_url + "clients";
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

export async function updateClient(data, token) {
  const url = API_URL.backend_url + `updateClient/${data.id}`;
  var header = {
    "Content-type": "application/json",
    Authorization: "Bearer " + token,
  };
  const resp = await axios(url, {
    method: "PUT",
    headers: header,
    url: url,
    data: data,
  });
  return resp.status;
}

export async function getDropDowns(id, token) {
  const url = API_URL.backend_url + `api/lookUp?lookUpTypeId=${id}`;
  var header = {
    "Content-type": "application/json",
    Authorization: "Bearer " + token,
  };
  const resp = await axios(url, {
    method: "get",
    headers: header,
    url: url,
  });

  return resp.data._embedded.lookUp;
}

export async function deleteClient(token, id) {
  const url = API_URL.backend_url + `api/clients/${id}`;
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

export async function getClientDetails(token, clientCode) {
  const url = API_URL.backend_url + `clientByClientCode/${clientCode}`;
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

export async function getCategory(token) {
  const url = API_URL.backend_url + `api/category?page=0&size=20`;
  var header = {
    "Content-type": "application/json",
    Authorization: "Bearer " + token,
  };
  const resp = await axios(url, {
    method: "get",
    url: url,
    headers: header,
  });
  return resp.data._embedded.category;
}

export async function getAllClientProjection(ids, token) {
  let url = API_URL.backend_url + `api/clients?projection=clientsIdName`;
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
  return response.data._embedded.clients;
}

export async function getRegion(token, id) {
  const url = API_URL.backend_url + 'allRegions';
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

export async function getRegionById(token, regionId) {
  const url = API_URL.backend_url + "getRegionById/" + regionId;
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

export async function getState(token, regionId) {
  const url = API_URL.backend_url + `states/getStateByRegionId/${regionId}`
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

export async function getEveryState(token, page, size) {
  const url = API_URL.backend_url + `states/allStates?page=${page}&pageSize=${size}`
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

export async function getEveryCity(token, page, size) {
  const url = API_URL.backend_url + `allCities?page=${page}&pageSize=${size}`
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

export async function getStateById(token, stateId) {
  const url = API_URL.backend_url + "states/getStateById/" + stateId;
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

export async function getCity(token, stateId) {
  const url = API_URL.backend_url + `getCityByStateId/${stateId}`;
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

export async function getCityById(token, city) {
  let cityQueryString ; 
  if(Array.isArray(city)){
    cityQueryString = city.map((e) => "&id=" + e.id).join("");  
  }else{
    cityQueryString = `&id=${city}`
  }
  const url = API_URL.backend_url + `getCityById/` + cityQueryString;
  var header = {
    "Content-type": "application/json",
    Authorization: "Bearer " + token,
  };
  const resp = await axios({
    headers: header,
    method: "GET",
    url: url,
  });
  // console.log("resp.data-api", resp.data._embedded.cities)
  // console.log(resp)
  return resp.data.content;
}


export async function getCityByCityId(token, city) {
  const url = API_URL.backend_url + `getCityById/` + city;
  var header = {
    "Content-type": "application/json",
    Authorization: "Bearer " + token,
  };
  const resp = await axios({
    headers: header,
    method: "GET",
    url: url,
  });
  // console.log("resp.data-api", resp.data._embedded.cities)
  // console.log(resp)
  return resp.data;
}



export async function getDivision(token) {
  const url = API_URL.backend_url + "division/getAllDivisions";
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

export async function getAllClientByCities(token, cities, id,cancelToken) {
  const cityQueryString = cities.map((e) => "&city=" + e.id).join("");
  const url =
    API_URL.backend_url + `api/clients?createdBy=${id}` + cityQueryString;
  var header = {
    "Content-type": "application/json",
    Authorization: "Bearer " + token,
  };
  const resp = await axios({
    headers: header,
    method: "GET",
    url: url,
    cancelToken:cancelToken
  });
  return resp.data._embedded.clients;
}
