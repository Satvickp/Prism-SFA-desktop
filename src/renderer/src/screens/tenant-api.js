import axios from "axios";
import { API_URL } from "../../constants/api-url";

export async function getAllTenant(token, page, size) {
  const url =
    API_URL.backend_url +
    "tenant/api/tenant?" +
    "page=" +
    page +
    "&size=" +
    size;
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

export async function getTenantByReportingManagerId(token, id) {
  const url = API_URL.backend_url + `tenant/api/tenant/${id}`;
  const resp = await axios({
    url: url,
    method: "get",
    headers: {
      "Content-type": "application/json",
      Authorization: "Bearer " + token,
    },
  });
  return resp.data.tenantId;
}
