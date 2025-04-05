import axios from "axios";
import { API_URL } from "../../constants/api-url";

export async function createSample(token, data) {
  const url = API_URL.backend_url + `inventory-service/sample-inventory/create`;
  var header = {
    "Content-type": "application/json",
    Authorization: "Bearer " + token,
  };
  const response = await axios({
    headers: header,
    url: url,
    method: "POST",
    data: data,
  });
  return response.data;
}

export async function getAllSample(token, id, page) {
  const url =
    API_URL.backend_url +
    `inventory-service/sample-inventory/getAllSampleMemberById/${id}?page=${page}&pageSize=500&sortBy=createdDate&sortDirection=dsc`;
  var header = {
    "Content-type": "application/json",
    Authorization: "Bearer " + token,
  };
  const response = await axios({
    headers: header,
    url: url,
    method: "GET",
  });
  return {
    data: response.data.content,
    paginationData: response.data.page,
  };
}

export async function deleteSampleInventory(token, id) {
  const url =
    API_URL.backend_url + `inventory-service/sample-inventory/delete/${id}`;
  var header = {
    "Content-type": "application/json",
    Authorization: "Bearer " + token,
  };
  const response = await axios({
    headers: header,
    url: url,
    method: "DELETE",
  });
  return response;
}

export async function updateSampleInventory(token, id, quantity) {
  const url =
    API_URL.backend_url +
    `inventory-service/sample-inventory/updateSampleInventoryQuantity/${id}/${quantity}`;
  var header = {
    "Content-type": "application/json",
    Authorization: "Bearer " + token,
  };
  const response = await axios({
    headers: header,
    url: url,
    method: "PUT",
  });
  return response;
}
