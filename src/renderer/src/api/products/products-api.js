import axios from "axios";
import { API_URL } from "../../constants/api-url";

//action creators

// to get all the  -(working fine)

export async function getAllProducts(token, page, size) {
  const url =
    API_URL.backend_url +
    `product-service/products/all?page=${0}&pageSize=${size}`;
  // const url = `/api/product-service/products/all`;
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
// to create a product - (working fine)

export async function addNewProduct(payload, token) {
  const url = API_URL.backend_url + "product-service/products";
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
  return { ...payload, productId: resp.data.productId, imageUrl: resp.data.imageUrl };
}

// to update a product (working fine)

export async function updateProduct(data, id, token) {
  const url = API_URL.backend_url + `product-service/products/${id}`;
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
}

// to delete a product (working fine)

export async function deleteProduct(token, id) {

  const url_Price =
    API_URL.backend_url + `product-service/products/${id}?type=price`;

  const url_Master =
    API_URL.backend_url + `product-service/products/${id}?type=master`;

  var header = {
    "Content-type": "application/json",
    Authorization: "Bearer " + token,
  };

  const resp1 = await axios(url_Price, {
    method: "DELETE",
    headers: header,
    url: url_Price,
  });
  const resp2 = await axios(url_Master, {
    method: "DELETE",
    headers: header,
    url: url_Master,
  });
  
  return resp1 === 200 && resp2 === 200 ? 200 : 404;
}

//working fine
export async function getProductDetails(token, id) {
  const url = API_URL.backend_url + `product-service/products/10/${id}`;
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
