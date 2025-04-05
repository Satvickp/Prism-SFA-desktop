import axios from "axios";
import { API_URL } from "../../constants/api-url";

export async function apiGetCityIdByCityName(name, token) {
  const url = API_URL.backend_url + `excel-helper-api/byCityName/${name}`;
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

export async function apiGetRegionIdByName(name, token) {
  const url = API_URL.backend_url + `excel-helper-api/byRegionName/${name}`;
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
export async function apiGetStateIdByName(name, token) {
  const url = API_URL.backend_url + `excel-helper-api/byStateName/${name}`;
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
export async function apiGetMemberIdByMemberCode(code, token) {
  const url = API_URL.backend_url + `getMemberByCode/${code}`;
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
export async function apiUploadClientInBulk(data, token) {
  const url = API_URL.backend_url + `client-fmcg/bulk/clientFmcg`;
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
  return response.data;
}
