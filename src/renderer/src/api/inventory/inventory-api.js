import axios from "axios";
import { API_URL } from "../../constants/api-url";

export async function getAllInventory(token, pageNumber = 0, sizeNumber = 500) {
  // const url = API_URL.backend_url + `inventory-service/inventory/all?page=0&pageSize=10&sortBy=productId&sortDirection=desc`;
  const url =
    API_URL.backend_url +
    `inventory-service/inventory/all?page=${pageNumber}&pageSize=${sizeNumber}`;
  var header = {
    "Content-type": "application/json",
    Authorization: "Bearer " + token,
  };
  const resp = await axios(url, {
    method: "get",
    headers: header,
    url: url,
  });
  return resp.data;
}

export async function addNewInventory(payload, token) {
  const url = API_URL.backend_url + "inventory-service/inventory/create";
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
  return resp;
}
export async function addNewInventoryBulk(payload, token) {
  const url = API_URL.backend_url + "inventory-service/createInventoryInBulk";
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
  return resp;
}

export async function UpdateInventory(data, id, token) {
  const url = API_URL.backend_url + `inventory-service/inventory/update/${id}`;
  // const url = API_URL.backend_url + `inventory-service/inventory/update/${data.id}`;
  var header = {
    "Content-type": "application/json",
    Authorization: "Bearer " + token,
  };
  const resp = await axios(url, {
    method: "put",
    headers: header,
    url: url,
    data: data,
  });
  return resp;
}

export async function UpdateInventoryBulk(data, token) {
  const url = API_URL.backend_url + `inventory-service/updateInventoryInBulk`;
  var header = {
    "Content-type": "application/json",
    Authorization: "Bearer " + token,
  };
  const resp = await axios(url, {
    method: "put",
    headers: header,
    url: url,
    data: data,
  });
  return resp;
}
// to delete a product (working fine)

export async function deleteInventory(token, id) {
  const url = API_URL.backend_url + `api/Inventory/${id}`;
  var header = {
    "Content-type": "application/json",
    Authorization: "Bearer " + token,
  };
  const resp = await axios(url, {
    method: "delete",
    headers: header,
    url: url,
  });
  return resp.status;
}

//working fine
export async function getInventory(token, productId, clientFmcgId) {
  const url =
    API_URL.backend_url +
    `inventory-service/getInventoryByClientFmcgIdAndProductId?clientFmcgId=${clientFmcgId}&productId=${productId}`;
  var header = {
    "Content-type": "application/json",
    Authorization: "Bearer " + token,
  };
  const resp = await axios(url, {
    method: "get",
    headers: header,
    url: url,
  });
  return resp.data;
}

export async function getAllInventoryWithProductAndClientFilter(
  clientId,
  page,
  size,
  token
) {
  const url =
    API_URL.backend_url +
    `inventory-service/inventoryWithProductNameWithClientFmcgResponse/all/${clientId}?page=${page}&PageSize=${size}`;
  var header = {
    "Content-type": "application/json",
    Authorization: "Bearer " + token,
  };
  const resp = await axios(url, {
    method: "get",
    headers: header,
    url: url,
  });
  return resp.data;
}

export async function getAllInventoryByMemberId(
  memberId,
  page,
  size,
  token
) {
  const url =
    API_URL.backend_url +
    `inventory-service/getAllClientInventoryByMemberId/${memberId}?page=${page}&size=${size}`;
  var header = {
    "Content-type": "application/json",
    Authorization: "Bearer " + token,
  };
  const resp = await axios(url, {
    method: "get",
    headers: header,
    url: url,
  });
  return resp.data;
}
