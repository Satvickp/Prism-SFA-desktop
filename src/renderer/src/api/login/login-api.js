import axios from "axios";
import { API_URL } from "../../constants/api-url";

export async function loginMember(mobile, password) {
  console.log("loginapi", API_URL.backend_url);
  const url = API_URL.backend_url + "authenticate";
  var header = {
    "Content-type": "application/json",
  };
  const response = await axios({
    headers: header,
    url: url,
    method: "POST",
    data: {
      mobile: mobile,
      password: password.toString(),
      webLogin: true,
    },
    timeout: 30000,
    timeoutErrorMessage: "Time Out. Please Try With Some Better Network",
  });
  //   console.log(response)
  return { token: response.data, statusCode: response.status };
}

export async function getTenantMember(id) {
  const url = API_URL.SERVICE_URL + `tenant/tenant/${id}`;
  const response = await axios({
    headers: {
      "Content-type": "application/json",
    },
    url: url,
    method: "GET",
    timeout: 30000,
    timeoutErrorMessage: "Time Out. Please Try With Some Better Network",
  });
  return { data: response.data.message, statusCode: response.status };
}

export async function loginClientFMCG(clientCode, password) {
  const url = API_URL.backend_url + "client-fmcg/clientFmcgLogin";
  var header = {
    "Content-type": "application/json",
  };
  const response = await axios({
    headers: header,
    url: url,
    method: "POST",
    data: {
      clientCode: clientCode,
      password: password.toString(),
    },
    timeout: 30000,
    timeoutErrorMessage: "Time Out. Please Try With Some Better Network",
  });
  //   console.log(response)
  return { token: response.data, statusCode: response.status };
}
