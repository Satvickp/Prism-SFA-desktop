import axios from "axios";
import { API_URL } from "../../../constants/api-url";

export async function getAllSalesReturnBySaleLevel(token, page, size, clientFmcgId, salesLevel) {
    const url =
    API_URL.backend_url +
    `order-service/sales-returns/getAllReturnClientFmcgAndSalesLevel/${clientFmcgId}?&salesLevel=${salesLevel}&page=${page}&pageSize=${size}`;
  var header = {
    "Content-type": "application/json",
    Authorization: "Bearer " + token,
  };
  const resp = await axios(url, {
    method: "GET",
    headers: header,
    url: url,
  });
  return resp.data;
}


export async function getAllOrdersByClientFMCGId(token, clientFmcgId) {
  const url =
    API_URL.backend_url +
    `order-service/getAllOrder/client-fmcg/${clientFmcgId}?&page=0&pageSize=1000`;
  var header = {
    "Content-type": "application/json",
    Authorization: "Bearer " + token,
  };
  const resp = await axios(url, {
    method: "GET",
    headers: header,
    url: url,
  });
  return resp.data;
}

export async function addNewSaleReturn(payload, token) {
  const url = API_URL.backend_url + "order-service/sales-returns";
  var header = {
    "Content-type": "application/json",
    Authorization: "Bearer " + token,
  };
  const resp = await axios(url, {
    method: "POST",
    headers: header,
    url: url,
    data: payload,
  });
  return {ProductsArray: resp.data, status: resp.status};
}

export async function updateSaleReturn(token, payload, id) {
    const URL =
      API_URL.backend_url + `order-service/sales-returns/${id}`;
  
    var header = {
      "Content-type": "application/json",
      Authorization: "Bearer " + token,
    };
  
    const resp = await axios(URL, {
      method: "PUT",
      headers: header,
      url: URL,
      data: payload
    });
  
    return resp.data;
  }

export async function deleteSaleReturn(token, id) {

  const url_Master =  API_URL.backend_url + `order-service/sales-returns/${id}`;

  var header = {
    "Content-type": "application/json",
    Authorization: "Bearer " + token,
  };

  const resp = await axios(url_Master, {
    method: "DELETE",
    headers: header,
    url: url_Master,
  });
  
  return resp.status;
}