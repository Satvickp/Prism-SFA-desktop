import axios from "axios";
import { API_URL } from "../../constants/api-url";
import { fetchAPI } from "../api-utils";


export async function getRegion(token: string) {
  const url = API_URL.backend_url + "api/regions";
  var header = {
    "Content-type": "application/json",
    Authorization: "Bearer " + token,
  };
  const resp = await axios({
    headers: header,
    method: "GET",
    url: url,
  });
  return resp.data._embedded.regions;
}

export async function getRegionById(token: string, regionId: number) {
  const url = API_URL.backend_url + "api/regions/" + regionId;
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

export async function getState(token: string, regionId: number) {
  const url = API_URL.backend_url + "api/states?region_id=" + regionId;
  var header = {
    "Content-type": "application/json",
    Authorization: "Bearer " + token,
  };
  const resp = await axios({
    headers: header,
    method: "GET",
    url: url,
  });
  return resp.data._embedded.states;
}

export async function getStateById(token: string, stateId: number) {
  const url = API_URL.backend_url + "api/states/" + stateId;
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

export async function getCity(token: string, stateId: number) {
  const url = API_URL.backend_url + "api/cities?state_id=" + stateId;
  var header = {
    "Content-type": "application/json",
    Authorization: "Bearer " + token,
  };
  const resp = await axios({
    headers: header,
    method: "GET",
    url: url,
  });
  return resp.data._embedded.cities;
}
export async function getCityById(token: string, cityId: number) {
  const url = API_URL.backend_url + "api/cities/" + cityId;
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

export async function getDivision(token: string) {
  const url = API_URL.backend_url + "api/division";
  var header = {
    "Content-type": "application/json",
    Authorization: "Bearer " + token,
  };
  const resp = await axios({
    headers: header,
    method: "GET",
    url: url,
  });
  return resp.data._embedded.division;
}