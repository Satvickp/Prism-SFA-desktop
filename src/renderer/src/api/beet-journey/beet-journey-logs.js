import axios from "axios";
import { API_URL } from "../../constants/api-url";
import { fetchAPI } from "../api-utils";

const baseUrl = `${API_URL.backend_url}beet-logs/`;

export async function getAllMembersLastCheckInAndOutByReportingManagerIdAndCityIdApi(
  reportingId,
  cityId,
  token
) {
  const url = `${baseUrl}getAllMembersLastCheckInAndOutByReportingManagerId/${reportingId}/${cityId}`;
  const resp = await axios({
    url: url,
    method: "get",
    headers: {
      "Content-type": "application/json",
      Authorization: "Bearer " + token,
    },
  });
  return resp.data;
}

export async function getAllMembersLastCheckInAndOutSuperAdminIdAndCityIdApi(
  cityId,
  token
) {
  const url = `${baseUrl}getAllMembersLastCheckInAndOut/${cityId}`;
  const resp = await axios({
    url: url,
    method: "get",
    headers: {
      "Content-type": "application/json",
      Authorization: "Bearer " + token,
    },
  });
  return resp.data;
}

export async function apiGetAllBeetLogByVisitDate(date) {
  return fetchAPI({
    method: "get",
    url: `${baseUrl}findByVisitDate?visitDate=${date}`,
  });
}

export async function apiGetAllBeetLogByDateRangeAndMemberId(
  startDate,
  endDate,
  memberId
) {
  return fetchAPI({
    method: "get",
    url: `${baseUrl}findByStartAndEndDateByMemberId/${memberId}?startDate=${startDate}&endDate=${endDate}`,
  });
}

export async function apiGetAllBeetLogByVisitDateAndMemberId(
  visitDate,
  memberId
) {
  return fetchAPI({
    method: "get",
    url: `${baseUrl}findByVisitDateAndMemberId/${memberId}?visitDate=${visitDate}`,
  });
}
