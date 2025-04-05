import { API_URL } from "../../constants/api-url";
import { fetchAPI } from "../api-utils";

const baseUrlState = `${API_URL.backend_url}states`;

export async function apiGetAllState() {
  return await fetchAPI({
    url: `${baseUrlState}/allStates?page=0&pageSize=500&sortBy=id&sortDirection=desc`,
    method: "GET"
  });
}