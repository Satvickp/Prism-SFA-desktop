import axios from "axios";
import { API_URL } from "../../constants/api-url";

export async function addBeet(data, token) {
  const url = API_URL.backend_url + "beet";
  const resp = await axios({
    url: url,
    method: "post",
    headers: {
      "Content-type": "application/json",
      Authorization: "Bearer " + token,
    },
    data,
  });

  return resp.data;
}

export async function updateBeet(data, token) {
  const url = API_URL.backend_url + "updateBeet/" + data.id;
  const resp = await axios({
    url: url,
    method: "PUT",
    headers: {
      "Content-type": "application/json",
      Authorization: "Bearer " + token,
    },
    data,
  });

  return resp.status;
}

export async function deleteBeet(id, token) {
  const url = API_URL.backend_url + `deleteBeetById/${id}`;
  const resp = await axios({
    url: url,
    method: "DELETE",
    headers: {
      "Content-type": "application/json",
      Authorization: "Bearer " + token,
    },
  });
  return resp.status;
}

// export async function getAllBeet(token, page, size, memberId) {
//   const url = API_URL.backend_url + "beetAll";
//   const resp = await axios({
//     url: url,
//     method: "get",
//     headers: {
//       "Content-type": "application/json",
//       Authorization: "Bearer " + token,
//     },
//   });
//   return resp.data;
// }

export async function getAllBeetByMemberId(token, page, size, memberId) {
  const url = API_URL.backend_url + "getAllBeetsByMemberId/" + memberId;
  const resp = await axios({
    url: url,
    method: "get",
    headers: {
      "Content-type": "application/json",
      Authorization: "Bearer " + token,
    },
  });
  return resp.data;
}

export async function getAllDoctorsByBeatId(token, beatId) {
  const url = API_URL.backend_url + "doctors/getAllDoctorsByBeetId/" + beatId;
  const resp = await axios({
    url: url,
    method: "get",
    headers: {
      "Content-type": "application/json",
      Authorization: "Bearer " + token,
    },
  });
  return resp.data.content;
}

export async function addOutLet(token, payload) {
  const url = API_URL.backend_url + "outletMapWithBeet";
  const resp = await axios({
    url: url,
    method: "post",
    headers: {
      "Content-type": "application/json",
      Authorization: "Bearer " + token,
    },
    data: payload,
  });
  return resp.data;
}

export async function updateOutLet(token, payload) {
  const url = API_URL.backend_url + "updateOutletById/" + payload.id;
  const resp = await axios({
    url: url,
    method: "PUT",
    headers: {
      "Content-type": "application/json",
      Authorization: "Bearer " + token,
    },
    data: payload,
  });
  return resp.status;
}
export async function deleteOutlet(token, outletId) {
  const url = API_URL.backend_url + `deleteOutletById/${outletId}`;
  const resp = await axios({
    url: url,
    method: "DELETE",
    headers: {
      "Content-type": "application/json",
      Authorization: "Bearer " + token,
    },
  });
  return resp.status;
}

export async function getAllBeetWithoutFilter(token, page, size) {
  const url = API_URL.backend_url + `beetAll?page=${0}&size=${1000}&sort=desc`;
  const resp = await axios({
    url: url,
    method: "get",
    headers: {
      "Content-type": "application/json",
      Authorization: "Bearer " + token,
    },
  });
  return resp.data;
}
export async function getAllBeetByFmcgClient(token, page, size, id) {
  const url =
    API_URL.backend_url +
    `getAllBeetsByClientFmcgId/${id}?page=${page}&size=${size}`;
  const resp = await axios({
    url: url,
    method: "get",
    headers: {
      "Content-type": "application/json",
      Authorization: "Bearer " + token,
    },
  });
  return resp.data;
}
