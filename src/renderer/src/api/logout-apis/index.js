import { API_URL } from "../../constants/api-url";
import { fetchAPI } from "../api-utils";

const baseUrl = `${API_URL.backend_url}members/logout`;

export const apiGetAllDeviceListByMemberId = async (memberId) => {
  return await fetchAPI({
    url: `${baseUrl}/getAllLogsByMemberId/${memberId}`,
    method: "GET",
  });
};


export async function apiHandleLogOut(memberId, lat, long) {
  return await fetchAPI({
    url: `${baseUrl}/${memberId}?latitude=${lat}&longitude=${long}`,
    method: 'POST',
  });
}


export async function apiHandleApproval(logId,approvalStatus) {
  return await fetchAPI({
    url: `${baseUrl}/${logId}/approval?approvalStatus=${approvalStatus}`,
    method: 'PUT',
  });
}