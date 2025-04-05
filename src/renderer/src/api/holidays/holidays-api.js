import axios from "axios";
import { API_URL } from "../../constants/api-url";

export async function getAllHolidays(token, page=0) {
  const url = API_URL.backend_url + `holidayAll?page=${page}&pageSize=500`;
  var header = {
    "Content-type": "application/json",
    Authorization: "Bearer " + token,
  };
  var response = await axios(url, {
    headers: header,
    method: "GET",
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

export async function DeleteHoliday(token, id) {
  const url = API_URL.backend_url + `holidaysById/${id}`;
  var header = {
    "Content-type": "application/json",
    Authorization: "Bearer " + token,
  };
  const response = await axios({
    headers: header,
    url: url,
    method: "DELETE",
  });
  return response.status;
}

export async function UpdateHoliday(data, token) {
  const url = API_URL.backend_url + `updateHolidaysById/${data.id}`;
  var header = {
    "Content-type": "application/json",
    Authorization: "Bearer " + token,
  };

  const payload = {
    holidayName: data.holidayName,
    holidayDate: data.holidayDate,
  };
  const resp = await axios({
    headers: header,
    url: url,
    method: "PUT",
    data: payload,
  });

  return resp.data;
}

export async function createHoliday(token, payload) {
  const url = API_URL.backend_url + "holidays";
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
