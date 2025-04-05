import axios from "axios";
import { API_URL } from "../../constants/api-url";
import { fetchAPI } from "../api-utils";

export async function getAllExpenseByReportingManagerId(
  token,
  page,
  approvedBy
) {
  const url =
    // API_URL.backend_url + `/${approvedBy}?page=${page}&pageSize=500`;
    API_URL.backend_url +
    `getAllExpensesByReportingManager/${approvedBy}?page=${page}&pageSize=500`;
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

export async function getAllExpenseByMemberId(token, page, approvedBy) {
  const url = API_URL.backend_url + `expenseByEmployeeId/${approvedBy}`;
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
    data: [...response.data.content],
    paginationData: {
      totalElements: 0,
      totalPages: 0,
      page: 0,
    },
  };
}

export async function getAllExpense(token, page, approvedBy) {
  const url = API_URL.backend_url + `expenseAll?page=${page}&pageSize=500`;
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

export async function createExpense(token, payload) {
  const url = API_URL.backend_url + "expense";
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

export async function updateExpense(token, id, payload) {
  const url = API_URL.backend_url + `updateExpenseById/${id}`;
  var header = {
    "Content-type": "application/json",
    Authorization: "Bearer " + token,
  };
  const resp = await axios(url, {
    method: "put",
    headers: header,
    url: url,
    data: payload,
  });
  return resp.data;
}

export async function getExpenseType(token) {
  const url = API_URL.backend_url + `api/expenseType`;
  var header = {
    "Content-type": "application/json",
    Authorization: "Bearer " + token,
  };
  const resp = await axios(url, {
    method: "get",
    headers: header,
    url: url,
  });
  return resp.data._embedded.expenseType;
}

export async function apiGetAllExpenseByMemberIdAndDateRange(payload) {
  return await fetchAPI({
    url: `${API_URL.backend_url}getAllExpenseByDateAndMemberId`,
    data: payload,
    method: "POST",
  });
}
