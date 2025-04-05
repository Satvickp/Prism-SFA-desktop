import axios from 'axios';
import { API_URL } from '../../../constants/api-url';



export async function getAllPrimarySales(token,pageNumber=0,sizeNumber=500) {
  // const url = API_URL.backend_url + `inventory-service/inventory/all?page=0&pageSize=10&sortBy=productId&sortDirection=desc`;
  const url = API_URL.backend_url + `inventory-service/inventory/all?page=${pageNumber}&pageSize=${sizeNumber}`;
  var header = {
    'Content-type': 'application/json',
    Authorization: 'Bearer ' + token,
  };
  const resp = await axios(url, {
    method: 'get',
    headers: header,
    url: url,
  });
  return resp.data;
}


export async function addNewPrimarySales(payload, token){
  const url = API_URL.backend_url + 'inventory-service/inventory/create';
  var header = {
    'Content-type': 'application/json',
    Authorization: 'Bearer ' + token,
  };
  const resp = await axios(url, {
    method: 'post',
    headers: header,
    url: url,
    data: payload
  });
  return resp;
}


export async function UpdatePrimarySales(data, id, token){

  const url = API_URL.backend_url + `inventory-service/inventory/update/${id}`;
  // const url = API_URL.backend_url + `inventory-service/inventory/update/${data.id}`;
  var header = {
    'Content-type': 'application/json',
    Authorization: 'Bearer ' + token,
  };
  const resp = await axios(url, {
    method: 'put',
    headers: header,
    url: url,
    data:data,
  });
 return resp  
}

// to delete a product (working fine)

export async function deletePrimarySales(token,id){
  const url = API_URL.backend_url + `api/primarySales/${id}`;
  var header = {
    'Content-type': 'application/json',
    Authorization: 'Bearer ' + token,
  };
  const resp = await axios(url, {
    method: 'delete',
    headers: header,
    url: url,
  });
 return resp.status
}

//working fine
export async function getPrimarySales(token,id){
  const url = API_URL.backend_url + `api/primarySales/${id}`;
  var header = {
    'Content-type': 'application/json',
    Authorization: 'Bearer ' + token,
  };
  const resp = await axios(url, {
    method: 'get',
    headers: header,
    url: url,
  });
return (resp.data)
}