import { fetchAPI } from "../api-utils";

const { API_URL } = require("../../constants/api-url");

const baseUrl = `${API_URL.backend_url}`;

export const apiGetAllCityByStateId = async (stateId) => {
    return await fetchAPI({
        url: `${baseUrl}getCityByStateId/${stateId}?page=0&pageSize=${500}&sortBy=id&sortDirection=asc`
    })
}