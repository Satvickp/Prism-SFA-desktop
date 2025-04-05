import axios from 'axios';
import { API_URL } from '../../../constants/api-url';

//action creators

// to get all the products -(working fine)

export async function getAllSecondarySales(token,page,id) {
  const url = API_URL.backend_url + `api/secondarySales?page=${page}&size=20`;
  var header = {
    'Content-type': 'application/json',
    Authorization: 'Bearer ' + token,
  };
  const resp = await axios(url, {
    method: 'get',
    headers: header,
    url: url,
  });
  // const data = resp.data._embedded.secondarySales
  // console.log(data)
  return {data:resp.data._embedded.secondarySales, paginationData:resp.data.page};
}

// to create a product - (working fine)

export async function addNewSecondarySales(payload,token){
  const url = API_URL.backend_url + 'secondarySales';
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
  // return resp.data
  // console.log(resp.data._embedded.secondarySales, resp.data.page)
  return resp.data;
}

// to update a product (working fine)

export async function UpdateSecondarySales(data,token){

  const url = API_URL.backend_url + `api/secondarySales/${data.saleid}`;
  var header = {
    'Content-type': 'application/json',
    Authorization: 'Bearer ' + token,
  };
  const resp = await axios(url, {
    method: 'patch',
    headers: header,
    url: url,
    data:data,
  });
 return resp.status  
}

// to delete a product (working fine)

export async function deleteSecondarySales(token,id){
  const url = API_URL.backend_url + `api/secondarySales/${id}`;
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
export async function getSecondarySales(token,id){
  const url = API_URL.backend_url + `api/secondarySales/${id}`;
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