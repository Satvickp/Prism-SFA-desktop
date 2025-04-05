import axios from "axios";
import { API_URL } from "../../constants/api-url";
import { fetchAPI } from "../api-utils";

const baseUrlOrder = `${API_URL.backend_url}order-service/`;

export const createOrderApi = async (payload, token) => {
  const url = API_URL.backend_url + "order-service/orders";
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
  return resp.data;
};

export const createBulkOrderApi = async (salesType, payload, token) => {
  const url =
    API_URL.backend_url +
    "order-service/createOrderInBulk?salesType=" +
    salesType;
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
  return resp.data;
};
export const updateOrderApi = async (id, status, remarks, token, quantity) => {
  const url = API_URL.backend_url + `order-service/orders/${id}`;
  var header = {
    "Content-type": "application/json",
    Authorization: "Bearer " + token,
  };
  const resp = await axios(url, {
    method: "put",
    headers: header,
    url: url,
    data: {
      status,
      remarks,
      quantity,
    },
  });
  return resp.data;
};
export const updateOrderQuantityApi = async (
  id,
  status,
  remarks,
  token,
  quantity
) => {
  const url = API_URL.backend_url + `order-service/orders/updateQuantity`;
  var header = {
    "Content-type": "application/json",
    Authorization: "Bearer " + token,
  };
  const resp = await axios(url, {
    method: "put",
    headers: header,
    url: url,
    data: {
      status,
      remarks,
      quantity,
      orderId: id,
    },
  });
  return resp.data;
};
export const updateOrderBulkApi = async (token, data) => {
  const url = API_URL.backend_url + `order-service/updateOrderInBulk`;
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
  return resp.data;
};

export const getAllOrderByFMCGClientAndSales = async (
  page,
  size,
  id,
  salesLevel,
  token
) => {
  const url =
    API_URL.backend_url +
    `order-service/getOrdersGroupedByInvoiceWithSalesLevel?clientFmcgId=${id}&salesLevel=${salesLevel}&page=${page}&size=${size}`;
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
};

export const getAllOrderByReportingManager = async (
  page,
  size,
  id,
  salesLevel,
  token,
  isMangerSaleIncluded
) => {
  const url =
    API_URL.backend_url +
    `order-service/getOrdersGroupedByInvoiceByReportingManagerId?reportingManagerId=${id}&salesLevel=${salesLevel}&page=${page}&size=${size}&isMangerSaleIncluded=${isMangerSaleIncluded}`;
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
};

export const getAllOrderByInvoiceNumber = async (invoiceNumber, token) => {
  const url =
    API_URL.backend_url +
    `order-service/getAllOrderByInvoiceNumber/${invoiceNumber}`;
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
};

export const getOrderByOrderId = async (orderId, token, salesLevel) => {
  const url =
    API_URL.backend_url +
    `order-service/getOrderDetailBySalesLevelById/${orderId}/${salesLevel}`;
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
};

export const apiGetAllOrderBySalesLevelAndStartAndEndDate = async (
  salesLevel,
  startDate,
  endDate
) => {
  return await fetchAPI({
    url:
      API_URL.backend_url +
      `order-service/reports/overall-sales/byDateAndSalesLevel?startDate=${startDate}&endDate=${endDate}&salesLevel=${salesLevel}`,
    method: "GET",
  });
};

export const apiGetAllOrderBySalesLevelAndStartByMemberId = async (
  salesLevel,
  startDate,
  endDate,
  id
) => {
  return await fetchAPI({
    url:
      API_URL.backend_url +
      `order-service/reports/overall-sales/byDateAndSalesLevelAndMemberId?startDate=${startDate}&endDate=${endDate}&salesLevel=${salesLevel}&memberId=${id}`,
    method: "GET",
  });
};
