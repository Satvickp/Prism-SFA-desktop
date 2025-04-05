import axios from 'axios';
import {API_URL} from '../../constants/api-url';

//action creators

export async function getStatus(token,page, id) {
  const url = API_URL.backend_url + `api/daily_status?page=${page}&size=20`;
  var header = {
    'Content-type': 'application/json',
    Authorization: 'Bearer ' + token,
  };
  const resp = await axios(url, {
    method: 'get',
    headers: header,
    url: url,
  });
  // console.log(resp)
  return {data:resp.data._embedded.daily_status,paginationData:resp.data.page};
}


export async function addNewStatus(payload,token){
  const url = API_URL.backend_url + 'daily_status';
  var header = {
    'Content-type': 'application/json',
    Authorization: 'Bearer ' + token,
  };
  const resp = await axios(url, {
    method: 'post',
    headers: header,
    url: url,
    data:payload
  });
  return resp.data
}

// // to update a product (working fine)

export async function updateCurrentStatus(data,token){

  const url = API_URL.backend_url + `api/daily_status/${data.id}`;
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
 return resp.data
}

// // to delete a product (working fine)

export async function deleteCurrentStatus(token,id){
  const url = API_URL.backend_url + `api/daily_status/${id}`;
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

// //working fine
export async function getStatusDetails(token,id){
  const url = API_URL.backend_url + `api/daily_status/${id}`;
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