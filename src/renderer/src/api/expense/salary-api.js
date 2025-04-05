import axios from 'axios';
import {API_URL} from '../../constants/api-url';

//action creators


export async function getAllSalary(token,page,id) {
  const url = API_URL.backend_url + `api/member_salary?page=${page}&size=20`;
  var header = {
    'Content-type': 'application/json',
    Authorization: 'Bearer ' + token,
  };
  const resp = await axios(url, {
    method: 'get',
    headers: header,
    url: url,
  });
  const data = resp.data._embedded.member_salary

  return (data);
}


export async function addNewSalary(payload,token){
  const url = API_URL.backend_url + 'member_salary';
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


export async function updateMemberSalary(data,token){

  const url = API_URL.backend_url + `api/member_salary/${data.id}`;
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


export async function deleteMemberSalary(token,id){
  const url = API_URL.backend_url + `api/member_salary/${id}`;
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

export async function getMemberSalary(token,id){
  const url = API_URL.backend_url + `api/member_salary/${id}`;
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
