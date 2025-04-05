import { API_URL } from "../../constants/api-url";
import { fetchAPI } from "../api-utils";

const _baseColabUrl = `${API_URL.backend_url}combine-tour-plan`;

export async function apiGetTodayPatchJourney(memberId, visitDate) {
  return fetchAPI({
    method: "get",
    url: `${_baseColabUrl}/getTodayCombinePlanByMemberId/${memberId}?visitDate=${visitDate}`,
  });
}

export async function apiGetAllPatchLogByVisitDate(date) {
  return fetchAPI({
    method: "get",
    url: `${_baseColabUrl}/findByVisitDateForCombineTour?visitDate=${date}`,
  });
}

export async function apiGetAllPatchNotCreatedByVisitDate(date) {
  return fetchAPI({
    method: "get",
    url: `${_baseColabUrl}/getAllMemberWithoutPlanByDate?visitDate=${date}`,
  });
}

export async function apiGetAllPatchLogByDateRangeAndMemberId(
  startDate,
  endDate,
  memberId
) {
  return fetchAPI({
    method: "get",
    url: `${_baseColabUrl}/findByStartAndEndDateByMemberIdForBjpAndDjpAndCjp/${memberId}?startDate=${startDate}&endDate=${endDate}`,
  });
}