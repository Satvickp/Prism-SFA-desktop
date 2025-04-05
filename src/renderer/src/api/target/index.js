const { API_URL } = require("../../constants/api-url");
const { fetchAPI } = require("../api-utils");

const baseUrlTarget = `${API_URL.backend_url}`;

export async function apiCreateTarget(data) {
  return await fetchAPI({
    method: "POST",
    url: `${baseUrlTarget}createTarget`,
    data,
  });
}

export async function apiGetAllTargetByCityAndDate(startDate, endDate, cityId)  {
  return await fetchAPI({
    method: "GET",
    url: `${baseUrlTarget}`
  });
}